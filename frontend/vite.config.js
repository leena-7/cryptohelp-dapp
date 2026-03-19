import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    'process.title': JSON.stringify('browser'),
    'process.version': JSON.stringify(''),
    'process.platform': JSON.stringify('browser'),
  },
  resolve: {
    alias: {
      process: 'process/browser',
    }
  }
})
