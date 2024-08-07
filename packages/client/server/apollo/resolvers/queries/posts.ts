import { Post } from '../../models.js';
import { ApolloContext } from '../../context.js';

export const postsQuery = async (_: any, __: any, { user }: ApolloContext) => {
  try {
    const filteredByRole = await Post.find({
      accessLevel: { $lte: user?.accessLevel },
    })
      .populate('tags')
      .populate('photos.file')
      .sort({ date: -1 })
      .exec();

    return filteredByRole.map((post) => post?.toObject({ virtuals: true }));
  } catch (e) {
    return e;
  }
};
