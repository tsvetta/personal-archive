import 'dotenv/config';
import jwt from 'jsonwebtoken';

import { UniversalCookies } from '../../utils/cookies.js';
import { User } from '../../../server/apollo/models.js';
import { User as UserType } from '@archive/client/server/apollo/types.js';

export const createAuthTokens = async (
  user: UserType,
  universalCookies?: UniversalCookies
) => {
  const authToken = jwt.sign(
    {
      userId: user._id,
      username: user.username,
      role: user.role,
    },
    process.env.SECRET_KEY || '',
    { expiresIn: '15m' }
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

  universalCookies?.set('auth_token', authToken, {
    httpOnly: true, // Куки доступны только для сервера
    secure: process.env.NODE_ENV === 'production', // Требуется HTTPS в production
    maxAge: 2592000, // 30 d
    sameSite: 'strict', // Ограничение куки для отправки только с того же сайта
  });

  // записываем новый токен в БД
  try {
    await User.findByIdAndUpdate(
      user._id,
      { $set: { refreshToken } },
      { new: true }
    ).exec();
    // user?.updateOne({})
  } catch (e: any) {
    console.error(e.message);
  }

  universalCookies?.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 2592000, // 30 d
    sameSite: 'strict',
  });

  return { authToken, refreshToken };
};
