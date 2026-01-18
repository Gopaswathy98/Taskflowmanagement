import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";

function RouterConfig() {
  return (
    // ✅ This prevents the 404 on GitHub Pages
    <Router base="/Taskflowmanagement">
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/dashboard" component={Dashboard} />
      </Switch>
    </Router>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterConfig />
      <Toaster />
    </QueryClientProvider>
  );
}
