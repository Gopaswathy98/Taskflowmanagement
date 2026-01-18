import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  // ✅ Keeps the GitHub Pages subfolder working
  base: "/Taskflowmanagement/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // Adjusted path for shared folder since we are now inside 'client'
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
  build: {
    // Vite will now output to client/dist
    outDir: "dist",
    emptyOutDir: true,
  },
});
