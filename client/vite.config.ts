import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  // Ensures the app loads correctly at the root URL
  base: "/", 
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
  build: {
    // This is the CRITICAL fix: 
    // It saves the build inside the 'client/dist' folder
    outDir: "dist",
    emptyOutDir: true,
  },
});
