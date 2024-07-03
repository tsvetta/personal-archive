import { GraphQLScalarType, Kind } from 'graphql';
import { Tag, Post } from './models.js';

type TagInput = {
  name: Required<String>;
};

type Photo = {
  src: Required<String>;
  description?: String;
};

export enum Privacy {
  'ALL',
  'FAMILY',
  'FRIENDS',
  'CLOSE_FRIENDS',
  'TSVETTA',
}

type PostInput = {
  date: Date;
  title: String;
  photos: Photo[];
  tags: String[];
  text: String;
  privacy: Required<Privacy>;
};

export const resolvers = {
  Tag: {
    posts: async (parent: any) => {
      return await Post.find({ tags: { $in: parent.id } });
    },
  },

  Post: {
    tags: async ({ tags }: any) => {
      const newTags = await Promise.all(
        tags.map((tagId: string) => Tag.findById(tagId))
      );

      return newTags;
    },
  },

  Query: {
    tag: async (_: any, args: any) => {
      return await Tag.findById(args.id);
    },

    tags: async () => {
      return await Tag.find({}).sort({ name: 1 }).exec();
    },

    post: async (_: any, args: any) => {
      return await Post.findById(args.id);
    },

    posts: async () => {
      return await Post.find({}).sort({ date: 1 }).exec();
    },
  },

  Mutation: {
    addTag: async (_: any, args: TagInput) => {
      const { name } = args;
      const newTag = new Tag({ name });

      await newTag.save();

      return newTag;
    },

    deleteTag: async (_: any, args: { id: String }) => {
      await Tag.findByIdAndDelete(args.id);

      return Tag.find({});
    },

    addPost: async (_: any, args: { data: PostInput }) => {
      const newPost = new Post(args.data);

      console.log('addPost', newPost);
      return;

      await newPost.save();

      return newPost;
    },

    // TODO: check
    updatePost: async (_: any, args: { id: String; data: PostInput }) => {
      const updatedPost = await Post.findByIdAndUpdate(args.id, args.data);

      return updatedPost;
    },

    deletePost: async (_: any, args: { id: String }) => {
      await Post.findByIdAndDelete(args.id);

      return Post.find({});
    },

    submitLoginForm: (_: any, args: { name: string; password: string }) => {
      console.log('apollo Login Form data received:', args);

      return {
        success: true,
        message: 'Form submitted successfully!',
      };
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
