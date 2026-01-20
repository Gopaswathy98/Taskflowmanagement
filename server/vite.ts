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
  const distPath = path.resolve(__dirname, "public");
  
  log(`Production mode: Serving from ${distPath}`);

  // 1. Force the MIME type for any .js or .css file
  // This specifically fixes the "MIME type of 'text/html'" error
  app.use((req, res, next) => {
    if (req.url.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
      res.setHeader('X-Content-Type-Options', 'nosniff');
    } else if (req.url.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
    next();
  });

  // 2. Serve static files from the dist/public folder
  app.use(express.static(distPath, { index: false }));

  // 3. SPA Fallback: Serve index.html for any route that isn't an API
  app.use("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) return next();
    
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Frontend build missing index.html. Please check Render logs.");
    }
  });
}
