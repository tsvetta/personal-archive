import 'dotenv/config'; // to get env vars from .env with 'yarn start'

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env.STAGE': JSON.stringify(process.env.STAGE),
    'process.env.API_URL': JSON.stringify(process.env.API_URL),
    'process.env.CDN_URL': JSON.stringify(process.env.CDN_URL),
  },
  plugins: [react()],
  // build: {
  //   rollupOptions: {
  //     input: './src/entry-client.jsx',
  //   },
  // },
  resolve: {
    preserveSymlinks: true, // for yarn workspaces
  },
  ssr: {
    noExternal: ['@apollo/client'],
  },
  server: {
    middlewareMode: true,
  },
});
