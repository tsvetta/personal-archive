import express, { Request, Response } from 'express';
import { BBFile, Photo, Post } from '../../apollo/models.js';

const router = express.Router();

// Маппим фото из постов и фото из BB
router.get('/', async (req: Request, res: Response) => {
  const postsFromBD = await Post.find();

  const mapPostsFromBD = async (post: any) => {
    const mapPhotosFromPost = async (photo: any) => {
      if (!photo) {
        return null;
      }

      const sameBBFileBySrc = await BBFile.findOne({ fileUrl: photo.src });
      const sameBBFileById = await BBFile.findOne({ _id: photo._id });

      if (sameBBFileBySrc) {
        return new Photo({
          file: {
            _id: sameBBFileBySrc._id,
          },
          description: photo.description,
        });
      } else if (sameBBFileById) {
        return new Photo({
          file: {
            _id: sameBBFileById._id,
          },
          description: photo.description,
        });
      } else {
        return photo;
      }
    };

    const photosWithUpdatedFiles = await Promise.all(
      post?.photos.map(mapPhotosFromPost)
    );

    const updatedPost = await Post.findOneAndUpdate(
      { _id: post._id },
      { photos: photosWithUpdatedFiles },
      { new: true }
    );

    return updatedPost;
  };

  const updatedPosts = await Promise.all(postsFromBD.map(mapPostsFromBD));

  return res.send(JSON.stringify(updatedPosts[0]));
});

export default router;
