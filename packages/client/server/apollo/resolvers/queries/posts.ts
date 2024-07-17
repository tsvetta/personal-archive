import { Post } from '../../models.js';
import { ApolloContext } from '../../context.js';

export const postsQuery = async (_: any, __: any, { user }: ApolloContext) => {
  try {
    const filteredByRole = await Post.find({
      accessLevel: { $lte: user?.accessLevel },
    })
      .sort({ date: 1 })
      // .lean()
      .exec();

    // TODO разобраться как перестать кешировать поле accessLevel без этого и без .lean()
    return filteredByRole.map((post) => post?.toObject({ virtuals: true }));
  } catch (e) {
    return e;
  }
};
