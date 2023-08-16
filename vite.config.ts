import * as path from 'path';

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'react-basic-dnd',
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['react'],
      output: {
        interop: 'auto'
      }
    }
  },
  plugins: [react(), dts({ insertTypesEntry: true })],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      {
        find: '@components',
        replacement: path.resolve(__dirname, 'src/components')
      }
    ]
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});
