import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative asset URLs so GitHub Pages works if this repo is renamed.
export default defineConfig({
  plugins: [react()],
  base: './',
});
