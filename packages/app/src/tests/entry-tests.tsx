import getPort from 'get-port';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import FetchMock from 'fetch-mock';
import { CookiesProvider } from 'react-cookie';
import { render as rtlRender } from '@testing-library/react';
import { cleanup } from '@testing-library/react';
import { ApolloProvider } from '@apollo/client';

import { createApolloClient } from '../apollo-client.js';
import { cleanupAfterAll } from './helpers/cleanup.js';
import { createTestsFetch } from './helpers/tests-fetch.js';
import { createApp } from '@archive/server/src/http-server/index.js';
import { AuthProvider } from '../features/auth/useAuth.js';

type AppProps = {
  userId?: string;
};

export type TestContext = Awaited<ReturnType<typeof createTestContext>>;
export const createTestContext = async () => {
  cleanup();

  if (typeof window !== 'undefined') {
    window.history.pushState({}, 'Home', '/');
  }

  const fetchMock = FetchMock.sandbox();
  const { httpServer, app } = await createApp({ enableStaticServer: false });
  const port = await getPort();

  await new Promise<void>((resolve) => {
    httpServer.listen(port, () => {
      resolve();
    });
  });

  cleanupAfterAll.addCleanupStep(() => {
    httpServer.close();
  });

  const fetch = createTestsFetch(port);
  const apolloClient = createApolloClient({ fetch });

  const renderApp = (
    ui: React.ReactElement,
    { userId, ...renderOptions }: AppProps = {}
  ) => {
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

  return { renderApp, fetchMock, app };
};
