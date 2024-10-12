import 'dotenv/config';
import path, { dirname } from 'node:path';
import express from 'express';
import { fileURLToPath } from 'url';
import { ViteDevServer } from 'vite';

import { isProduction, base } from '../environment.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const createViteServer = async (app: express.Express) => {
  let vite: ViteDevServer | undefined = undefined;

  if (!isProduction) {
    const { createServer } = await import('vite');

    const indexHtmlPath = fileURLToPath(
      import.meta.resolve('@archive/app/index.html')
    );

    vite = await createServer({
      root: dirname(indexHtmlPath),
      server: { middlewareMode: true },
      appType: 'custom',
      base,
    });

    app.use(vite.middlewares);
  } else {
    const compression = (await import('compression')).default;
    const sirv = (await import('sirv')).default;

    app.use(compression());

    const distPath = path.resolve(__dirname, '../../app/dist/browser');
    app.use(base, sirv(distPath, { extensions: [] }));
  }

  return vite;
};
