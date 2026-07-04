import axios from "axios";
import { clearAuthSession, getAuthSession, navigateTo } from "../utils/auth.js";

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json"
  }
});

apiClient.interceptors.request.use((config) => {
  const session = getAuthSession();

  if (session?.token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${session.token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = String(error?.config?.url || "");
    const status = error?.response?.status;
    const isProtectedRequest = !requestUrl.startsWith("/auth/");

    if (isProtectedRequest && (status === 401 || status === 403)) {
      clearAuthSession();

      if (window.location.pathname !== "/login") {
        navigateTo("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
