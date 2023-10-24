import { defineConfig } from 'vite'
import eslintPlugin from '@nabla/vite-plugin-eslint'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  base: "multi-select-example",
  plugins: [
    react(),
    eslintPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
