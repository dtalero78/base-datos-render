import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173, // Fija el puerto 5173
    strictPort: true // No intenta otro puerto si el 5173 está ocupado
  }
});
