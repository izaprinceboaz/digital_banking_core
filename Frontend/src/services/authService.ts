import axios from "axios";
import type { LoginRequest, AuthResponse, RegisterRequest } from "../types/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // e.g. http://localhost:8080
});

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/api/auth/login", data);
  return res.data;
}

export async function register(data: RegisterRequest) {
    const res = await api.post("/api/auth/register", data);
    return res.data;
}