import 'dotenv/config';
import { JwtPayload } from 'jsonwebtoken';

import { UniversalCookies } from '@archive/common/cookies.js';
import { port } from '../environment.js';
import { createApp } from './http-server/index.js';
import { connectMongoDB } from './mongo.js';
import { UserDataFromToken } from './apollo/types.js';

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
