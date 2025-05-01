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
    sourcemap: true,
    rollupOptions: {
      external: ['@stripe/stripe-js', '@stripe/react-stripe-js'],
      output: {
        globals: {
          '@stripe/stripe-js': 'Stripe',
          '@stripe/react-stripe-js': 'ReactStripe'
        }
      }
    }
  }
});
