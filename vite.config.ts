import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from "vite-tsconfig-paths"

// https://vite.dev/config/
export default defineConfig({
    define: {
        'process.env': process.env
    },
  plugins: [react(),tsconfigPaths(), tailwindcss()],
})
