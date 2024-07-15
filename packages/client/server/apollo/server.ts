import 'dotenv/config';
import { Request } from 'express';
import http from 'http';
import jwt from 'jsonwebtoken';

import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware as apolloExpressMiddlewar } from '@apollo/server/express4';

import { ApolloContext } from './context.js';
import { apolloSchema } from './schema.js';
import { resolvers } from './resolvers.js';
import { UserDataFromToken } from './types.js';

import { createAuthTokens } from '../../src/features/auth/index.js';

const secret = process.env.SECRET_KEY || '';

// const formatApolloServerEror = async (err: GraphQLFormattedError) => {};

export const createApolloServer = (
  httpServer: http.Server
): ApolloServer<ApolloContext> =>
  new ApolloServer<ApolloContext>({
    typeDefs: apolloSchema,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })], // plugin ensure server gracefully shuts down
    // formatError: formatApolloServerEror,
  });

const apolloContext = async ({
  req,
}: {
  req: Request;
}): Promise<ApolloContext> => {
  const cookies = req.universalCookies?.getAll() || {};
  let authToken = cookies.auth_token?.toString() || '';
  let refreshToken = cookies.refresh_token?.toString() || '';

  // console.log('\n\n\n');
  // console.log('! refreshToken:', refreshToken);

  // No Auth
  if (!authToken || !refreshToken) {
    // console.log('...no auth!');
    return Promise.resolve({
      universalCookies: req.universalCookies,
    });
  }

  let userDecoded = jwt.decode(authToken) as UserDataFromToken;
  let finalUser = undefined;
  // console.log('...auth decoding', userDecoded);

  // token valid
  if (userDecoded) {
    // console.log('...auth token verification');
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
      // verification failed, token expired
      if (err instanceof jwt.TokenExpiredError) {
        // console.log('...auth token expired, create new tokens');
        const newTokens = await createAuthTokens(
          userDecoded.userId,
          req.universalCookies
        );

        // console.log('...new refresh token:', newTokens?.refreshToken);

        finalUser = newTokens?.authToken
          ? jwt.decode(newTokens.authToken)
          : undefined;
      } else if (err) {
        // verification failed, other reasons
        console.error('Auth token error', err);
      }
    }
  }

  // console.log('...final user', finalUser);

  return Promise.resolve({
    user: finalUser as UserDataFromToken,
    universalCookies: req.universalCookies,
  });
};

export const createApolloExpressMiddleware = (
  apolloServer: ApolloServer<ApolloContext>
) =>
  apolloExpressMiddlewar(apolloServer, {
    context: apolloContext,
  });
