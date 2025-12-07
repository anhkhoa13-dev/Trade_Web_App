import NextAuth, { Session, User } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { JWT } from "next-auth/jwt"
import { LoginResponse } from "./backend/auth/auth.types"

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
            // if (Date.now() < token.expiresAt)
            return token


            // try {
            //     const res = await AuthService.refresh()
            //     if (res.data && (res.statusCode === 200 || res.statusCode === 201)) {
            //         const loginResponse = res.data

            //         return {
            //             ...token,
            //             accessToken: loginResponse.accessToken,
            //             expiresAt: loginResponse.expiresAt,
            //             user: loginResponse.user
            //         }
            //     }
            //     throw new Error(res.message || "Refresh failed")
            // } catch (error) {
            //     console.error("Error refreshing token:", error);
            //     return {
            //         ...token,
            //         error: "RefreshAccessTokenError"
            //     }
            // }
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