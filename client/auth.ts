import NextAuth, { Session, User } from "next-auth"
import Credentials from "next-auth/providers/credentials"
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
        })
    ],

    callbacks: {
        async jwt({ token, user }: { token: JWT, user: User }) {
            if (user) {
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
                return token
            }
            if (Date.now() < token.expiresAt)
                return token

            return await refreshAccessToken(token)
        },
        session({ session, token }: { session: Session, token: JWT }) {
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

export async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
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