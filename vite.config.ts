import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(async () => {
  const isProduction = process.env.NODE_ENV === "production";
  
  const plugins = [react()];

  // Only attempt to load Replit-specific plugins if not in production
  if (!isProduction) {
    try {
      const { cartographer } = await import("@replit/vite-plugin-cartographer");
      const runtimeErrorOverlay = await import("@replit/vite-plugin-runtime-error-modal");
      
      plugins.push(cartographer());
      plugins.push(runtimeErrorOverlay.default());
    } catch (e) {
      console.log("Skipping Replit plugins (not in Replit environment)");
    }
  }

  return {
    plugins,
    // This fixed the white screen by pointing to the correct subfolder
    base: "/Taskflowmanagement/", 
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist", "public"),
      emptyOutDir: true,
      assetsDir: "assets",
    },
  };
});
