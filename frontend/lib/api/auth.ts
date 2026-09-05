import { apiGet, apiPost } from "@/lib/api-client";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  message: string;
  data: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  retypePassword: string;
}

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiPost<AuthResponse>("/auth/login", payload);
}

export function signup(payload: SignupPayload): Promise<AuthResponse> {
  return apiPost<AuthResponse>("/auth/signup", payload);
}

export function getCurrentUser(): Promise<AuthResponse> {
  return apiGet<AuthResponse>("/auth/me");
}

export function logout(): Promise<{ message: string }> {
  return apiPost<{ message: string }>("/auth/logout");
}
