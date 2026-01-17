import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "../lib/queryClient"; 
import { useToast } from "@/hooks/use-toast";

export function useAuth() {
  const { toast } = useToast();

  // This check MUST go to Render, otherwise it thinks you are logged out
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/user"],
    queryFn: () => apiRequest("GET", "/api/user").then(res => res.json()),
    retry: false,
    staleTime: Infinity, // Keep the user session active
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

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    loginMutation,
  };
}
