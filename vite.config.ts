import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  // ... otras configuraciones si las tenías
  
  server: {
    port: 3000,
    allowedHosts: true as const,
    
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify - file watching is disabled to prevent flickering
    hmr: process.env.DISABLE_HMR !== 'true',
    
    // Disable file watching when DISABLE_HMR is true to save CPU
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
});
