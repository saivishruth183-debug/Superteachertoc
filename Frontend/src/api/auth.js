import apiClient from "./client";

export const login = async (email, password) => {
  if (import.meta.env.PROD && !apiClient.defaults.baseURL.startsWith("https://")) {
    throw new Error("Set VITE_BACKEND_URL to the HTTPS origin of the backend Vercel project.");
  }

  const response = await apiClient.post("/auth/login", { email, password });
  return response.data;
};
