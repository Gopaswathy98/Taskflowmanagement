import { QueryClient } from "@tanstack/react-query";

/** * IMPORTANT: Replace the URL below with your actual Render URL 
 * Example: "https://task-management-backend.onrender.com"
 */
const BACKEND_URL = "PASTE_YOUR_RENDER_URL_HERE"; 

export const apiRequest = async (method: string, url: string, data?: any) => {
  // This ensures we call the backend on Render, not GitHub
  const res = await fetch(`${BACKEND_URL}${url}`, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "An error occurred");
  }
  return res;
};

export const queryClient = new QueryClient();
