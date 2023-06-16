import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path');

const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js'
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
