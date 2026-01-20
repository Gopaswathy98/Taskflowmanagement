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
  // On Render, the folder structure is /opt/render/project/src/dist/public
  const distPath = path.resolve(__dirname, "public");
  const indexPath = path.resolve(distPath, "index.html");

  log(`Checking for static files at: ${distPath}`);

  // 1. Explicitly serve the assets folder first
  app.use("/assets", express.static(path.resolve(distPath, "assets"), {
    immutable: true,
    maxAge: "1y",
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    }
  }));

  // 2. Serve everything else in dist/public
  app.use(express.static(distPath, { index: false }));

  // 3. The Catch-all: If it's not a file and not an API, send index.html
  app.use("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) {
      return next();
    }
    
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Critical Error: index.html not found in dist/public");
    }
  });
}
