import React from 'react';
import ReactDOM from 'react-dom/client';
import { CookiesProvider } from 'react-cookie';

import { ApolloProvider } from '@apollo/client';
// import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';

import App from './App';
import './index.css';
import { apolloClient } from '../apollo-client';

// if (process.env.NODE_ENV === 'development') {
//   loadDevMessages();
//   loadErrorMessages();
// }

// const client = new ApolloClient({
//   uri: process.env.API_URL,
//   cache: new InMemoryCache(),
//   ssrMode: typeof window === 'undefined',
// });

ReactDOM.hydrateRoot(
  document.getElementById('root'),
  <React.StrictMode>
    <CookiesProvider>
      <ApolloProvider client={apolloClient()}>
        <App env='client' />
      </ApolloProvider>
    </CookiesProvider>
  </React.StrictMode>
);
