import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertTaskSchema, insertProjectSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware (Keep this to avoid breaking imports, but we will bypass checks)
  await setupAuth(app);

  // Use a constant ID for the "Guest" user since Replit Auth is unavailable on Render
  const GUEST_USER_ID = "guest-user-123";

  // Auth routes - Modified to return a mock user for the UI
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Try to get guest user, or create one if your storage requires it
      const user = await storage.getUser(GUEST_USER_ID);
      res.json(user || { id: GUEST_USER_ID, username: "Guest User", role: "admin" });
    } catch (error) {
      res.json({ id: GUEST_USER_ID, username: "Guest User", role: "admin" });
    }
  });

  // Task routes - Removed isAuthenticated
  app.get("/api/tasks", async (req: any, res) => {
    try {
      const tasks = await storage.getTasks(GUEST_USER_ID);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/:id", async (req: any, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const task = await storage.getTask(taskId, GUEST_USER_ID);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(task);
    } catch (error) {
      console.error("Error fetching task:", error);
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
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      console.error("Error creating task:", error);
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.put("/api/tasks/:id", async (req: any, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const taskData = insertTaskSchema.partial().parse(req.body);
      
      const task = await storage.updateTask(taskId, taskData, GUEST_USER_ID);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req: any, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const deleted = await storage.deleteTask(taskId, GUEST_USER_ID);
      
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Project routes
  app.get("/api/projects", async (req: any, res) => {
    try {
      const projects = await storage.getProjects(GUEST_USER_ID);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req: any, res) => {
    try {
      const projectData = insertProjectSchema.parse({
        ...req.body,
        ownerId: GUEST_USER_ID,
      });
      
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  // Stats routes
  app.get("/api/stats", async (req: any, res) => {
    try {
      const stats = await storage.getTaskStats(GUEST_USER_ID);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Admin routes - Modified to let our Guest be an admin for demo purposes
  app.get("/api/admin/users", async (req: any, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
