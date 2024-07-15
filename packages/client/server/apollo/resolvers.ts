import jwt from 'jsonwebtoken';
import { GraphQLScalarType, Kind } from 'graphql';

import { Tag, Post, User } from './models.js';
import { loginUser } from './resolvers/mutations/login-user.js';
import { deleteTag } from './resolvers/mutations/delete-tag.js';
import {
  PostInput,
  TagInput,
  UserDataFromToken,
  CreateUserInput,
} from './types.js';
import { postTags } from './resolvers/Posts/tags.js';
import { ApolloContext } from './context.js';
import { AuthenticationError } from 'apollo-server-express';

export const resolvers = {
  Tag: {
    posts: async (parent: any) => {
      return await Post.find({ tags: { $in: parent.id } });
    },
  },

  Post: {
    tags: postTags,
  },

  Query: {
    tag: async (_: any, args: any) => {
      return await Tag.findById(args.id);
    },

    tags: async () => {
      return await Tag.find().sort({ name: 1 }).exec();
    },

    post: async (_: any, args: any) => {
      return await Post.findById(args.id);
    },

    posts: async (_: any, __: any, { user }: ApolloContext) => {
      try {
        const filteredByRole = await Post.find({ privacy: user?.role })
          .sort({ date: 1 })
          .exec();

        console.log('\n filtered posts by role', filteredByRole);

        return filteredByRole;
      } catch (e) {
        return e;
      }
    },

    user: async (_: any, args: any) => {
      return await User.findById(args.id);
    },

    users: async () => {
      return await User.find().exec();
    },
  },

  Mutation: {
    addTag: async (_: any, { name }: TagInput) => {
      const newTag = new Tag({ name });

      await newTag.save();

      return newTag;
    },

    deleteTag,

    addPost: async (_: any, args: { data: PostInput }) => {
      const newPost = new Post(args.data);

      await newPost.save();

      return newPost;
    },

    updatePost: async (_: any, args: { id: String; data: PostInput }) => {
      const updatedPost = await Post.findByIdAndUpdate(args.id, args.data);

      return updatedPost;
    },

    deletePost: async (_: any, args: { id: String }) => {
      await Post.findByIdAndDelete(args.id);

      return Post.find({});
    },

    loginUser,

    addUser: async (_: any, args: { data: CreateUserInput }) => {
      const newUser = new User(args.data);

      await newUser.save();

      return newUser;
    },
  },

  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value: any) {
      return new Date(value); // value from the client
    },
    serialize(value: any) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(+ast.value); // ast value is always in string format
      }
      return null;
    },
  }),
};
