import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { StatsCard } from "@/components/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  CheckSquare,
  Clock,
  Users,
  Calendar,
  TrendingUp,
  FileText,
  Database,
  Plus,
  FolderPlus,
  UserPlus,
} from "lucide-react";
import type { TaskWithRelations } from "@shared/schema";

interface TaskStats {
  totalTasks: number;
  completed: number;
  inProgress: number;
  planned: number;
}

export default function Dashboard() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery<TaskStats>({
    queryKey: ["/api/stats"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: recentTasks = [], isLoading: tasksLoading } = useQuery<TaskWithRelations[]>({
    queryKey: ["/api/tasks"],
    enabled: isAuthenticated,
    retry: false,
  });

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-orange-100 text-orange-800";
      case "planned":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-secondary-100 text-secondary-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "planned":
        return "Planned";
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-secondary-100 text-secondary-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Welcome back, {user?.firstName || "User"}!
            </h2>
            <p className="text-primary-100 text-lg">
              Here's what's happening with your projects today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4">
              <TrendingUp size={48} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 flex items-center justify-center">
                <LoadingSpinner />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <StatsCard
              title="Total Tasks"
              value={stats?.totalTasks || 0}
              icon={CheckSquare}
              iconColor="bg-blue-100 text-blue-600"
            />
            <StatsCard
              title="Completed"
              value={stats?.completed || 0}
              icon={CheckSquare}
              iconColor="bg-green-100 text-green-600"
            />
            <StatsCard
              title="In Progress"
              value={stats?.inProgress || 0}
              icon={Clock}
              iconColor="bg-orange-100 text-orange-600"
            />
            <StatsCard
              title="Planned"
              value={stats?.planned || 0}
              icon={Calendar}
              iconColor="bg-purple-100 text-purple-600"
            />
          </>
        )}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Tasks</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <a href="/tasks">View all</a>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {tasksLoading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : recentTasks.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-secondary-300 mb-4" />
                  <h3 className="text-lg font-medium text-secondary-900 mb-2">No tasks yet</h3>
                  <p className="text-secondary-600">Create your first task to get started</p>
                </div>
              ) : (
                recentTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center space-x-4 p-4 rounded-lg hover:bg-secondary-50 transition-colors"
                  >
                    <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FileText className="text-primary-600" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-secondary-900 truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-secondary-600">
                        {task.project?.name || "No project"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                        {getStatusText(task.status)}
                      </span>
                      {task.dueDate && (
                        <span className="text-xs text-secondary-500">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  // This would be handled by the parent component
                  window.location.href = "/tasks";
                }}
              >
                <Plus className="mr-3 text-primary-600" size={20} />
                Create New Task
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FolderPlus className="mr-3 text-green-600" size={20} />
                New Project
              </Button>
              {user?.role === "admin" && (
                <Button variant="outline" className="w-full justify-start">
                  <UserPlus className="mr-3 text-blue-600" size={20} />
                  Invite Team Member
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
