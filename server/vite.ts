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
  // We navigate to the root dist folder explicitly
  const distPath = path.resolve(__dirname, "..", "dist", "public");
  
  log(`Server looking for assets in: ${distPath}`);

  if (!fs.existsSync(distPath)) {
    log(`ERROR: Directory not found at ${distPath}`);
  }

  // 1. Serve static files with correct headers
  app.use(express.static(distPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    }
  }));

  // 2. Catch-all for React routing
  app.use("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) return next();
    
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Frontend files not found. Check build path.");
    }
  });
}
