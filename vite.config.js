import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // 로컬에서 /api 요청을 백엔드(8080)로 넘겨 같은 출처로 만듭니다. (쿠키 로그인 유지)
    proxy: { '/api': 'http://localhost:8080' },
  },
})
