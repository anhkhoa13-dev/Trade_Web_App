import { NetworkError } from "@/lib/errors"
import { ApiResponse } from "@/backend/constants/ApiResponse"
import { isRedirectError } from "next/dist/client/components/redirect-error"

// no argument
export function withAuthError<R>(
    action: () => Promise<R>
): () => Promise<R | ApiResponse<any>>

// with argument
export function withAuthError<T, R>(
    action: (params: T) => Promise<R>
): (params: T) => Promise<R | ApiResponse<any>>


export function withAuthError(action: any) {
    return async (...args: any[]) => {
        try {
            return await action(...args)
        } catch (error) {
            // Redirect error (Next.js logic)
            if (isRedirectError(error)) {
                throw error
            }

            // Network Error
            if (error instanceof NetworkError) {
                return {
                    status: "error",
                    timestamp: new Date().toISOString(),
                    message: error.message,
                    data: null,
                    statusCode: 503
                }
            }

            // Server error
            console.error("Server Action Error:", error);
            return {
                status: "error",
                timestamp: new Date().toISOString(),
                message: "Internal Server Error",
                data: null,
                statusCode: 500
            }
        }
    };
}