import { QueryClient } from "@tanstack/react-query";

// This is your official Render Backend URL
const RENDER_BACKEND_URL = "https://taskflowmanagement.onrender.com"; 

export const apiRequest = async (method: string, url: string, data?: any) => {
  // This line tells the "Sign In" button to go to Render, NOT GitHub
  const res = await fetch(`${RENDER_BACKEND_URL}${url}`, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    // ⚠️ THE FIX: This allows Render to save your login session in the browser
    credentials: "include", 
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "An error occurred");
  }
  return res;
};

export const queryClient = new QueryClient();
