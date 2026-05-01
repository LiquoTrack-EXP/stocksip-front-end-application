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
      // Backend URL confirmed from Swagger: https://stocksip-back-end.azurewebsites.net
      '/api': {
        target: 'https://stocksip-back-end.azurewebsites.net',
        changeOrigin: true,
        secure: false,   // allow self-signed cert in dev
      }
    }
  }
})
