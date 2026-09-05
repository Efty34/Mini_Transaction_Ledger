import { apiDelete, apiGet, apiPatch } from "@/lib/api-client";
import type { AuthUser } from "@/lib/api/auth";

export type ManagedUser = AuthUser;

interface UsersListResponse {
  message: string;
  data: ManagedUser[];
}

interface UserResponse {
  message: string;
  data: ManagedUser;
}

export function listUsers(): Promise<UsersListResponse> {
  return apiGet<UsersListResponse>("/users");
}

export function updateUserRole(
  id: string,
  role: "user" | "admin",
): Promise<UserResponse> {
  return apiPatch<UserResponse>(`/users/${id}`, { role });
}

export function deleteUser(id: string): Promise<{ message: string }> {
  return apiDelete<{ message: string }>(`/users/${id}`);
}
