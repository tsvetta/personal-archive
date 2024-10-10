import React from 'react';
import ReactDOM from 'react-dom/client';

import { CookiesProvider } from 'react-cookie';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';

import { createApolloClient } from './apollo-client';
import { AuthProvider } from './features/auth/useAuth';

import App from './App';
import './index.css';

const apolloClient = createApolloClient();

if (window.__APOLLO_STATE__) {
  apolloClient.cache.restore(window.__APOLLO_STATE__);
}

ReactDOM.hydrateRoot(
  document.getElementById('root'),
  <React.StrictMode>
    <CookiesProvider>
      <ApolloProvider client={apolloClient}>
        <BrowserRouter>
          <AuthProvider userId={window.__ARCHIVE_USER_ID__}>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </ApolloProvider>
    </CookiesProvider>
  </React.StrictMode>
);
