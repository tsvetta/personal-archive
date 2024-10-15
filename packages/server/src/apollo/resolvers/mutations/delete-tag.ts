import { Tag, Post } from '../../models.js';

export const deleteTag = async (_: any, args: { id: string }) => {
  const posts = await Post.find({ tags: { $in: args.id } });

  if (posts.length > 0) {
    throw new Error(
      'Apollo: Невозможно удалить пользователя, у которого есть связанные посты'
    );
  }

  await Tag.findOneAndDelete({ _id: args.id });

  return Tag.find({});
};
