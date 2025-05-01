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
  optimizeDeps: {
    include: ['@stripe/stripe-js', '@stripe/react-stripe-js']
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      external: ['@stripe/stripe-js', '@stripe/react-stripe-js'],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        },
        globals: {
          '@stripe/stripe-js': 'Stripe',
          '@stripe/react-stripe-js': 'ReactStripe'
        }
      }
    }
  }
});
