import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cors from "cors";
import path from "path"; 
import { fileURLToPath } from "url"; // FIXED: Changed 'path' to 'url'
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// 1. TRUST PROXY
app.set("trust proxy", 1); 

// 2. CORS
app.use(cors({
  origin: "https://gopaswathy98.github.io",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging Middleware
app.use((req, res, next) => {
  const start = Date.now();
  const pathName = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (pathName.startsWith("/api")) {
      let logLine = `${req.method} ${pathName} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    if (app.get("env") === "development") throw err; 
    console.error(err);
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);

    // CATCH-ALL ROUTE
    app.get("*", (req, res) => {
      if (!req.path.startsWith("/api")) {
        // Point to the correct build folder on Render
        res.sendFile(path.resolve(__dirname, "..", "dist", "public", "index.html"));
      }
    });
  }

  const port = Number(process.env.PORT) || 5000;
  server.listen({
    port,
    host: "0.0.0.0",
  }, () => {
    log(`serving on port ${port}`);
  });
})();
