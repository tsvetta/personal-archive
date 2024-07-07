import 'dotenv/config';
import jwt from 'jsonwebtoken';

import { GraphQLScalarType, Kind } from 'graphql';
import { verifyPassword } from '@archive/common/crypt-pass.js';
import { Tag, Post, User } from './models.js';
import { ApolloContext } from './context.js';

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

type UserInput = {
  username: String;
  password: String;
  role: Required<Privacy>;
};

export const resolvers = {
  Tag: {
    posts: async (parent: any) => {
      return await Post.find({ tags: { $in: parent.id } });
    },
  },

  Post: {
    tags: async (parent: any) => {
      try {
        const post = await Post.findById(parent.id).populate('tags').exec();

        return post?.tags;
      } catch (err: any) {
        throw new Error(
          `Failed to fetch tags for post ${parent.id}: ${err.message}`
        );
      }
    },
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

    posts: async () => {
      return await Post.find().sort({ date: 1 }).exec();
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

    deleteTag: async (_: any, args: { id: String }) => {
      const posts = await Post.find({ tags: { $in: args.id } });

      if (posts.length > 0) {
        throw new Error(
          'Apollo: Невозможно удалить пользователя, у которого есть связанные посты'
        );
      }

      await Tag.findOneAndDelete({ _id: args.id });

      return Tag.find({});
    },

    addPost: async (_: any, args: { data: PostInput }) => {
      const newPost = new Post(args.data);

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

    loginUser: async (
      _: any,
      args: { data: { username: string; password: string } },
      context: ApolloContext
    ) => {
      const { username, password } = args.data;

      const user = await User.findOne({ username });

      if (!user) {
        throw new Error('Incorrect username or password');
      }

      const isPasswordValid = await verifyPassword(user?.password, password);

      if (!isPasswordValid) {
        throw new Error('Incorrect username or password');
      }

      const authToken = jwt.sign(
        {
          userId: user._id,
          username: user.username,
          role: user.role,
        },
        process.env.SECRET_KEY || '',
        { expiresIn: '1h' }
      );

      const refreshToken = jwt.sign(
        {
          userId: user._id,
          username: user.username,
          role: user.role,
        },
        process.env.SECRET_KEY || '',
        { expiresIn: '1d' }
      );

      context.universalCookies?.set('auth_token', authToken, {
        httpOnly: true, // Куки доступны только для сервера
        secure: process.env.NODE_ENV === 'production', // Требуется HTTPS в production
        maxAge: 3600000, // Время жизни куки (в миллисекундах, здесь 1 час)
        sameSite: 'strict', // Ограничение куки для отправки только с того же сайта
      });

      return {
        // authToken,
        refreshToken,
        user,
      };
    },

    addUser: async (_: any, args: { data: UserInput }) => {
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
