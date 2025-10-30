// frontend/vite.config.json
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// 1. Import the V4 Vite plugin wrapper
import tailwindcss from '@tailwindcss/vite' 
// 2. Import the core tailwind module itself
import tailwind from 'tailwindcss' 

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Use the @tailwindcss/vite plugin, passing it the core tailwind module.
    // The tailwindcss() wrapper handles the configuration logic.
    tailwindcss({
        // The core tailwind module must be provided to the vite plugin
        config: tailwind 
    })
  ],
})