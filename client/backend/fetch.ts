import { auth } from "@/auth";
import { NetworkError } from "@/lib/errors";
import { ErrorResponse } from "./errorResponse";
import { ApiError, ApiResponse } from "./constants/ApiResponse";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function _fetch<T>(
  endpoint: string,
  options: RequestInit = {},
  withAuth: boolean
) {
  const session = await auth();
  const accessToken = session?.accessToken;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken && withAuth) {
    defaultHeaders["Authorization"] = `Bearer ${accessToken}`;
  }

  const mergedHeaders = {
    ...defaultHeaders,
    ...options.headers,
  };

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: mergedHeaders,
    });

    if (!response.ok) {
      const error = (await response.json()) as ErrorResponse;
      return {
        status: "error",
        timestamp: new Date().toISOString(),
        message: error.detail,
        data: null,
        statusCode: error.status,
      } as ApiError;
    }

    // Handle empty response (e.g., 204 No Content for DELETE operations)
    const contentType = response.headers.get("content-type");
    const hasContent = contentType && contentType.includes("application/json");

    if (!hasContent || response.status === 204) {
      return {
        status: "success",
        timestamp: new Date().toISOString(),
        message: "Operation successful",
        data: null,
      } as ApiResponse<T>;
    }

    const data = (await response.json()) as ApiResponse<T>;

    return data;
  } catch (error) {
    throw new NetworkError("Network error");
  }
}

type ApiOptions = {
  endpoint: string;
  options?: RequestInit;
  withAuth?: boolean;
  body?: any;
};

export const api = {
  get: <T>({ endpoint, options = {}, withAuth = true }: ApiOptions) =>
    _fetch<T>(endpoint, { ...options, method: "GET" }, withAuth),

  post: <T>({ endpoint, body, options = {}, withAuth = true }: ApiOptions) =>
    _fetch<T>(
      endpoint,
      { ...options, method: "POST", body: JSON.stringify(body) },
      withAuth
    ),

  put: <T>({ endpoint, body, options = {}, withAuth = true }: ApiOptions) =>
    _fetch<T>(
      endpoint,
      { ...options, method: "PUT", body: JSON.stringify(body) },
      withAuth
    ),

  patch: <T>({ endpoint, body, options = {}, withAuth = true }: ApiOptions) =>
    _fetch<T>(
      endpoint,
      { ...options, method: "PATCH", body: JSON.stringify(body) },
      withAuth
    ),

  delete: <T>({ endpoint, options = {}, withAuth = true }: ApiOptions) =>
    _fetch<T>(endpoint, { ...options, method: "DELETE" }, withAuth),
};
