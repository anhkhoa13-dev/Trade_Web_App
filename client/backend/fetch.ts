import { auth } from "@/auth"
import { NetworkError } from "@/lib/errors"
import { ErrorResponse } from "./errorResponse"
import { ApiResponse } from "./constants/ApiResponse"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}) {
    const session = await auth()
    const accessToken = session?.accessToken

    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (accessToken) {
        defaultHeaders['Authorization'] = `Bearer ${accessToken}`;
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
        })

        if (!response.ok) {
            const error = await response.json() as ErrorResponse
            return {
                status: "error",
                timestamp: new Date().toISOString(),
                message: error.detail,
                data: null,
                statusCode: error.status
            }
        }

        const data = await response.json() as ApiResponse<T>

        return data
    } catch (error) {
        throw new NetworkError("Network error")
    }

}

export const api = {
    get: <T>(endpoint: string, options: RequestInit = {}) =>
        fetchWithAuth<T>(endpoint, {
            ...options,
            method: 'GET'
        }),

    post: <T>(endpoint: string, body: any, options: RequestInit = {}) =>
        fetchWithAuth<T>(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body)
        }),

    put: <T>(endpoint: string, body: any, options: RequestInit = {}) =>
        fetchWithAuth<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body)
        }),

    delete: <T>(endpoint: string, options: RequestInit = {}) =>
        fetchWithAuth<T>(endpoint, { ...options, method: 'DELETE' }),
};