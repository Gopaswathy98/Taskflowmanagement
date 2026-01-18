import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";

function RouterConfig() {
  return (
    // ✅ The "base" ensures internal links don't get lost on GitHub
    <Router base="/Taskflowmanagement">
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/dashboard" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterConfig />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
