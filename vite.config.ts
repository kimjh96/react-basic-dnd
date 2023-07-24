import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'react-basic-dnd',
      formats: ['cjs', 'es'],
      fileName: (fileName) => (fileName === 'cjs' ? 'index.js' : 'index.es.js')
    },
    rollupOptions: {
      output: {
        interop: 'auto'
      }
    }
  },
  plugins: [react(), dts()],
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});
