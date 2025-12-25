import { 
  users, tasks, projects, 
  type User, type UpsertUser, 
  type Task, type InsertTask, 
  type TaskWithRelations, 
  type Project, type InsertProject 
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getTasks(userId: string): Promise<TaskWithRelations[]>;
  getTask(id: number, userId: string): Promise<TaskWithRelations | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>, userId: string): Promise<Task | undefined>;
  deleteTask(id: number, userId: string): Promise<boolean>;
  getProjects(userId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  getTaskStats(userId: string): Promise<{ totalTasks: number; completed: number; inProgress: number; planned: number; }>;
  getAllUsers(): Promise<User[]>;
  updateUserRole(userId: string, role: string, adminId: string): Promise<User | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private tasks: Map<number, Task>;
  private projects: Map<number, Project>;
  private taskIdCounter: number;
  private projectIdCounter: number;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.projects = new Map();
    this.taskIdCounter = 1;
    this.projectIdCounter = 1;
  }

  async getUser(id: string): Promise<User | undefined> { return this.users.get(id); }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = { ...userData, role: userData.role ?? "user", createdAt: new Date(), updatedAt: new Date() };
    this.users.set(user.id, user);
    return user;
  }

  async getTasks(userId: string): Promise<TaskWithRelations[]> {
    return Array.from(this.tasks.values())
      .filter(t => t.createdById === userId)
      .map(t => ({ ...t, project: t.projectId ? this.projects.get(t.projectId) : null, assignee: null }));
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.taskIdCounter++;
    const task: Task = { ...insertTask, id, createdAt: new Date(), updatedAt: new Date(), completedAt: null };
    this.tasks.set(id, task);
    return task;
  }

  // Simplified versions for other methods to ensure it runs
  async getTask(id: number) { return this.tasks.get(id) as any; }
  async updateTask(id: number, task: any) { 
    const existing = this.tasks.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...task };
    this.tasks.set(id, updated);
    return updated;
  }
  async deleteTask(id: number) { return this.tasks.delete(id); }
  async getProjects(userId: string) { return Array.from(this.projects.values()).filter(p => p.ownerId === userId); }
  async createProject(p: InsertProject) { 
    const id = this.projectIdCounter++;
    const project = { ...p, id, createdAt: new Date(), updatedAt: new Date() };
    this.projects.set(id, project);
    return project;
  }
  async getTaskStats(userId: string) {
    const userTasks = Array.from(this.tasks.values()).filter(t => t.createdById === userId);
    return {
      totalTasks: userTasks.length,
      completed: userTasks.filter(t => t.status === "completed").length,
      inProgress: userTasks.filter(t => t.status === "in_progress").length,
      planned: userTasks.filter(t => t.status === "planned").length
    };
  }
  async getAllUsers() { return Array.from(this.users.values()); }
  async updateUserRole(id: string, role: string) {
    const user = this.users.get(id);
    if (!user) return undefined;
    user.role = role;
    return user;
  }
}

export const storage = new MemStorage();
