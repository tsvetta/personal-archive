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

import { userFromCookiesMiddleware } from '@archive/app/src/features/auth/userFromCookiesMiddleware.js';
import { UniversalCookies } from '@archive/app/src/utils/cookies.js';
import { saveJsonToNewCollection } from './mongo.js';
import { createViteServer } from './vite-server.js';
import { getBBCDNPhotos } from './backblaze-b2.js';
import { BBFile, Photo, Post } from './apollo/models.js';
import { fileURLToPath } from 'node:url';

const isProduction = process.env.NODE_ENV === 'production';
const base = process.env.BASE || '/';

declare global {
  namespace Express {
    export interface Request {
      universalCookies?: UniversalCookies;
      user?: UserDataFromToken | JwtPayload | string | null | undefined;
    }
  }
}

export const createApp = async ({ enableStaticServer = true } = {}) => {
  const app = express();

  app.use(cookiesMiddleware());

  const httpServer = http.createServer(app);
  const apolloServer = createApolloServer(httpServer);
  await apolloServer.start();
  const vite = enableStaticServer && (await createViteServer(app));

  app.use(
    '/graphql',
    express.json(),
    createApolloExpressMiddleware(apolloServer)
  );

  // Cached production assets
  const templateHtml = isProduction
    ? await fs.readFile(
        fileURLToPath(
          import.meta.resolve('@archive/app/dist/browser/index.html')
        ),
        'utf-8'
      )
    : '';
  const ssrManifest = isProduction
    ? await fs.readFile(
        fileURLToPath(
          import.meta.resolve(
            '@archive/app/dist/browser/.vite/ssr-manifest.json'
          )
        ),
        'utf-8'
      )
    : undefined;

  app
    .use('/load-bb-to-mongo', async (req: Request, res: Response) => {
      const bbData = await getBBCDNPhotos(10000);
      const archiveFiles = bbData?.files;

      await saveJsonToNewCollection('bbfiles', archiveFiles);

      return res.send(JSON.stringify(archiveFiles));
    })

    .use('*', userFromCookiesMiddleware) // req.user

    // чтобы смаппить фото из постов и фото из BB
    .use('/transform-posts-photos', async (req: Request, res: Response) => {
      const postsFromBD = await Post.find();

      const mapPostsFromBD = async (post: any) => {
        const mapPhotosFromPost = async (photo: any) => {
          if (!photo) {
            return null;
          }

          const sameBBFileBySrc = await BBFile.findOne({ fileUrl: photo.src });
          const sameBBFileById = await BBFile.findOne({ _id: photo._id });

          if (sameBBFileBySrc) {
            return new Photo({
              file: {
                _id: sameBBFileBySrc._id,
              },
              description: photo.description,
            });
          } else if (sameBBFileById) {
            return new Photo({
              file: {
                _id: sameBBFileById._id,
              },
              description: photo.description,
            });
          } else {
            return photo;
          }
        };

        const photosWithUpdatedFiles = await Promise.all(
          post?.photos.map(mapPhotosFromPost)
        );

        const updatedPost = await Post.findOneAndUpdate(
          { _id: post._id },
          { photos: photosWithUpdatedFiles },
          { new: true }
        );

        return updatedPost;
      };

      const updatedPosts = await Promise.all(postsFromBD.map(mapPostsFromBD));

      return res.send(JSON.stringify(updatedPosts[0]));
    })

    .use('/unpublish-all-photos', async (req: Request, res: Response) => {
      const response = await BBFile.updateMany(
        {
          published: true,
        },
        {
          $set: { published: false },
        }
      );

      return res.send(JSON.stringify(response));
    })

    // Serve HTML
    .use('*', async (req: Request, res: Response) => {
      try {
        const url = req.originalUrl.replace(base, '/');

        let template;
        let renderFunction;

        if (!isProduction && vite) {
          // Always read fresh template in development
          const indexHtmlPath = fileURLToPath(
            import.meta.resolve('@archive/app/index.html')
          );

          template = await fs.readFile(indexHtmlPath, 'utf-8');
          template = await vite.transformIndexHtml(url, template);
          const entryServerPath = fileURLToPath(
            import.meta.resolve('@archive/app/src/entry-server.jsx')
          );

          renderFunction = (await vite.ssrLoadModule(entryServerPath)).render;
        } else {
          template = templateHtml;
          renderFunction = (
            await import('@archive/app/dist/node/entry-server.js' as any)
          ).render;
        }

        // @ts-ignore
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
        if (vite && vite.ssrFixStacktrace) {
          vite.ssrFixStacktrace(e);
        }

        console.log(e.stack);
        res.status(500).end(e.stack);
      }
    });

  return { httpServer, app };
};
