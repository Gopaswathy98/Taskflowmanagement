import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { TaskModal } from "@/components/task-modal";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Tasks from "@/pages/tasks";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  if (isLoading || !isAuthenticated) {
    return <Landing />;
  }

  return (
    <div className="flex h-screen bg-secondary-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          onNewTask={() => setTaskModalOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto bg-secondary-50">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/tasks" component={Tasks} />
            <Route path="/projects">
              <div className="p-6 text-center py-20">
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">Projects Section</h3>
                <p className="text-secondary-600">Project management interface coming soon</p>
              </div>
            </Route>
            <Route path="/team">
              <div className="p-6 text-center py-20">
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">Team Section</h3>
                <p className="text-secondary-600">Team management interface coming soon</p>
              </div>
            </Route>
            <Route path="/reports">
              <div className="p-6 text-center py-20">
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">Reports Section</h3>
                <p className="text-secondary-600">Analytics and reporting interface coming soon</p>
              </div>
            </Route>
            <Route path="/admin" component={Admin} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>

      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
