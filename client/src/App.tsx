import { QueryClient } from "@tanstack/react-query";

// ⚠️ IMPORTANT: Put your Render Backend URL here 
// It should look like: "https://taskflow-backend.onrender.com"
const RENDER_BACKEND_URL = "YOUR_RENDER_URL_HERE"; 

export const apiRequest = async (method: string, url: string, data?: any) => {
  // This line forces the app to talk to Render, not GitHub Pages
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
