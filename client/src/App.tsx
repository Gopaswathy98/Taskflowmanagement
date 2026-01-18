import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";

function RouterConfig() {
  return (
    // ✅ No extra slashes here, just the folder name
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
