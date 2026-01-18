import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckSquare } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

export default function Landing() {
  const [, setLocation] = useLocation();

  const handleLogin = async () => {
    try {
      // Background request to Render API
      await apiRequest("POST", "/api/login", {});
      
      // Navigate to dashboard
      // Router base in App.tsx handles the /Taskflowmanagement prefix
      setLocation("/dashboard");
    } catch (error) {
      console.error("Login redirecting to dashboard:", error);
      setLocation("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center bg-primary-600 rounded-2xl mb-4">
              <CheckSquare className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-secondary-900">TaskFlow</h2>
            <p className="mt-2 text-secondary-600">Task Management Platform</p>
          </div>
          <div className="mt-8 space-y-4">
            <Button 
              onClick={handleLogin}
              className="w-full py-3 text-sm font-medium shadow-lg hover:shadow-xl"
            >
              Sign In to Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
