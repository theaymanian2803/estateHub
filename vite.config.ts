import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // If you are strictly using Rolldown (Vite 6+ experimental):
    // rolldownOptions: { ... }

    // Standard approach (works for Rollup and usually maps to Rolldown):
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Put all third-party dependencies into a 'vendor' chunk
            return 'vendor'

            // Or, split a specific heavy library into its own chunk:
            // if (id.includes('lodash')) return 'lodash';
          }
        },
      },
    },
  },
}))
