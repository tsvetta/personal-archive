import React from 'react';
import ReactDOM from 'react-dom/client';
import { CookiesProvider } from 'react-cookie';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';

import { createApolloClient } from './apollo-client';
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
          <App />
        </BrowserRouter>
      </ApolloProvider>
    </CookiesProvider>
  </React.StrictMode>
);
