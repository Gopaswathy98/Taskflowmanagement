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

  // Force correct MIME types for static assets
  app.use("/assets", express.static(path.resolve(distPath, "assets"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    }
  }));

  app.use(express.static(distPath));

  app.use("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) return next();
    const indexPath = path.resolve(distPath, "index.html");
    res.sendFile(indexPath);
  });
}
