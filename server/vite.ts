import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { type Server } from "http";
import * as vite from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const viteServer = await vite.createServer({
    server: { middlewareMode: true, hmr: { server } },
    appType: "custom",
  });
  app.use(viteServer.middlewares);
}

export function serveStatic(app: Express) {
  // We explicitly find the root 'dist/public' folder from the server's location
  const distPath = path.resolve(__dirname, "..", "dist", "public");
  
  log(`Server searching for frontend at: ${distPath}`);

  // 1. SERVE ASSETS FIRST (Fixes the MIME type error)
  // This tells the browser: "If you want a .js file, look in the assets folder"
  app.use("/assets", express.static(path.resolve(distPath, "assets"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
      if (filePath.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      }
    }
  }));

  // 2. Serve the rest of the static files
  app.use(express.static(distPath, { index: false }));

  // 3. Catch-all: Send index.html for any frontend route
  app.use("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) return next();
    
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Frontend build not found. Please check Render build logs.");
    }
  });
}
