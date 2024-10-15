import { FilterQuery } from 'mongoose';

import { Post } from '../../models.js';
import { ApolloContext } from '../../context.js';
import { AuthorizationError } from '../../errors.js';
import { AccessLevelsEnum } from '../../types.js';

type FilterType = {
  accessLevel: AccessLevelsEnum;
  tags?: string[];
};

type PostQueryArgs = { tagId?: string };

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

    // Добавляем фильтрацию по тегам, только если `tagId` передан
    if (args.tagId) {
      filter.tags = { $in: args.tagId };
    }

    const filteredByRole = await Post.find(filter)
      .populate('tags')
      .populate('photos.file')
      .sort({ normalizedDate: 1 })
      .exec();

    return filteredByRole.map((post) => post?.toObject({ virtuals: true }));
  } catch (err: any) {
    throw new Error(`Failed to fetch posts: ${err.message}`);
  }
};
