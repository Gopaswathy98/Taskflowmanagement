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
  // Render's working directory is usually /opt/render/project/src/
  // After build, the files are in /opt/render/project/src/dist/public
  const distPath = path.resolve(__dirname, "..", "dist", "public");
  
  log(`DEBUG: Absolute path to dist: ${distPath}`);

  if (!fs.existsSync(distPath)) {
    log(`CRITICAL ERROR: Build directory missing at ${distPath}`);
  }

  // 1. Force JavaScript MIME types explicitly
  app.use(express.static(distPath, {
    index: false,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
      if (filePath.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      }
    }
  }));

  // 2. Catch-all for React routing
  app.use("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) return next();
    
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.status(200).sendFile(indexPath);
    } else {
      res.status(404).send("Frontend files not found. Check deployment logs.");
    }
  });
}
