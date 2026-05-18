import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const distOutDir = path.resolve(__dirname, '../../dist/apps/web');

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 3000,
    cors: true,
    fs: {
      strict: true,
      allow: [
        path.resolve(__dirname),
        path.join(path.resolve(__dirname, '../..'), 'node_modules'),
      ],
    },
  },
  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: distOutDir,
    emptyOutDir: true,
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      external: [
        '@babel/parser',
        '@babel/traverse',
        '@babel/generator',
        '@babel/types',
      ],
    },
  },
});
