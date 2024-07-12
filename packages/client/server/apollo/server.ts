import http from 'http';
import jwt from 'jsonwebtoken';
import { GraphQLFormattedError } from 'graphql';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware as apolloExpressMiddlewar } from '@apollo/server/express4';

import { ApolloContext } from './context.js';
import { apolloSchema } from './schema.js';
import { resolvers } from './resolvers.js';

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

const apolloContext = ({ req }: { req: Express.Request }) => {
  let authToken = req.universalCookies?.getAll().auth_token?.toString();
  let user: any = {};

  try {
    user = authToken ? jwt.verify(authToken, process.env.SECRET_KEY || '') : {};
  } catch (e: any) {
    console.error('\n Apollo Context Error:', e);

    if (e.message === 'jwt expired') {
      authToken = undefined;
    }
  }

  return Promise.resolve({
    authToken,
    user: {},
    universalCookies: req.universalCookies,
  });
};

export const createApolloExpressMiddleware = (
  apolloServer: ApolloServer<ApolloContext>
) =>
  apolloExpressMiddlewar(apolloServer, {
    context: apolloContext,
  });
