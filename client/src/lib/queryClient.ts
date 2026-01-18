import { QueryClient } from "@tanstack/react-query";

// This is your official Render Backend URL
const RENDER_BACKEND_URL = "https://taskflowmanagement.onrender.com"; 

export const apiRequest = async (method: string, url: string, data?: any) => {
  // Ensure we don't have double slashes if the url starts with /
  const targetUrl = url.startsWith('/') 
    ? `${RENDER_BACKEND_URL}${url}` 
    : `${RENDER_BACKEND_URL}/${url}`;

  // This line tells the "Sign In" button to go to Render, NOT GitHub
  const res = await fetch(targetUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    // ⚠️ CRITICAL: This allows the browser to save the session cookie from Render
    credentials: "include", 
  });

  if (!res.ok) {
    // If it's a 404 or 500, try to get the error message
    try {
      const error = await res.json();
      throw new Error(error.message || "An error occurred");
    } catch (e) {
      throw new Error(`Server error: ${res.status} ${res.statusText}`);
    }
  }
  
  // Return the JSON if it exists, otherwise return the response
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  return res;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});
