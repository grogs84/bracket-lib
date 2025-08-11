import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@mgi/bracket-react': path.resolve(__dirname, '../../packages/react/src'),
      '@mgi/bracket-core': path.resolve(__dirname, '../../packages/core/src'),
    },
  },
});
