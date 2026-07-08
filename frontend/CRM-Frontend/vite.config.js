import path from "path"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite" // 👈 1. Import it here
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss() // 👈 2. Add it inside the plugins array
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Required for shadcn paths
    },
  },
})