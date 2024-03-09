import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'micro', // Aquí especifica la carpeta de construcción (puedes usar otro nombre si prefieres)
  },
});
