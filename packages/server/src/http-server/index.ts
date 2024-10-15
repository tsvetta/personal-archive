import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { Request, Response } from 'express';
// import { JwtPayload } from 'jsonwebtoken';
import http from 'http';
import cookiesMiddleware from 'universal-cookie-express';

import { userFromCookiesMiddleware } from '@archive/app/src/features/auth/userFromCookiesMiddleware.js';
// import { UniversalCookies } from '@archive/app/src/utils/cookies.js';

import { isProduction } from '@archive/common/environment.js';
import { createApolloExpressMiddleware } from '../apollo/server.js';
// import { UserDataFromToken } from '../apollo/types.js';
import { createViteServer } from '../vite-server.js';
import { initializeApolloServer } from './middlewares/apolloMiddleware.js';

import loadBbToMongo from './routes/loadBbToMongo.js';
import transformPostPhotos from './routes/transformPostsPhotos.js';
import unpublishAllPhotos from './routes/unpublishAllPhotos.js';
import updateNormalizedDateInPosts from './routes/updateNormalizedDateInPosts.js';
import { handleSSR } from './routes/ssrHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// enableStaticServer is false in tests environment
export const createApp = async ({ enableStaticServer = true } = {}) => {
  const app = express();

  app.use(cookiesMiddleware());

  const httpServer = http.createServer(app);
  const apolloServer = await initializeApolloServer(httpServer);

  const viteServer = enableStaticServer
    ? await createViteServer(app)
    : undefined;

  app.use(
    '/graphql',
    express.json(),
    createApolloExpressMiddleware(apolloServer)
  );

  // Cached production assets
  const indexHtmlPath = path.resolve(
    __dirname,
    '../../../app/dist/browser/index.html'
  );
  const ssrManifestPath = path.resolve(
    __dirname,
    '../../../app/dist/browser/.vite/ssr-manifest.json'
  );

  const templateHtml = isProduction
    ? await fs.readFile(indexHtmlPath, 'utf-8')
    : '';

  const ssrManifest = isProduction
    ? await fs.readFile(ssrManifestPath, 'utf-8')
    : undefined;

  app
    .use('/load-bb-to-mongo', loadBbToMongo)
    .use('*', userFromCookiesMiddleware) // req.user
    .use('/transform-posts-photos', transformPostPhotos)
    .use('/unpublish-all-photos', unpublishAllPhotos)
    .use('/update-normalized-dates-in-posts', updateNormalizedDateInPosts)
    .use('*', (req: Request, res: Response) =>
      handleSSR(req, res, templateHtml, ssrManifest, viteServer)
    );

  return { httpServer, app };
};
