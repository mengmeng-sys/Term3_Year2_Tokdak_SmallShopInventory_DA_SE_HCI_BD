import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const target = 'http://localhost:5000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: {
      clientPort: 3000
    },
    proxy: {
      '/api': { target, changeOrigin: true },
      '/uploads': target
    }
  }
});
