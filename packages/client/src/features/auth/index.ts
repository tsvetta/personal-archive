import 'dotenv/config';
import jwt from 'jsonwebtoken';

import { UniversalCookies } from '../../utils/cookies.js';
import { User } from '../../../server/apollo/models.js';

import mongoose, { Types } from 'mongoose';

export const createAuthTokens = async (
  userId: Types.ObjectId,
  universalCookies?: UniversalCookies
) => {
  const session = await mongoose.startSession();

  const userFromDB = await User.findById(userId).session(session);

  // нет такого юзера
  if (!userFromDB) {
    return;
  }

  const authToken = jwt.sign(
    {
      userId: userFromDB._id,
      username: userFromDB.username,
      role: userFromDB.role,
    },
    process.env.SECRET_KEY || '',
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    {
      userId: userFromDB._id,
      username: userFromDB.username,
      role: userFromDB.role,
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
      userId,
      { $set: { refreshToken } },
      { new: true }
    )
      .session(session)
      .exec();
  } catch (e: any) {
    console.error(e.message);
  }

  universalCookies?.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 2592000, // 30 d
    sameSite: 'strict',
  });

  session.endSession();

  return { authToken, refreshToken };
};
