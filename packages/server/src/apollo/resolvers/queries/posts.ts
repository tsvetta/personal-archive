import { FilterQuery, SortOrder } from 'mongoose';

import { Post } from '../../models.js';
import { ApolloContext } from '../../context.js';
import { AuthorizationError } from '../../errors.js';
import { AccessLevelsEnum } from '../../types.js';

type FilterType = {
  accessLevel: AccessLevelsEnum;
  tags?: string[];
};

type PostsFilter = {
  date?: SortOrder;
  createdAt?: SortOrder;
  tags?: [string];
};

type PostsSort = {
  normalizedDate?: SortOrder;
  createdAt?: SortOrder;
};

type PostQueryArgs = { filter?: PostsFilter };

export const postsQuery = async (
  _: any,
  args: PostQueryArgs,
  { user }: ApolloContext
) => {
  if (!user) {
    throw new AuthorizationError('Unauthorized');
  }

  try {
    const sort: PostsSort = {};
    const filter: FilterQuery<FilterType> = {
      accessLevel: { $lte: user?.accessLevel },
    };

    if (args.filter?.date) {
      sort.normalizedDate = args.filter.date;
    }

    if (args.filter?.createdAt) {
      sort.createdAt = args.filter.createdAt;
    }

    if (args.filter?.tags?.length) {
      filter.tags = { $in: args.filter.tags };
    }

    const filteredByRole = await Post.find(filter)
      .populate('tags')
      .populate('photos.file')
      .sort(sort)
      .exec();

    return filteredByRole.map((post) => post?.toObject({ virtuals: true }));
  } catch (err: any) {
    throw new Error(`Failed to fetch posts: ${err.message}`);
  }
};
