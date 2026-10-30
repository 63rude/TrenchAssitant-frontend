import { defineConfig } from 'vite';
import { cpSync } from 'node:fs';
import { resolve } from 'node:path';

const apiProxy = Object.fromEntries(
  ['/start_session', '/get_session_status', '/get_session_logs', '/get_session_result_by_wallet']
    .map(path => [path, { target: 'http://127.0.0.1:8000', changeOrigin: true }])
);

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve('index.html'),
        litepaper: resolve('litepaper.html'),
      },
    },
  },
  plugins: [{
    name: 'copy-html-components',
    closeBundle() {
      cpSync('components', 'dist/components', { recursive: true });
      cpSync('assets', 'dist/assets', { recursive: true });
    },
  }],
  server: {
    host: '127.0.0.1',
    port: 5173,
    proxy: apiProxy,
  },
  preview: {
    host: '127.0.0.1',
    proxy: apiProxy,
  },
});
