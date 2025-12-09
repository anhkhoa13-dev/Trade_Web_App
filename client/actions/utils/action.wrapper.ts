
import { NetworkError } from "@/lib/errors";
import { ApiResponse } from "@/backend/constants/ApiResponse";
import { isRedirectError } from "next/dist/client/components/redirect-error";

type ActionFunction<T, R> = (params: T) => Promise<R>;

export function withAuthError<T, R>(action: ActionFunction<T, R>): ActionFunction<T, R | ApiResponse<any>> {
    return async (params: T): Promise<R | ApiResponse<any>> => {
        try {
            return await action(params);
        } catch (error) {
            // Redirect error
            if (isRedirectError(error)) {
                throw error;
            }

            // Network Error
            if (error instanceof NetworkError) {
                return {
                    status: "error",
                    timestamp: new Date().toISOString(),
                    message: error.message,
                    data: null,
                    statusCode: 503
                };
            }

            // Server error
            console.error("Server Action Error:", error);
            return {
                status: "error",
                timestamp: new Date().toISOString(),
                message: "Internal Server Error",
                data: null,
                statusCode: 500
            };
        }
    };
}