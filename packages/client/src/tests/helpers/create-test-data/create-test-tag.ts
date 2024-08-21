import { Tag } from '@archive/client/server/apollo/models.js';

export const createTestTag = async (name: string) => {
  const tag = new Tag({
    name,
  });

  return await tag.save();
};
