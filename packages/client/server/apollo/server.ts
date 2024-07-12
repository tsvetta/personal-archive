import http from 'http';
import jwt from 'jsonwebtoken';
import { GraphQLFormattedError } from 'graphql';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware as apolloExpressMiddlewar } from '@apollo/server/express4';

import { ApolloContext } from './context.js';
import { apolloSchema } from './schema.js';
import { resolvers } from './resolvers.js';
import { UserDataFromToken } from './types.js';
import { createAuthTokens } from '../../src/utils/auth.js';

const formatApolloServerEror = (err: GraphQLFormattedError) => {
  console.log('\n Apollo Format Error:', err);

  if (err.extensions?.code === 'UNAUTHENTICATED') {
    // Если ошибка аутентификации, возвращаем статус и данные для редиректа
    return {
      statusCode: 302, // или другой подходящий HTTP статус
      location: '/login', // URL для редиректа
      message: err.message, // Ошибка аутентификации
    };
  }

  // Возвращаем стандартную обработку ошибок для других типов ошибок
  return err;
};

export const createApolloServer = (
  httpServer: http.Server
): ApolloServer<ApolloContext> =>
  new ApolloServer<ApolloContext>({
    typeDefs: apolloSchema,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })], // plugin ensure server gracefully shuts down
    formatError: formatApolloServerEror,
  });

const apolloContext = ({
  req,
}: {
  req: Express.Request;
}): Promise<ApolloContext> => {
  const cookies = req.universalCookies?.getAll() || {};
  let authToken = cookies.auth_token?.toString() || '';
  let refreshToken = cookies.refresh_token?.toString() || '';

  // const isLoggedIn = authToken && refreshToken;
  // const wasLoggedIn = !authToken && refreshToken;
  // let user = {};

  // if (isLoggedIn) {
  //   user = jwt.verify(authToken, process.env.SECRET_KEY || '');

  //   return Promise.resolve({
  //     authToken,
  //     refreshToken,
  //     user,
  //     universalCookies: req.universalCookies,
  //   });
  // }

  // if (wasLoggedIn) {
  //   user = jwt.verify(refreshToken, process.env.SECRET_KEY || '');

  //   const tokens = createAuthTokens(user, req.universalCookies);

  //   return Promise.resolve({
  //     authToken: tokens.authToken,
  //     refreshToken: tokens.refreshToken,
  //     user,
  //     universalCookies: req.universalCookies,
  //   });
  // }

  return Promise.resolve({
    authToken,
    refreshToken,
    universalCookies: req.universalCookies,
  });
};

export const createApolloExpressMiddleware = (
  apolloServer: ApolloServer<ApolloContext>
) =>
  apolloExpressMiddlewar(apolloServer, {
    context: apolloContext,
  });
