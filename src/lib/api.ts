import axios from "axios";
import { auth } from "./firebase";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Automatically attach Firebase ID token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${idToken}`;
      }
    } catch (error) {
      console.warn("Failed to retrieve Firebase ID token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Uniform error log
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("401 Unauthorized — Please sign in to FinOne");
    }
    return Promise.reject(error);
  }
);
