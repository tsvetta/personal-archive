import express, { Request, Response } from 'express';
import { getBBCDNPhotos } from '../../backblaze-b2.js';
import { saveJsonToNewCollection } from '../../mongo.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const bbData = await getBBCDNPhotos(10000);
  const archiveFiles = bbData?.files;

  await saveJsonToNewCollection('bbfiles', archiveFiles);

  res.json(archiveFiles);
});

export default router;
