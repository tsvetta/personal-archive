import { Tag } from '@archive/server/src/apollo/models.js';

export const createTestTag = async (name: string) => {
  const tag = new Tag({
    name,
  });

  return await tag.save();
};
