import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // 引入path模块

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 配置路径别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // 将 @ 映射到 src 目录
    }
  }
})