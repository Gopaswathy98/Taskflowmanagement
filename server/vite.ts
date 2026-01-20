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
  
  log(`Final decision: Serving frontend from ${distPath}`);

  // 1. MANUALLY HANDLE ASSETS
  // This ensures the browser gets 'application/javascript' for .js files
  app.use("/assets", (req, res, next) => {
    const filePath = path.join(distPath, "assets", req.path);
    if (fs.existsSync(filePath)) {
      if (filePath.endsWith(".js")) res.setHeader("Content-Type", "application/javascript");
      if (filePath.endsWith(".css")) res.setHeader("Content-Type", "text/css");
      return res.sendFile(filePath);
    }
    next();
  });

  // 2. Standard static serving for other files (images, icons)
  app.use(express.static(distPath, { index: false }));

  // 3. The Catch-all: serve index.html for everything else
  app.use("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) return next();
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Build missing index.html");
    }
  });
}
