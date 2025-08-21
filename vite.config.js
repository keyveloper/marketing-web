import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  server: {
    proxy: {
      // 개발 환경에서 API 요청을 백엔드로 프록시 (CORS 우회)
      '/init': {
        target: 'https://localhost',
        changeOrigin: true,
        secure: false, // 자체 서명 인증서 허용
      },
      '/api': {
        target: 'https://localhost',
        changeOrigin: true,
        secure: false,
      },
      '/advertisement': {
        target: 'https://localhost',
        changeOrigin: true,
        secure: false,
      },
      '/my-advertisement': {
        target: 'https://localhost',
        changeOrigin: true,
        secure: false,
      },
      '/profile': {
        target: 'https://localhost',
        changeOrigin: true,
        secure: false,
      },
      '/like': {
        target: 'https://localhost',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
