import session from "express-session";
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";

export function getSession() {
  return session({
    secret: process.env.SESSION_SECRET || "local_secret_123",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to false for local development
  });
}

export async function setupAuth(app: Express) {
  app.use(getSession());

  // Mock Login: Automatically creates/logs in a test user
  app.get("/api/login", async (req, res) => {
    const mockUser = {
      id: "test-user-123",
      email: "guest@example.com",
      firstName: "Guest",
      lastName: "User",
      role: "admin"
    };
    
    await storage.upsertUser(mockUser);
    (req.session as any).user = mockUser;
    res.redirect("/");
  });

  app.get("/api/auth/user", (req, res) => {
    if ((req.session as any).user) {
      return res.json((req.session as any).user);
    }
    res.status(401).send();
  });

  app.get("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if ((req.session as any).user) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};
