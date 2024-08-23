import { saveJsonToNewCollection } from '@archive/client/server/mongo.js';

type File = { fileUrl: string; filePreview: string; published: boolean };

export const createTestBBFiles = async (amount: number) => {
  const files: File[] = [];

  new Array(amount).fill(0).forEach((_, idx: number) => {
    files.push({
      fileUrl: `http://qwe.rt/tyu_${idx}.png`,
      filePreview: `http://qwe.rt/tyu_${idx}_thumb.png`,
      published: false,
    });
  });

  await saveJsonToNewCollection('bbfiles', files);
};
