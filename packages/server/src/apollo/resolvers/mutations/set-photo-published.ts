import { BBFile } from '../../models.js';

export const setPhotoPublished = async (_: any, args: { id: String }) => {
  const photo = await BBFile.findOneAndUpdate(
    { _id: args.id },
    { published: true },
    { new: true }
  ).exec();

  return photo;
};
