import { Post } from '../../models.js';

export const postTags = async (parent: any) => {
  try {
    const post = await Post.findById(parent.id)
      .populate('tags')
      .populate('photos.file')
      .exec();

    return post?.tags;
  } catch (err: any) {
    throw new Error(
      `Failed to fetch tags for post ${parent.id}: ${err.message}`
    );
  }
};
