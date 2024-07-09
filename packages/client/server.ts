import 'dotenv/config';
import fs from 'node:fs/promises';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloExpressMiddlewar } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import { ViteDevServer } from 'vite';
import cookiesMiddleware from 'universal-cookie-express';

import { ApolloContext } from './server/apollo/context.js';
import { apolloSchema } from './server/apollo/schema.js';
import { resolvers } from './server/apollo/resolvers.js';

import { UniversalCookies } from './src/utils/cookies.js';

const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5173;
const base = process.env.BASE || '/';

// cookies types in express request
declare global {
  namespace Express {
    export interface Request {
      universalCookies?: UniversalCookies;
    }
  }
}

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : '';
const ssrManifest = isProduction
  ? await fs.readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8')
  : undefined;

// mongo DB
const dbURI = process.env.MongoURI || '';

mongoose.connect(dbURI).catch((err) => {
  console.error(err);
});

const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to MongoDB. Host:', db.host);
});

// Http server
const app = express();
const httpServer = http.createServer(app);

// Apollo Server
const apolloServer = new ApolloServer<ApolloContext>({
  typeDefs: apolloSchema,
  resolvers,
  // plugin ensure server gracefully shuts down
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await apolloServer.start();

// Vite Dev Server
let vite: ViteDevServer;
if (!isProduction) {
  const { createServer } = await import('vite');

  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  });

  app.use(vite.middlewares);
} else {
  const compression = (await import('compression')).default;
  const sirv = (await import('sirv')).default;

  app.use(compression());
  app.use(base, sirv('./dist/client', { extensions: [] }));
}

app
  .use(cookiesMiddleware())
  .use(
    '/graphql',
    express.json(),
    apolloExpressMiddlewar(apolloServer, {
      context: ({ req }) => {
        const authToken = req.universalCookies?.getAll().auth_token;

        return Promise.resolve({
          authToken,
          universalCookies: req.universalCookies,
        });
      },
    })
  )
  // Serve HTML
  .use('*', async (req, res) => {
    try {
      const url = req.originalUrl.replace(base, '/');
      let template;
      let renderFunction;

      if (!isProduction) {
        // Always read fresh template in development
        template = await fs.readFile('./index.html', 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        renderFunction = (await vite.ssrLoadModule('/src/entry-server.jsx'))
          .render;
      } else {
        template = templateHtml;
        renderFunction = // @ts-ignore
          (await import('./dist/server/entry-server.js')).render(req, res);
      }

      const rendered = await renderFunction(url, ssrManifest, {
        headerCookie: req.header('Cookie'), // for Auth
        universalCookies: req.universalCookies,
      });

      const html = template
        .replace(`<!--app-head-->`, rendered.head ?? '')
        .replace(`<!--app-html-->`, rendered.html ?? '')
        .replace(
          '</head>',
          `<script>window.__APOLLO_STATE__=${JSON.stringify(
            rendered.initialState
          ).replace(/</g, '\\u003c')}</script></head>`
        );

      res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
    } catch (e: any) {
      vite?.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

// Start http server
await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
console.log(`HTTP Server started at http://localhost:${port}`);
