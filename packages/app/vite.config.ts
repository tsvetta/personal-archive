import 'dotenv/config';

import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    target: 'esnext',
  },
  define: {
    'process.env.API_URL': JSON.stringify(process.env.API_URL),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
  plugins: [react()],
  resolve: {
    preserveSymlinks: true, // for yarn workspaces
    alias: {
      '@archive/app': path.resolve(__dirname),
      '@archive/common': path.resolve(__dirname, '../common'),
      '@archive/server': path.resolve(__dirname, '../server'),
    },
  },
  ssr: {
    noExternal: ['@apollo/client'],
  },
  server: {
    middlewareMode: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3000,
    },
  },
});
