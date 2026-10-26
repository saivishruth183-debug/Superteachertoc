import axios from "axios";
import { backendUrl } from "./backendUrl";

const apiClient = axios.create({ baseURL: `${backendUrl}/api` });

apiClient.interceptors.request.use((config) => {
  if (import.meta.env.PROD && !backendUrl) {
    return Promise.reject(
      new Error("Set VITE_BACKEND_URL to the deployed backend origin in the frontend deployment settings."),
    );
  }

  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;
