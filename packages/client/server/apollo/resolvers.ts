import { GraphQLScalarType, Kind } from 'graphql';

import { PostInput, TagInput, CreateUserInput } from './types.js';
import { Tag, Post, User, BBFiles } from './models.js';

import { postTags } from './resolvers/Posts/tags.js';
import { postsQuery } from './resolvers/queries/posts.js';
import { loginUser } from './resolvers/mutations/login-user.js';
import { deleteTag } from './resolvers/mutations/delete-tag.js';

// Вспомогательная функция для парсинга литералов AST
const parseLiteral = (ast: any) => {
  switch (ast.kind) {
    case Kind.STRING:
      return ast.value;
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
      return parseInt(ast.value, 10);
    case Kind.FLOAT:
      return parseFloat(ast.value);
    case Kind.OBJECT: {
      const value = Object.create(null);
      ast.fields.forEach((field: any) => {
        value[field.name.value] = parseLiteral(field.value);
      });
      return value;
    }
    case Kind.LIST:
      return ast.values.map(parseLiteral);
    default:
      return null;
  }
};

export const resolvers = {
  Tag: {
    posts: async (parent: any) => {
      return await Post.find({ tags: { $in: parent.id } }).exec();
    },
  },

  Post: {
    tags: postTags,
  },

  Query: {
    cdnPhotos: async (_: any, args: any = { limit: 50, skip: 0 }) => {
      const bbfiles = await BBFiles.find({ published: false })
        .limit(args.limit)
        .skip(args.skip)
        .exec();

      return bbfiles;
    },
    tag: async (_: any, args: any) => {
      return await Tag.findById(args.id).exec();
    },

    tags: async () => {
      return await Tag.find().sort({ name: 1 }).exec();
    },

    post: async (_: any, args: any) => {
      return await Post.findById(args.id).exec();
    },

    posts: postsQuery,

    user: async (_: any, args: any) => {
      return await User.findById(args.id).lean().exec();
    },

    users: async () => {
      return await User.find().lean().exec();
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

  JSON: new GraphQLScalarType({
    name: 'JSON',
    description: 'Arbitrary JSON value',
    parseValue(value) {
      return value; // value from the client input variables
    },
    serialize(value) {
      return value; // value sent to the client
    },
    parseLiteral(ast) {
      switch (ast.kind) {
        case Kind.STRING:
        case Kind.BOOLEAN:
        case Kind.INT:
        case Kind.FLOAT:
        case Kind.OBJECT:
        case Kind.LIST:
          return parseLiteral(ast);
        default:
          return null;
      }
    },
  }),
};
