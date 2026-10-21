import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    // Raise the warning threshold (bundles naturally large for 3D apps)
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor: Three.js core (largest dependency ~800KB)
          if (id.includes('node_modules/three/')) {
            return 'vendor-three';
          }
          // Vendor: React Three Fiber + Drei
          if (id.includes('@react-three/fiber') || id.includes('@react-three/drei')) {
            return 'vendor-r3f';
          }
          // Vendor: Postprocessing
          if (id.includes('@react-three/postprocessing') || id.includes('postprocessing')) {
            return 'vendor-postfx';
          }
          // Vendor: React core
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          // Vendor: GSAP animations
          if (id.includes('node_modules/gsap') || id.includes('@gsap')) {
            return 'vendor-gsap';
          }
          // Room scenes — each room loads independently
          if (id.includes('src/components/scenes/')) {
            const match = id.match(/scenes\/(\w+)\.jsx/);
            if (match) return `room-${match[1].toLowerCase()}`;
          }
        },
      },
    },
  },
})

