import { apiGet, apiPost } from "@/lib/api-client";

export interface Account {
  id: string;
  name: string;
  currency: string;
  description: string | null;
  balance: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface AccountResponse {
  message: string;
  data: Account;
}

interface AccountsListResponse {
  message: string;
  data: Account[];
}

export interface CreateAccountPayload {
  name: string;
  currency: string;
  description?: string;
}

export function listAccounts(): Promise<AccountsListResponse> {
  return apiGet<AccountsListResponse>("/accounts");
}

export function getAccount(id: string): Promise<AccountResponse> {
  return apiGet<AccountResponse>(`/accounts/${id}`);
}

export function createAccount(
  payload: CreateAccountPayload,
): Promise<AccountResponse> {
  return apiPost<AccountResponse>("/accounts", payload);
}
