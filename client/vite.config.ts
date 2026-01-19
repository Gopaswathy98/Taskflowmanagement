import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  // ✅ This tells Vite to look for index.html inside the 'client' folder
  root: path.resolve(__dirname), 
  
  plugins: [react()],
  
  // ✅ Essential for GitHub Pages subfolder
  base: "/Taskflowmanagement/",
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
  
  build: {
    // ✅ This moves the final files up into the dist/public folder for the server
    outDir: path.resolve(__dirname, "../dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
    },
  },
});
