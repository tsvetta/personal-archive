import express, { Request, Response } from 'express';
import { BBFile } from '../../apollo/models.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const response = await BBFile.updateMany(
    {
      published: true,
    },
    {
      $set: { published: false },
    }
  );

  return res.send(JSON.stringify(response));
});

export default router;
