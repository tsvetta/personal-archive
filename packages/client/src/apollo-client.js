import fetch from 'isomorphic-fetch';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';

export const createApolloClient = () => {
  if (process.env.NODE_ENV !== 'production') {
    loadDevMessages();
    loadErrorMessages();
  }

  const httpLink = createHttpLink({
    uri: process.env.API_URL, // http://localhost:1111/graphql
    credentials: 'same-origin',
    fetch,
  });

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: httpLink,
    cache: new InMemoryCache(),
    credentials: 'include',
  });
};
