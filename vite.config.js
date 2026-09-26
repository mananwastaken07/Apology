import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Apology/',
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild',
  },
  server: {
    open: true,
  },
});
