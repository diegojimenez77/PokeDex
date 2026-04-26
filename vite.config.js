import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // file:// y builds locales: base './' | en CI (GHP) VITE_BASE=/nombre-repo/
  base: process.env.VITE_BASE ?? './',
  plugins: [react()],
  resolve: {
    alias: {
      '@design': path.resolve(__dirname, 'design/css'),
    },
  },
});
