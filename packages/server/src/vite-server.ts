import 'dotenv/config';
import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { ViteDevServer } from 'vite';

const isProduction = process.env.NODE_ENV === 'production';
const base = process.env.BASE || '/';

export const createViteServer = async (app: express.Express) => {
  let vite: ViteDevServer | undefined = undefined;

  if (!isProduction) {
    const { createServer } = await import('vite');

    vite = await createServer({
      root: dirname(
        fileURLToPath(import.meta.resolve('@archive/app/index.html'))
      ),
      server: { middlewareMode: true },
      appType: 'custom',
      base,
    });

    app.use(vite.middlewares);
  } else {
    const compression = (await import('compression')).default;
    const sirv = (await import('sirv')).default;

    app.use(compression());

    const distPath = fileURLToPath(
      import.meta.resolve('@archive/app/dist/browser')
    );

    app.use(base, sirv(distPath, { extensions: [] }));
  }

  return vite;
};
