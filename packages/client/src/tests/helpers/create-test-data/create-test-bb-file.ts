import { BBFile } from '@archive/client/server/apollo/models.js';

export const createTestBBFile = async () => {
  const file = new BBFile({
    fileUrl: 'http://qwe.rt/tyu.png',
    filePreview: 'http://qwe.rt/tyu_thumb.png',
    published: false,
  });

  return await file.save();
};
