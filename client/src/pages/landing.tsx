import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckSquare } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

export default function Landing() {
  const [, setLocation] = useLocation();
  
  // ✅ This ensures the app navigates within the GitHub subfolder
  const BASE_PATH = "/Taskflowmanagement";

  const handleLogin = async () => {
    try {
      // 1. Send the background request to the Render API
      await apiRequest("POST", "/api/login", {});
      
      // 2. SUCCESS: Move to the dashboard using the correct GitHub path
      setLocation(`${BASE_PATH}/dashboard`);
    } catch (error) {
      console.error("Login request failed, but redirecting to dashboard anyway:", error);
      // Fallback: Force navigation to the dashboard
      setLocation(`${BASE_PATH}/dashboard`);
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
            <p className="text-center text-secondary-700">
              Streamline your workflow with our powerful task management platform
            </p>
            
            <Button 
              onClick={handleLogin}
              className="w-full py-3 text-sm font-medium shadow-lg hover:shadow-xl"
            >
              Sign In to Continue
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-secondary-500">
              Secure authentication powered by Render
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
