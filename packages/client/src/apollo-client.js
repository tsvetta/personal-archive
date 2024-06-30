import {
  gql,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';

import fetch from 'isomorphic-fetch';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';

if (process.env.NODE_ENV === 'development') {
  loadDevMessages();
  loadErrorMessages();
}

export const createApolloClient = (req) =>
  new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: createHttpLink({
      uri: process.env.API_URL,
      credentials: 'same-origin',
      headers: {
        cookie: req ? req.header('Cookie') : null,
      },
      fetch,
    }),
    cache: new InMemoryCache(),
  });
