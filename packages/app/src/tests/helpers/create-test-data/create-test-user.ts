import { getHashedPassword } from '@archive/common/crypt-pass.js';
import { User } from '@archive/server/src/apollo/models.js';

export const createTestUser: () => Promise<string> = async () => {
  const user = new User({
    username: 'tsvetta',
    password: await getHashedPassword('test123123'),
    role: 'TSVETTA',
    accessLevel: 4,
  });

  const newUser = await user.save();

  return newUser._id.toString();
};
