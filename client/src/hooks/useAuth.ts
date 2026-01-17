import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "../lib/queryClient"; 
import { useToast } from "@/hooks/use-toast";

export function useAuth() {
  const { toast } = useToast();

  // This is the "Heartbeat" check
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/user"],
    // ⚠️ CRITICAL: Must use apiRequest to include credentials and point to Render
    queryFn: () => apiRequest("GET", "/api/user").then(res => res.json()),
    retry: false,
    // This prevents the app from constantly re-checking and potentially looping
    staleTime: 5 * 60 * 1000, 
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: any) => 
      apiRequest("POST", "/api/login", credentials).then(res => res.json()),
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/logout"),
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
    },
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    loginMutation,
    logoutMutation,
  };
}
