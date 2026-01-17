import { QueryClient } from "@tanstack/react-query";

/**
 * ⚠️ THE FIX: Replace the URL below with your REAL Render URL.
 * It should look exactly like: "https://your-app-name.onrender.com"
 */
const RENDER_BACKEND_URL = "PASTE_YOUR_ACTUAL_RENDER_URL_HERE"; 

export const apiRequest = async (method: string, url: string, data?: any) => {
  // This line is the only way to stop the 404 error. 
  // It forces the button to talk to Render instead of GitHub.
  const res = await fetch(`${RENDER_BACKEND_URL}${url}`, {
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
