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
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const viteServer = await vite.createServer({
    server: {
      middlewareMode: true,
      hmr: { server },
    },
    appType: "custom",
  });

  app.use(viteServer.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientIndex = path.resolve(__dirname, "..", "client", "index.html");
      const template = await fs.promises.readFile(clientIndex, "utf-8");
      const page = await viteServer.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      viteServer.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // Check both common build locations
  const distPath = path.resolve(__dirname, "public");
  const rootDistPath = path.resolve(__dirname, "..");
  
  // Choose the path that actually contains the assets
  const actualPath = fs.existsSync(path.resolve(distPath, "assets")) 
    ? distPath 
    : rootDistPath;

  log(`Serving static files from: ${actualPath}`);

  // Serve static files (JS, CSS, Images)
  app.use(express.static(actualPath));

  // Catch-all: serve index.html for any non-API route
  app.use("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.resolve(actualPath, "index.html"));
  });
}
