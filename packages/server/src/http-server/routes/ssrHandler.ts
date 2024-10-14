import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { ViteDevServer } from 'vite';
import { Request, Response } from 'express';

import { base, isProduction } from '@archive/common/environment.js';

export const handleSSR = async (
  req: Request,
  res: Response,
  templateHtml: string,
  ssrManifest?: string,
  viteServer?: ViteDevServer
) => {
  try {
    const url = req.originalUrl.replace(base, '/');

    let template;
    let renderFunction;

    if (!isProduction && viteServer) {
      // Always read fresh template in development
      const indexHtmlPath = fileURLToPath(
        import.meta.resolve('@archive/app/index.html')
      );

      template = await fs.readFile(indexHtmlPath, 'utf-8');
      template = await viteServer.transformIndexHtml(url, template);

      const entryServerPath = fileURLToPath(
        import.meta.resolve('@archive/app/src/entry-server.jsx')
      );

      renderFunction = (await viteServer.ssrLoadModule(entryServerPath)).render;
    } else {
      // Production mode
      template = templateHtml;
      renderFunction = (
        await import('@archive/app/dist/node/entry-server.js' as any)
      ).render;
    }

    // @ts-ignore
    const userId = req.user?.userId || null;
    const rendered = await renderFunction(url, ssrManifest, {
      headerCookie: req.header('Cookie'),
      universalCookies: req.universalCookies,
      userId,
    });

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '')
      .replace(
        '</head>',
        `<script>window.__APOLLO_STATE__=${JSON.stringify(
          rendered.initialState
        ).replace(
          /</g,
          '\\u003c'
        )}; window.__ARCHIVE_USER_ID__=${JSON.stringify(
          userId
        )}</script></head>`
      );

    res
      .status(res.statusCode) // 200 or 401
      .set({ 'Content-Type': 'text/html' })
      .send(html);
  } catch (e: any) {
    if (viteServer && viteServer.ssrFixStacktrace)
      viteServer.ssrFixStacktrace(e);
    console.error(e.stack);
    res.status(500).end(e.stack);
  }
};
