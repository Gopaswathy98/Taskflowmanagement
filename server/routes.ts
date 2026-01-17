import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertProjectSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Use a constant ID for the "Guest" user
  const GUEST_USER_ID = "guest-user-123";

  // Auth routes - Modified to ALWAYS return the Guest User immediately
  app.get('/api/auth/user', async (_req, res) => {
    try {
      const user = await storage.getUser(GUEST_USER_ID);
      res.json(user || { id: GUEST_USER_ID, username: "Guest User", role: "admin" });
    } catch (error) {
      res.json({ id: GUEST_USER_ID, username: "Guest User", role: "admin" });
    }
  });

  // Mock login route to make the frontend "Sign In" button work
  app.post('/api/login', (_req, res) => {
    res.json({ id: GUEST_USER_ID, username: "Guest User", role: "admin" });
  });

  app.post('/api/logout', (_req, res) => {
    res.status(200).send();
  });

  // Task routes
  app.get("/api/tasks", async (_req, res) => {
    try {
      const tasks = await storage.getTasks(GUEST_USER_ID);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const task = await storage.getTask(taskId, GUEST_USER_ID);
      if (!task) return res.status(404).json({ message: "Task not found" });
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch task" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse({
        ...req.body,
        createdById: GUEST_USER_ID,
      });
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const taskData = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(taskId, taskData, GUEST_USER_ID);
      if (!task) return res.status(404).json({ message: "Task not found" });
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      await storage.deleteTask(taskId, GUEST_USER_ID);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Project routes
  app.get("/api/projects", async (_req, res) => {
    try {
      const projects = await storage.getProjects(GUEST_USER_ID);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse({
        ...req.body,
        ownerId: GUEST_USER_ID,
      });
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  // Stats routes
  app.get("/api/stats", async (_req, res) => {
    try {
      const stats = await storage.getTaskStats(GUEST_USER_ID);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Admin routes
  app.get("/api/admin/users", async (_req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
