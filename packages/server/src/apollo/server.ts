import 'dotenv/config';
import { Request } from 'express';
import http from 'http';
import jwt from 'jsonwebtoken';

import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware as apolloExpressMiddleware } from '@apollo/server/express4';

import { ApolloContext } from './context.js';
import { apolloSchema } from './schema.js';
import { resolvers } from './resolvers.js';
import { UserDataFromToken } from './types.js';

import {
  createAuthTokens,
  deleteAuthTokens,
} from '@archive/app/src/features/auth/index.js';

import { secret } from '../../environment.js';

export const createApolloServer = (
  httpServer: http.Server
): ApolloServer<ApolloContext> =>
  new ApolloServer<ApolloContext>({
    typeDefs: apolloSchema,
    resolvers,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }), // plugin ensure server gracefully shuts down
    ],
  });

const apolloContext = async ({
  req,
}: {
  req: Request;
}): Promise<ApolloContext> => {
  const cookies = req.universalCookies?.cookies || {};

  let authToken = cookies.auth_token?.toString() || '';
  let refreshToken = cookies.refresh_token?.toString() || '';

  // No Auth
  if (!authToken || !refreshToken) {
    await deleteAuthTokens(undefined, req.universalCookies);

    return Promise.resolve({
      universalCookies: req.universalCookies,
    });
  }

  let userDecoded = jwt.decode(authToken) as UserDataFromToken;
  let finalUser = undefined;

  // token valid
  if (userDecoded) {
    try {
      // verification
      const verifiedUser = await new Promise((resolve, reject) => {
        jwt.verify(authToken, secret, async (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded as UserDataFromToken);
        });
      });

      if (verifiedUser) {
        finalUser = verifiedUser;
      }
    } catch (err) {
      await deleteAuthTokens(userDecoded.userId, req.universalCookies);

      // verification failed, token expired
      if (err instanceof jwt.TokenExpiredError) {
        const newTokens = await createAuthTokens(
          userDecoded.userId,
          req.universalCookies
        );

        finalUser = newTokens?.authToken
          ? jwt.decode(newTokens.authToken)
          : undefined;
      } else if (err) {
        // verification failed, other reasons
        console.error('Auth token error', err);
      }
    }
  }

  return Promise.resolve({
    user: finalUser as UserDataFromToken,
    universalCookies: req.universalCookies,
  });
};

export const createApolloExpressMiddleware = (
  apolloServer: ApolloServer<ApolloContext>
) => {
  return apolloExpressMiddleware(apolloServer, {
    context: apolloContext,
  });
};
