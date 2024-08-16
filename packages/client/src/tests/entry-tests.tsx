import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import FetchMock from 'fetch-mock';
import { cleanup } from '@testing-library/react';

import { CookiesProvider } from 'react-cookie';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';

// @ts-ignore
import { createApolloClient } from '../apollo-client.js';
import { AuthProvider } from '../features/auth/useAuth.js';

type AppProps = {
  userId?: string;
  cookie?: string;
};

export type TestContext = Awaited<ReturnType<typeof createTestContext>>;

export const createTestContext = () => {
  cleanup();
  window.history.pushState({}, 'Home', '/');

  const fetchMock = FetchMock.sandbox();
  const fetch = fetchMock as typeof globalThis.fetch;
  const apolloClient = createApolloClient({ fetch });

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

  fetchMock.reset();

  return { renderApp, fetchMock };
};
