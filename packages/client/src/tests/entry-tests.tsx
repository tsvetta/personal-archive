// import 'dotenv/config';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import FetchMock from 'fetch-mock';
import { CookiesProvider } from 'react-cookie';
import { render as rtlRender } from '@testing-library/react';
import { cleanup } from '@testing-library/react';
import { ApolloProvider } from '@apollo/client';

// @ts-ignore
import { createApolloClient } from '../apollo-client.js';
import { createApp } from '../../server/http-server.js';
import { AuthProvider } from '../features/auth/useAuth.js';

type AppProps = {
  userId?: string;
  cookie?: string;
};

export type TestContext = Awaited<ReturnType<typeof createTestContext>>;

export const createTestContext = async () => {
  cleanup();

  if (typeof window !== 'undefined') {
    window.history.pushState({}, 'Home', '/');
  }

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

  const { app } = await createApp({ enableStaticServer: false });

  return { renderApp, fetchMock, app };
};
