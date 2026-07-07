import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // e.g. http://localhost:8080
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isAuthCall = error.config?.url?.startsWith("/api/auth/");
    if (error.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Can't reach the server. Check your connection and try again.";
    }
    const data = error.response.data as
      | { message?: unknown; errors?: unknown }
      | undefined;
    if (data && typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
  }
  return fallback;
}

export default api;
