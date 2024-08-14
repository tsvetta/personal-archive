import isomorphicFetch from 'isomorphic-fetch';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';

// fetch подменяем в тестах на fetchMock
export const createApolloClient = ({ fetch, headerCookie = '' } = {}) => {
  if (process.env.NODE_ENV !== 'production') {
    loadDevMessages();
    loadErrorMessages();
  }

  const httpLink = createHttpLink({
    uri: process.env.API_URL, // http://localhost:1111/graphql
    credentials: 'same-origin',
    headers: {
      cookie: headerCookie, // for Auth
    },
    fetch: fetch ? fetch : isomorphicFetch,
  });

  const client = new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: httpLink,
    cache: new InMemoryCache(),
    credentials: 'include',
  });

  // client.resetStore();

  return client;
};
