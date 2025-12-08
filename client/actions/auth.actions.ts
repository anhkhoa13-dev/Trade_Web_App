"use server"

import { signIn, signOut } from "@/auth";

import { AuthService } from "@/backend/auth/auth.services";
import { LoginResponse, RegisterResponse } from "@/backend/auth/auth.types";
import { ApiResponse } from "@/backend/constants/ApiResponse";
import { ErrorResponse } from "@/backend/errorResponse";

import { NetworkError } from "@/lib/errors";
import { LoginInput } from "@/schema/loginSchema";
import { RegisterInput } from "@/schema/registerSchema";
import { VerificationInput } from "@/schema/verificationSchema";
import { cookies } from "next/headers";
import * as setCookieParser from "set-cookie-parser";

export async function login(params: LoginInput): Promise<ApiResponse<LoginResponse>> {
    try {
        const response = await AuthService.login(params)

        // error
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

        // success
        const data = await response.json() as ApiResponse<LoginResponse>

        // Set springboot header
        const setCookieHeader = response.headers.getSetCookie()

        if (setCookieHeader && setCookieHeader.length > 0) {

            const parsedCookies = setCookieParser.parse(setCookieHeader)
            const cookieStore = await cookies()

            parsedCookies.forEach(cookie => {
                cookieStore.set({
                    name: cookie.name,
                    value: cookie.value,
                    httpOnly: cookie.httpOnly,
                    secure: cookie.secure,
                    path: cookie.path,
                    maxAge: cookie.maxAge,
                    expires: cookie.expires,
                    sameSite: cookie.sameSite as "lax" | "strict" | "none",
                    domain: cookie.domain,
                })
            })
        }

        // Save user session with next-auth
        await signIn("credentials", {
            loginResponseJson: JSON.stringify(data.data),
            redirect: false,
        })


        return data
    } catch (error) {
        if (error instanceof NetworkError)
            return {
                status: "error",
                timestamp: new Date().toISOString(),
                message: error.message,
                data: null,
                statusCode: 503
            }

        return {
            status: "error",
            timestamp: new Date().toISOString(),
            message: "Internal Server Error",
            data: null,
            statusCode: 500
        }
    }
}

export async function logout() {
    try {
        // remove refresh token at backend
        const cookieStore = await cookies()
        const response = await AuthService.logout(cookieStore)

        // delete cookie
        const setCookieHeader = response.headers.getSetCookie()
        if (setCookieHeader && setCookieHeader.length > 0) {
            const parsedCookies = setCookieParser.parse(setCookieHeader)

            parsedCookies.forEach(cookie => {
                cookieStore.set({
                    name: cookie.name,
                    value: cookie.value,
                    httpOnly: cookie.httpOnly,
                    secure: cookie.secure,
                    path: cookie.path,
                    maxAge: cookie.maxAge,
                    expires: cookie.expires,
                    sameSite: cookie.sameSite as "lax" | "strict" | "none",
                    domain: cookie.domain,
                });
            });
        }
    } catch (error) {
        console.log("Logout error at Nextjs Server", error)
    }
    await signOut({ redirectTo: "/" })
}

export async function register(params: RegisterInput): Promise<ApiResponse<RegisterResponse>> {
    try {
        const response = await AuthService.register(params)

        // error
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

        // success
        const data = await response.json() as ApiResponse<RegisterResponse>
        return data

    } catch (error) {
        if (error instanceof NetworkError)
            return {
                status: "error",
                timestamp: new Date().toISOString(),
                message: error.message,
                data: null,
                statusCode: 503
            }

        return {
            status: "error",
            timestamp: new Date().toISOString(),
            message: "Internal Server Error",
            data: null,
            statusCode: 500
        }
    }
}


export async function activate({ urlToken, params }: { urlToken: string, params: VerificationInput }): Promise<ApiResponse> {
    try {
        const response = await AuthService.active({ urlToken, ...params })

        // error
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

        // success
        const data = await response.json() as ApiResponse
        return data

    } catch (error) {
        if (error instanceof NetworkError)
            return {
                status: "error",
                timestamp: new Date().toISOString(),
                message: error.message,
                data: null,
                statusCode: 503
            }

        return {
            status: "error",
            timestamp: new Date().toISOString(),
            message: "Internal Server Error",
            data: null,
            statusCode: 500
        }
    }
}
