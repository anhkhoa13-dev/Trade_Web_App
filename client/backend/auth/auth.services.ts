import { ActivateRequest, LoginRequest, RegisterRequest } from "./auth.types";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"
import { Session } from "next-auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export const AuthService = {
    async login(payload: LoginRequest) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        return response
    },

    async logout(cookies: Pick<ReadonlyRequestCookies, "get">, session: Session) {
        const refreshToken = cookies.get("refresh_token")?.value
        const accessToken = session?.accessToken

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                Cookie: `refresh_token=${refreshToken}`,
                Authorization: `Bearer ${accessToken}`
            }
        })
        return response
    },

    async refresh(cookies: Pick<ReadonlyRequestCookies, "get">) {
        const refreshToken = cookies.get("refresh_token")?.value
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: "POST",
            headers: {
                Cookie: `refresh_token=${refreshToken}`
            }
        })
        return response
    },

    async register(payload: RegisterRequest) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        return response
    },

    async active(payload: ActivateRequest) {
        const response = await fetch(`${API_BASE_URL}/auth/activate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        return response
    },
    async loginGoogle(idToken: String) {
        const response = await fetch(`${API_BASE_URL}/auth/social/google`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ idToken })
        })
        return response
    },
};