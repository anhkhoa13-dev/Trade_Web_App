import { api } from "@/actions/fetch";
import { LoginRequest } from "./auth.types";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export const AuthService = {
    async login(payload: LoginRequest) {
        const response = await api.post(
            "/auth/login",
            payload,
        )

        return response
    },

    async logout(cookies: Pick<ReadonlyRequestCookies, "get">) {
        const refreshToken = cookies.get("refresh_token")?.value

        const response = await api.post(
            "/auth/logout",
            {},
            {
                headers: {
                    Cookie: `refresh_token=${refreshToken}`
                }
            }
        )

        return response
    }
};