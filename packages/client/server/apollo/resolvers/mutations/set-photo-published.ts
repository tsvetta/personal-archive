import { BBFiles } from '../../models.js';

export const setPhotoPublished = async (_: any, args: { id: String }) => {
  const photo = await BBFiles.findOneAndUpdate(
    { _id: args.id },
    { published: true },
    { new: true }
  ).exec();

  return photo;
};
