/// <reference types="vite/client" />
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression2';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    compression({
      algorithms: ['brotliCompress', 'gzip'],
      exclude: [/\.(br)$/, /\.(gz)$/],
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['vue', 'vue-router'],
  },
  build: {
    minify: 'terser',
    assetsDir: 'assets',
    cssCodeSplit: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 3000,
    assetsInlineLimit: 10000,
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        compact: true,
        inlineDynamicImports: true,
      }
    },
  }
});
