import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// This tells the Vite build engine to translate your React JSX code
export default defineConfig({
  plugins: [react()]
})