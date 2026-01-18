import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  // ✅ MUST have these slashes for GitHub Pages subfolders
  base: "/Taskflowmanagement/", 
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
  build: {
    // This tells Vite where to put the final website files
    outDir: path.resolve(__dirname, "../dist/public"),
    emptyOutDir: true,
  },
});
