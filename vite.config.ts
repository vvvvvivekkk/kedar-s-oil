import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      output: {
        // Keep three.js and friends out of the main bundle; they are loaded
        // lazily by the hero only on capable devices.
        manualChunks(id) {
          if (id.includes('node_modules/three/') || id.includes('node_modules/@react-three/') || id.includes('node_modules/postprocessing/')) {
            return 'three'
          }
          if (id.includes('node_modules/framer-motion/') || id.includes('node_modules/motion')) {
            return 'motion'
          }
        },
      },
    },
  },
})
