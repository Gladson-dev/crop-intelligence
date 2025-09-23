import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd(), '');
  
  // Base configuration
  const config = {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },
    server: {
      port: 3000,
      open: true
    },
    preview: {
      port: 3000,
      strictPort: true,
    },
    define: {
      'process.env': {}
    },
    base: '/', // Use root path for production
  };

  // Production-specific configuration
  if (command === 'build') {
    config.build = {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false, // Disable sourcemaps in production for smaller build size
      minify: 'terser',
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            vendor: ['@mui/material', '@emotion/react', '@emotion/styled'],
          },
        },
      },
    };
  }

  return config;
});
