import 'dotenv/config';

import { verifyPassword } from '@archive/common/crypt-pass.js';

import { ApolloContext } from '../../context.js';
import { User } from '../../models.js';
import { createAuthTokens } from '../../../../src/features/auth/index.js';

export const loginUser = async (
  _: any,
  args: { data: { username: string; password: string } },
  context: ApolloContext
) => {
  const { username, password } = args.data;

  const user = await User.findOne({ username });

  if (!user) {
    throw new Error('Incorrect username or password');
  }

  const isPasswordValid = await verifyPassword(user?.password, password);

  if (!isPasswordValid) {
    throw new Error('Incorrect username or password');
  }

  await createAuthTokens(user, context.universalCookies);

  return await User.findOne({ username });
};
