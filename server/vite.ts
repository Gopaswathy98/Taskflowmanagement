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
  // Try to find the dist folder in multiple possible locations
  const pathsToTry = [
    path.resolve(__dirname, "..", "dist", "public"),
    path.resolve(__dirname, "public"),
    path.resolve(process.cwd(), "dist", "public"),
    path.resolve(process.cwd(), "client", "dist")
  ];

  let distPath = pathsToTry.find(p => fs.existsSync(path.resolve(p, "index.html"))) || pathsToTry[0];
  
  log(`Final decision: Serving frontend from ${distPath}`);

  // 1. Force JavaScript headers for anything in the assets folder
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

  // 2. General static file serving
  app.use(express.static(distPath, { index: false }));

  // 3. The Catch-all for SPA logic
  app.use("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) return next();
    
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Could not find index.html. Please check Build Logs.");
    }
  });
}
