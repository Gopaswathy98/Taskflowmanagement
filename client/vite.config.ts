import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  // ✅ Explicitly set the root to the client directory
  // This tells Vite "index.html is right here in this folder"
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
    // ✅ This moves the final website files up into the dist/public folder
    // so that your Express server can find them easily
    outDir: path.resolve(__dirname, "../dist/public"),
    emptyOutDir: true,
    // Helps Vite find the index.html specifically when building
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
    },
  },
});
