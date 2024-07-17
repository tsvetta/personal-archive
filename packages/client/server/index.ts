import 'dotenv/config';
import fs from 'node:fs/promises';
import express, { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import http from 'http';
import cookiesMiddleware from 'universal-cookie-express';

import {
  createApolloExpressMiddleware,
  createApolloServer,
} from './apollo/server.js';
import { UserDataFromToken } from './apollo/types.js';

import { userFromCookiesMiddleware } from '../src/features/auth/userFromCookiesMiddleware.js';
import { UniversalCookies } from '../src/utils/cookies.js';
import { connectMongoDB } from './mongo.js';
import { createViteServer } from './vite-server.js';

const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5173;
const base = process.env.BASE || '/';

declare global {
  namespace Express {
    export interface Request {
      universalCookies?: UniversalCookies;
      user?: UserDataFromToken | JwtPayload | string | null | undefined;
    }
  }
}

connectMongoDB();
const app = express();
const httpServer = http.createServer(app);
const apolloServer = createApolloServer(httpServer);
await apolloServer.start();
const vite = await createViteServer(app);

app
  .use(cookiesMiddleware())
  .use('/graphql', express.json(), createApolloExpressMiddleware(apolloServer));

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : '';
const ssrManifest = isProduction
  ? await fs.readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8')
  : undefined;

app
  .use('*', userFromCookiesMiddleware) // req.user
  // Serve HTML
  .use('*', async (req: Request, res: Response) => {
    try {
      const url = req.originalUrl.replace(base, '/');

      let template;
      let renderFunction;

      if (!isProduction && vite) {
        // Always read fresh template in development
        template = await fs.readFile('./index.html', 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        renderFunction = (await vite.ssrLoadModule('/src/entry-server.jsx'))
          .render;
      } else {
        template = templateHtml;
        renderFunction = // @ts-ignore
          (await import('../dist/server/entry-server.js')).render(req, res);
      }

      const userId = req.user?.userId || null;
      const rendered = await renderFunction(url, ssrManifest, {
        headerCookie: req.header('Cookie'), // for Auth
        universalCookies: req.universalCookies,
        userId,
      });

      const html = template
        .replace(`<!--app-head-->`, rendered.head ?? '')
        .replace(`<!--app-html-->`, rendered.html ?? '')
        .replace(
          '</head>',
          `<script>
            window.__APOLLO_STATE__=${JSON.stringify(
              rendered.initialState
            ).replace(/</g, '\\u003c')}; 
            window.__ARCHIVE_USER_ID__=${JSON.stringify(userId)}
          </script>
          </head>`
        );

      res
        .status(res.statusCode) // 200 or 401
        .set({ 'Content-Type': 'text/html' })
        .send(html);
    } catch (e: any) {
      vite?.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

// Start http server
await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
console.log(`HTTP Server started at http://localhost:${port}`);