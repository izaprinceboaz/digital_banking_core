import api from "./api";
import type { LoginRequest, AuthResponse, RegisterRequest } from "../types/auth";

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/api/auth/login", data);
  return res.data;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/api/auth/register", data);
  return res.data;
}

export async function logout(refreshToken: string): Promise<void> {
  await api.post("/api/auth/logout", { refreshToken });
}

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;
  try {
    const res = await api.post<{ accessToken: string }>("/api/auth/refresh", { refreshToken });
    localStorage.setItem("accessToken", res.data.accessToken);
    return res.data.accessToken;
  } catch {
    return null;
  }
}