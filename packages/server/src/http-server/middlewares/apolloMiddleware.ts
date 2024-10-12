import http from 'http';
import { createApolloServer } from '../../apollo/server.js';

export const initializeApolloServer = async (httpServer: http.Server) => {
  const apolloServer = createApolloServer(httpServer);
  await apolloServer.start();
  return apolloServer;
};
