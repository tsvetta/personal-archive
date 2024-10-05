import 'dotenv/config';
import { JwtPayload } from 'jsonwebtoken';
import { createApp } from './http-server.js';
import { connectMongoDB } from './mongo.js';
import { UserDataFromToken } from './apollo/types.js';
import { UniversalCookies } from '@archive/common/cookies.js';

const port = process.env.PORT || 5173;

declare global {
  namespace Express {
    export interface Request {
      universalCookies?: UniversalCookies;
      user?: UserDataFromToken | JwtPayload | string | null | undefined;
    }
  }
}

connectMongoDB();

const { httpServer } = await createApp();
await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
console.log(`HTTP Server started at http://localhost:${port}`);
