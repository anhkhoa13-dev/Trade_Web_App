import { auth } from "@/auth";
import { NetworkError } from "@/lib/errors";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
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

    // network error
    try {
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: mergedHeaders,
        })

        return response
    } catch (error) {
        throw new NetworkError("Network error")
    }

}

export const api = {
    get: (endpoint: string, options: RequestInit = {}) =>
        fetchWithAuth(endpoint, {
            ...options,
            method: 'GET'
        }),

    post: (endpoint: string, body: any, options: RequestInit = {}) =>
        fetchWithAuth(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body)
        }),

    put: (endpoint: string, body: any, options: RequestInit = {}) =>
        fetchWithAuth(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body)
        }),

    delete: (endpoint: string, options: RequestInit = {}) =>
        fetchWithAuth(endpoint, { ...options, method: 'DELETE' }),
};