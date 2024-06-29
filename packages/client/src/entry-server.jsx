import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { CookiesProvider } from 'react-cookie';

import {
  // gql,
  // ApolloClient,
  // InMemoryCache,
  ApolloProvider,
  // createHttpLink,
} from '@apollo/client';
// import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';

import App from './App';
import { apolloClient } from '../apollo-client';

// if (process.env.NODE_ENV === 'development') {
//   loadDevMessages();
//   loadErrorMessages();
// }

// client
//   .query({
//     query: gql`
//       query Posts {
//         posts {
//           tags {
//             name
//           }
//           photos {
//             src
//             description
//           }
//         }
//       }
//     `,
//   })
//   .then((result) => console.log(result.data));

export const render = (req, res) => () => {
  // const client = new ApolloClient({
  //   ssrMode: typeof window === 'undefined',
  //   link: createHttpLink({
  //     uri: process.env.API_URL,
  //     credentials: 'same-origin',
  //     headers: {
  //       cookie: req.header('Cookie'),
  //     },
  //   }),
  //   cache: new InMemoryCache(),
  // });

  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <CookiesProvider cookies={req.universalCookies}>
        <ApolloProvider client={apolloClient(req)}>
          <App env='server' />
        </ApolloProvider>
      </CookiesProvider>
    </React.StrictMode>
  );
  return { html };
};
