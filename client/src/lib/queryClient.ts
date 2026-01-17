import { QueryClient } from "@tanstack/react-query";

// ⚠️ STEP 1: Replace this URL with your ACTUAL Render Backend URL
// It should look like "https://taskflow-management-backend.onrender.com"
const RENDER_BACKEND_URL = "PASTE_YOUR_RENDER_URL_HERE"; 

export const apiRequest = async (method: string, url: string, data?: any) => {
  // This line tells the "Sign In" button to go to Render, NOT GitHub
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
