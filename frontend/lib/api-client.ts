import axios, { AxiosError, type Method } from "axios";
import { formatErrorMessage } from "@/lib/format-error";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, data: unknown) {
    super(formatErrorMessage(data));
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

async function request<TResponse>(
  method: Method,
  path: string,
  data?: unknown,
): Promise<TResponse> {
  try {
    const response = await httpClient.request<TResponse>({
      method,
      url: path,
      data,
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        throw new ApiError(error.response.status, error.response.data);
      }

      throw new ApiError(0, {
        message: "Unable to reach the server. Please try again.",
      });
    }

    throw error;
  }
}

export function apiGet<TResponse>(path: string): Promise<TResponse> {
  return request<TResponse>("GET", path);
}

export function apiPost<TResponse>(
  path: string,
  body?: unknown,
): Promise<TResponse> {
  return request<TResponse>("POST", path, body);
}

export function apiPatch<TResponse>(
  path: string,
  body?: unknown,
): Promise<TResponse> {
  return request<TResponse>("PATCH", path, body);
}

export function apiDelete<TResponse>(path: string): Promise<TResponse> {
  return request<TResponse>("DELETE", path);
}
