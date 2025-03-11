import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Determine the project root
const projectRoot = path.resolve(__dirname);
const clientRoot = path.resolve(projectRoot, "client");

export default defineConfig({
  plugins: [react()],
  root: clientRoot,
  resolve: {
    alias: {
      "@": path.resolve(clientRoot, "src"),
      "@shared": path.resolve(projectRoot, "shared")
    }
  },
  build: {
    outDir: path.resolve(projectRoot, "dist"),
    emptyOutDir: true
  }
});
