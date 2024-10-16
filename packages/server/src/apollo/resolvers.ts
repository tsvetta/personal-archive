import { GraphQLScalarType, Kind, ValueNode } from 'graphql';

import { PostInput, TagInput, CreateUserInput } from './types.js';
import { Tag, Post, User, BBFile } from './models.js';

import { postTags } from './resolvers/Posts/tags.js';
import { postsQuery } from './resolvers/queries/posts.js';
import { loginUser } from './resolvers/mutations/login-user.js';
import { logoutUser } from './resolvers/mutations/logout-user.js';
import { deleteTag } from './resolvers/mutations/delete-tag.js';
import { setPhotoPublished } from './resolvers/mutations/set-photo-published.js';
import { ApolloContext } from './context.js';
import { AuthorizationError } from './errors.js';

import { normalizePostDate } from '@archive/common/dates/normalize-post-date.js';

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

const getIntValueFromNode = (node: ValueNode): number | undefined => {
  if (node && node.kind === Kind.INT) {
    return parseInt(node.value, 10);
  }
  return undefined;
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
    cdnPhoto: async (_: any, args: any) => {
      const singlePhoto = await BBFile.findById(args.id).exec();

      return singlePhoto;
    },
    cdnPhotos: async (
      _: any,
      args: any = { published: false, limit: 50, skip: 0 }
    ) => {
      const bbfile = await BBFile.find({ published: args.published })
        .limit(args.limit)
        .skip(args.skip)
        .exec();

      return bbfile;
    },
    tag: async (_: any, args: any) => {
      return await Tag.findById(args.id).exec();
    },

    tags: async () => {
      return await Tag.find().sort({ name: 1 }).exec();
    },

    post: async (_: any, args: any) => {
      return await Post.findById(args.id)
        .populate('tags')
        .populate('photos.file')
        .exec();
    },

    posts: postsQuery,

    user: async (_: any, args: any, { user }: ApolloContext) => {
      if (!user) {
        throw new AuthorizationError('Unauthorized');
      }

      return await User.findById(args.id).lean().exec();
    },

    users: async () => {
      return await User.find().lean().exec();
    },
  },

  Mutation: {
    addTag: async (_: any, { name }: TagInput, { user }: ApolloContext) => {
      if (!user) {
        throw new AuthorizationError('Unauthorized');
      }

      const newTag = new Tag({ name });

      await newTag.save();

      return newTag;
    },

    deleteTag,

    addPost: async (
      _: any,
      args: { data: PostInput },
      { user }: ApolloContext
    ) => {
      if (!user) {
        throw new AuthorizationError('Unauthorized');
      }

      const newPost = new Post({
        ...args.data,
        normalizedDate: normalizePostDate(args.data.date),
        createdAt: Date.now(),
      });

      await newPost.save();

      return newPost;
    },

    updatePost: async (_: any, args: { id: string; data: PostInput }) => {
      const updatedPost = await Post.findByIdAndUpdate(args.id, args.data, {
        new: true,
      }).exec();

      return updatedPost;
    },

    deletePost: async (_: any, args: { id: string }) => {
      await Post.findOneAndDelete({ _id: args.id }).exec();

      return Post.find({});
    },

    loginUser,
    logoutUser,

    addUser: async (_: any, args: { data: CreateUserInput }) => {
      const newUser = new User(args.data);

      await newUser.save();

      return newUser;
    },

    setPhotoPublished,
  },

  Date: new GraphQLScalarType({
    name: 'Date',
    description:
      'Custom Date type that can represent either a timestamp or a custom date format',
    parseValue(value: any) {
      if (['number', 'string'].includes(typeof value)) {
        return new Date(value); // Преобразуем timestamp или строку в дату
      }

      if (typeof value === 'object') {
        return value;
      }

      throw new Error('Date - parseValue: Invalid Date format');
    },

    serialize(value: any) {
      if (typeof value === 'number') {
        return value;
      }
      if (value instanceof Date) {
        return value.getTime(); // Отправляем timestamp
      }

      if (typeof value === 'object') {
        return value;
      }

      throw new Error('Date - serialize: Invalid Date format');
    },

    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(parseInt(ast.value, 10)); // Если это число, преобразуем в timestamp
      } else if (ast.kind === Kind.OBJECT) {
        const yearField = ast.fields.find(
          (f) => f.name.value === 'year'
        )?.value;
        const monthField = ast.fields.find(
          (f) => f.name.value === 'month'
        )?.value;
        const seasonField = ast.fields.find(
          (f) => f.name.value === 'season'
        )?.value;

        const year = yearField ? getIntValueFromNode(yearField) : undefined;
        const month = monthField ? getIntValueFromNode(monthField) : undefined;
        const season = seasonField
          ? getIntValueFromNode(seasonField)
          : undefined;

        if (year !== undefined) {
          return {
            year,
            month,
            season,
          };
        }
      }

      throw new Error('Date - parseLiteral: Invalid Date format');
    },
  }),

  JSON: new GraphQLScalarType({
    name: 'JSON',
    description: 'Arbitrary JSON value',
    parseValue(value) {
      return value; // value from the client
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
