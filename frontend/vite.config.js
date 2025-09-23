// @ts-check
const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react').default;
const { resolve } = require('path');

/** @type {import('vite').UserConfig} */
module.exports = defineConfig({
  root: __dirname,
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    }
  },
  server: {
    port: 3000,
    open: true,
    strictPort: true
  },
  preview: {
    port: 3000,
    strictPort: true
  },
  define: {
    'process.env': process.env
  },
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          vendor: [
            '@mui/material',
            '@emotion/react',
            '@emotion/styled',
            '@reduxjs/toolkit',
            'axios',
            'formik',
            'i18next',
            'react-i18next'
          ]
        }
      }
    }
  }
});
