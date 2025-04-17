import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react-datepicker')) {
              return 'datepicker';
            }
            if (id.includes('react')) {
              return 'vendor';
            }
            if (id.includes('@uploadcare')) {
              return 'uploadcare';
            }
          }
          if (id.includes('components/ui')) {
            return 'ui';
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react-datepicker', '@uploadcare/upload-client'],
  },
});
