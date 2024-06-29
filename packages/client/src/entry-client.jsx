import React from 'react';
import ReactDOM from 'react-dom/client';
import { CookiesProvider } from 'react-cookie';
import { ApolloProvider } from '@apollo/client';

import { apolloClient } from '../apollo-client';
import App from './App';
import './index.css';

ReactDOM.hydrateRoot(
  document.getElementById('root'),
  <React.StrictMode>
    <CookiesProvider>
      <ApolloProvider client={apolloClient()}>
        <App />
      </ApolloProvider>
    </CookiesProvider>
  </React.StrictMode>
);
