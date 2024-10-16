import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { CookieOptions } from 'express';

import { isProduction, secret } from '@archive/common/environment.js';
import { UniversalCookies } from '../../utils/cookies.js';
import { User } from '@archive/server/src/apollo/models.js';

import mongoose, { Types } from 'mongoose';

const cookieOptions: CookieOptions = {
  httpOnly: true, // Куки доступны только для сервера
  secure: isProduction, // Требуется HTTPS в production
  maxAge: 2592000, // 30 d
  sameSite: 'strict', // Ограничение куки для отправки только с того же сайта
};

export const createAuthTokens = async (
  userId: Types.ObjectId,
  universalCookies?: UniversalCookies
) => {
  const session = await mongoose.startSession();

  try {
    const tokens = await session.withTransaction(async () => {
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
          accessLevel: userFromDB.accessLevel,
        },
        secret,
        { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
        {
          userId: userFromDB._id,
          username: userFromDB.username,
          role: userFromDB.role,
          accessLevel: userFromDB.accessLevel,
        },
        secret,
        { expiresIn: '1d' }
      );

      universalCookies?.set('auth_token', authToken, cookieOptions);
      universalCookies?.set('refresh_token', refreshToken, cookieOptions);

      // записываем новый токен в БД
      await User.findByIdAndUpdate(
        userId,
        { $set: { refreshToken } },
        { new: true }
      )
        .session(session)
        .exec();

      return { authToken, refreshToken };
    });

    return tokens;
  } finally {
    await session.endSession();
  }
};

export const deleteAuthTokens = async (
  userId?: Types.ObjectId,
  universalCookies?: UniversalCookies
) => {
  const session = await mongoose.startSession();

  // Because headers duplication (set-cookie)
  if (universalCookies?.cookies['auth_token']) {
    universalCookies?.remove('auth_token', { ...cookieOptions, maxAge: 0 });
  }

  if (universalCookies?.cookies['refresh_token']) {
    universalCookies?.remove('refresh_token', { ...cookieOptions, maxAge: 0 });
  }

  if (userId) {
    const userFromDB = await User.findById(userId).session(session);

    // нет такого юзера
    if (!userFromDB) {
      return;
    }

    // удаляем рефреш токен из БД
    try {
      await User.findByIdAndUpdate(
        userId,
        { $unset: { refreshToken: '' } },
        { new: true }
      )
        .session(session)
        .exec();
    } catch (e: any) {
      console.error(e.message);
    }
  }

  session.endSession();
};
