import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const userFromCookiesMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { auth_token = '' } = req.universalCookies?.cookies || {};
  let user;

  if (auth_token) {
    user = jwt.decode(auth_token);
  }

  req.user = user;

  next();
};
