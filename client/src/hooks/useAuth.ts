import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "../lib/queryClient"; // Ensure this points to our fixed queryClient
import { useToast } from "@/hooks/use-toast";

export function useAuth() {
  const { toast } = useToast();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/user"],
    queryFn: () => apiRequest("GET", "/api/user").then(res => res.json()),
    retry: false,
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
