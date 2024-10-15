import express, { Request, Response } from 'express';
import { normalizePostDate } from '@archive/common/dates/normalize-post-date.js';
import { Post } from '../../apollo/models.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const posts = await Post.find();

    posts.forEach(async (post) => {
      const normalizedDate = normalizePostDate(post.date);

      if (normalizedDate) {
        await Post.updateOne({ _id: post._id }, { $set: { normalizedDate } });

        console.log(`Пост с ID ${post._id} обновлен.`);
      } else {
        console.log(`Пост с ID ${post._id} не содержит корректной даты.`);
      }
    });

    console.log('Обновление дат завершено!');
  } catch (err) {
    console.error('Ошибка при обновлении дат в постах:', err);
  }

  return res.send(JSON.stringify(await Post.find()));
});

export default router;
