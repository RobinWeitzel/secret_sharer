import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/secret_sharer/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        encrypt: resolve(__dirname, 'encrypt.html'),
        decrypt: resolve(__dirname, 'decrypt.html'),
      },
    },
  },
});
