import 'dotenv/config';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  define: {
    'process.env.STAGE': JSON.stringify(process.env.STAGE),
    'process.env.API_URL': JSON.stringify(process.env.API_URL),
    'process.env.CDN_URL': JSON.stringify(process.env.CDN_URL),
  },
  plugins: [react()],
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
