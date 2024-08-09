import React from 'react';
import { render as rtlRender } from '@testing-library/react';

import { CookiesProvider } from 'react-cookie';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';

// @ts-ignore
import { createApolloClient } from './apollo-client.js';
import { AuthProvider } from './features/auth/useAuth.js';

const apolloClient = createApolloClient();

if (window.__APOLLO_STATE__) {
  apolloClient.cache.restore(window.__APOLLO_STATE__);
}

type AppProps = {
  userId?: string;
  cookie?: string;
};

const renderApp = (
  ui: React.ReactElement,
  { userId, cookie, ...renderOptions }: AppProps = {}
) => {
  Object.defineProperty(document, 'cookie', {
    writable: true,
    value: cookie,
  });

  const TestsAppWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <CookiesProvider>
        <ApolloProvider client={apolloClient}>
          <BrowserRouter>
            <AuthProvider userId={userId}>{children}</AuthProvider>
          </BrowserRouter>
        </ApolloProvider>
      </CookiesProvider>
    );
  };

  return rtlRender(ui, { wrapper: TestsAppWrapper, ...renderOptions });
};

export { renderApp };
