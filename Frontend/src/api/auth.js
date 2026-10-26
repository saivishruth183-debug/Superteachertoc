import apiClient from "./client";

export const login = async (email, password) => {
  if (import.meta.env.PROD && !apiClient.defaults.baseURL.startsWith("https://")) {
    throw new Error("Set VITE_BACKEND_URL to the HTTPS origin of the backend Vercel project.");
  }

  try {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    // Show the backend's explanation (e.g. a database problem) instead of
    // axios's generic "Request failed with status code 500".
    const serverMessage = error.response?.data?.message;
    if (serverMessage && error.response.status !== 401 && error.response.status !== 405) {
      error.message = serverMessage;
    }
    throw error;
  }
};
