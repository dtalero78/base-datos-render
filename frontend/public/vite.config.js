import { defineConfig } from 'vite';

export default defineConfig({
  preview: {
    port: process.env.PORT || 4173, // Usar el puerto de Render si está definido
    host: '0.0.0.0' // Asegura que esté accesible externamente
  }
});
