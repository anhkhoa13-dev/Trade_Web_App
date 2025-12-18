import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { JWT } from "next-auth/jwt"
import { LoginResponse } from "./backend/auth/auth.types"
import { cookies } from "next/headers"
import { AuthService } from "./backend/auth/auth.services"
import { ApiResponse } from "./backend/constants/ApiResponse"
import * as setCookieParser from "set-cookie-parser";
import { ErrorResponse } from "./backend/errorResponse"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                loginResponseJson: { label: "Login Response", type: "text" }
            },
            authorize: async (credentials) => {
                if (!credentials?.loginResponseJson) return null

                try {
                    const loginData = JSON.parse(credentials.loginResponseJson as string) as LoginResponse
                    return {
                        ...loginData,
                        ...loginData.user
                    }
                } catch (error) {
                    console.error(error)
                    return null
                }
            }
        }),
        Google,
    ],

    callbacks: {
        async jwt({ token, user, account }) {
            if (user && account) {
                switch (account.provider) {
                    case "google": {
                        const googleIdToken = account.id_token
                        if (!googleIdToken) return token;

                        const backendData = await loginWithGoogle(googleIdToken)

                        if (backendData) {
                            token.accessToken = backendData.accessToken
                            token.expiresAt = backendData.expiresAt
                            token.user = {
                                id: backendData.user.id,
                                email: backendData.user.email,
                                username: backendData.user.username,
                                fullname: backendData.user.fullname,
                                avatarUrl: backendData.user.avatarUrl,
                                roles: backendData.user.roles,
                            }
                        }
                        break
                    }

                    case "credentials": {
                        token.accessToken = user.accessToken
                        token.expiresAt = user.expiresAt
                        token.user = {
                            id: user.id,
                            email: user.email,
                            username: user.username,
                            fullname: user.fullname,
                            avatarUrl: user.avatarUrl,
                            roles: user.roles,
                        }
                        break
                    }

                    default:
                        break
                }

                return token
            }

            if (Date.now() < token.expiresAt)
                return token

            return await refreshAccessToken(token)
        },
        session({ session, token }) {
            if (token.error) {
                return {
                    ...session,
                    user: undefined,
                    accessToken: undefined,
                };
            }
            session.accessToken = token.accessToken;
            session.user = { ...session.user, ...token.user };
            return session;
        }
    },

    pages: {
        signIn: "/login"
    }
})

async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
        console.log("Refresh token")
        const cookieStore = await cookies()
        const refreshToken = cookieStore.get("refresh_token")?.value

        // refresh token null
        if (!refreshToken) {
            return { ...token, error: "RefreshAccessTokenError" }
        }

        const response = await AuthService.refresh(cookieStore)
        // backend error
        if (!response.ok) {
            const error = await response.json() as ErrorResponse
            return { ...token, error: error.detail }
        }

        const data = await response.json() as ApiResponse<LoginResponse>

        // update cookie
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

        return {
            ...token,
            accessToken: data.data!.accessToken,
            expiresAt: data.data!.expiresAt,
            user: data.data!.user,
        }


    } catch (error) {
        console.error("Error refreshing token:", error)
        return {
            ...token,
            error: "RefreshAccessTokenError"
        }
    }
}

async function loginWithGoogle(idToken: string): Promise<LoginResponse | null> {
    try {
        const res = await AuthService.loginGoogle(idToken)

        if (!res.ok) {
            const error = await res.json() as ErrorResponse
            console.error(error)
            return null
        }

        const data = await res.json() as ApiResponse<LoginResponse>

        const setCookieHeader = res.headers.getSetCookie()
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

        return data.data || null
    }
    catch (error) {
        console.error("Error during Google Login Action:", error)
        return null
    }
}