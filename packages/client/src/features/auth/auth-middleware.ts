import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
// import { createAuthTokens } from './index.js';
import { UserDataFromToken } from '../../../server/apollo/types.js';

const base = process.env.BASE || '/';
const secret = process.env.SECRET_KEY || '';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { auth_token = '', refresh_token = '' } =
    req.universalCookies?.getAll() || {};

  const user: UserDataFromToken | {} = auth_token
    ? (jwt.verify(auth_token, secret) as UserDataFromToken)
    : {};

  req.user = user;

  const url = req.originalUrl.replace(base, '/');

  const noUser = Object.keys(user).length === 0;
  if (noUser && url !== '/login') {
    res.redirect('/login');
  }

  next();
};
