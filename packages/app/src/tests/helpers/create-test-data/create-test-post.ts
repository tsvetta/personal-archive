import { Post } from '@archive/server/src/apollo/models.js';

type PostFields = { tags: string[] };
type CreateTestPost = ({ tags }: PostFields) => Promise<any>;

export const createTestPost: CreateTestPost = async ({ tags }) => {
  const post = new Post({
    date: 1723939200000,
    title: 'Дорогой дневник',
    photos: [
      {
        description: 'Фото кота',
        src: 'https://gogogo.net/img.jpeg',
      },
    ],
    tags,
    text: 'Сегодня я видел большого кота.',
    accessLevel: 4,
  });

  return await post.save();
};
