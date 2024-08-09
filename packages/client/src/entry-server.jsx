import React from 'react';
import { CookiesProvider } from 'react-cookie';
import { StaticRouter } from 'react-router-dom/server';
import { ApolloProvider } from '@apollo/client';
import { renderToStringWithData } from '@apollo/client/react/ssr';

import { createApolloClient } from './apollo-client';
import { AuthProvider } from './features/auth/useAuth';
import App from './App';

export async function render(
  url,
  ssrManifest,
  { universalCookies, headerCookie, userId }
) {
  const apolloClient = createApolloClient({ headerCookie });

  const AppWithRouter = (
    <React.StrictMode>
      <CookiesProvider cookies={universalCookies}>
        <ApolloProvider client={apolloClient}>
          <StaticRouter location={url}>
            <AuthProvider userId={userId}>
              <App />
            </AuthProvider>
          </StaticRouter>
        </ApolloProvider>
      </CookiesProvider>
    </React.StrictMode>
  );

  try {
    const content = await renderToStringWithData(AppWithRouter);
    const initialState = apolloClient.extract();

    // ssrManifest для получения правильных ссылок на ассеты
    const scripts = [];
    const styles = [];

    if (ssrManifest) {
      for (const entry of ssrManifest[url]) {
        if (entry.endsWith('.js')) {
          scripts.push(`<script type="module" src="${entry}"></script>`);
        } else if (entry.endsWith('.css')) {
          styles.push(`<link rel="stylesheet" href="${entry}">`);
        }
      }
    }

    return {
      html: content,
      head: '', // Вы можете добавить метатеги или другие элементы head здесь
      initialState,
    };
  } catch (error) {
    console.error('Error during SSR:', error);
    throw error;
  }
}
