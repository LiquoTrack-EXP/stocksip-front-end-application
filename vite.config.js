import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      // Vite dev proxy → Spring Boot / ASP.NET Core backend
      // Backend URL confirmed from Swagger: https://localhost:7164
      '/api': {
        target: 'https://localhost:7164',
        changeOrigin: true,
        secure: false,   // allow self-signed cert in dev
      }
    }
  }
})
