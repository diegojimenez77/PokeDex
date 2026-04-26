import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // Rutas relativas para poder abrir dist/index.html con file:// y despliegues en subcarpetas
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@design': path.resolve(__dirname, 'design/css'),
    },
  },
});
