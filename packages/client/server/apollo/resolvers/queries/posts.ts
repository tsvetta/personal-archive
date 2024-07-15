import { Post } from '../../models.js';
import { ApolloContext } from '../../context.js';

export const postsQuery = async (_: any, __: any, { user }: ApolloContext) => {
  console.log('\n Posts by user role:', user?.role);

  try {
    const filteredByRole = await Post.find({ privacy: user?.role })
      .sort({ date: 1 })
      .exec();

    return filteredByRole;
  } catch (e) {
    return e;
  }
};
