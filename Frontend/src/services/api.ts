import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let queue: ((token: string) => void)[] = [];

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as any;
    const isAuthCall = original?.url?.startsWith("/api/auth/");

    if (error.response?.status === 401 && !isAuthCall && !original._retry) {
      if (isRefreshing) {
        // another request is already refreshing — wait for it
        return new Promise((resolve, reject) => {
          queue.push((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        clearAndRedirect();
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
          { refreshToken }
        );
        const newToken = res.data.accessToken;
        localStorage.setItem("accessToken", newToken);

        // flush queued requests with new token
        queue.forEach((cb) => cb(newToken));
        queue = [];

        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        clearAndRedirect();
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

function clearAndRedirect() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return "Can't reach the server. Check your connection and try again.";
    const data = error.response.data as { message?: unknown } | undefined;
    if (data && typeof data.message === "string" && data.message.trim()) return data.message;
  }
  return fallback;
}

export default api;
