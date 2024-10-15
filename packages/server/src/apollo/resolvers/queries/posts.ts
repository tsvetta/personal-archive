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
    const filter: FilterQuery<FilterType> = {
      accessLevel: { $lte: user?.accessLevel },
    };

    // Добавляем фильтрацию по тегам
    if (args.filter?.tags) {
      filter.tags = { $in: args.filter.tags };
    }

    const filteredByRole = await Post.find(filter)
      .populate('tags')
      .populate('photos.file')
      .sort({ normalizedDate: args.filter?.date || -1 })
      .exec();

    return filteredByRole.map((post) => post?.toObject({ virtuals: true }));
  } catch (err: any) {
    throw new Error(`Failed to fetch posts: ${err.message}`);
  }
};
