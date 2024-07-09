import 'dotenv/config';
import jwt from 'jsonwebtoken';

import { verifyPassword } from '@archive/common/crypt-pass.js';

import { ApolloContext } from '../../context.js';
import { User } from '../../models.js';

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

  const authToken = jwt.sign(
    {
      userId: user._id,
      username: user.username,
      role: user.role,
    },
    process.env.SECRET_KEY || '',
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    {
      userId: user._id,
      username: user.username,
      role: user.role,
    },
    process.env.SECRET_KEY || '',
    { expiresIn: '1d' }
  );

  context.universalCookies?.set('auth_token', authToken, {
    httpOnly: true, // Куки доступны только для сервера
    secure: process.env.NODE_ENV === 'production', // Требуется HTTPS в production
    maxAge: 3600000, // Время жизни куки (в миллисекундах, здесь 1 час)
    sameSite: 'strict', // Ограничение куки для отправки только с того же сайта
  });

  return {
    // authToken,
    refreshToken,
    user,
  };
};
