import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
  type Method,
} from "axios";
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

// Endpoints where a 401/403 means "not authenticated" or "wrong credentials",
// not "access token went stale" — retrying these after a refresh either loops
// forever (/auth/refresh itself) or makes no sense (login/signup/logout).
const AUTH_RETRY_EXEMPT_PATHS = [
  "/auth/refresh",
  "/auth/login",
  "/auth/signup",
  "/auth/logout",
];

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retriedAfterRefresh?: boolean;
}

let refreshPromise: Promise<void> | null = null;

// The access token embeds the user's role at issue time (15m TTL), so a role
// change (or any stale-but-not-yet-expired token) only takes effect once this
// fires — either naturally on expiry or, here, reactively on a 401/403.
function refreshSession(): Promise<void> {
  refreshPromise ??= httpClient
    .post("/auth/refresh")
    .then(() => undefined)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableConfig | undefined;
    const status = error.response?.status;

    const canRetry =
      config &&
      !config._retriedAfterRefresh &&
      (status === 401 || status === 403) &&
      !AUTH_RETRY_EXEMPT_PATHS.some((path) => config.url?.startsWith(path));

    if (canRetry) {
      config._retriedAfterRefresh = true;

      try {
        await refreshSession();
        return await httpClient.request(config);
      } catch {
        // Refresh failed too — fall through and surface the original error.
      }
    }

    return Promise.reject(error);
  },
);

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
