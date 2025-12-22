import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { LoginResponse } from "./backend/auth/auth.types";
import { cookies } from "next/headers";
import { AuthService } from "./backend/auth/auth.services";
import { ApiResponse } from "./backend/constants/ApiResponse";
import * as setCookieParser from "set-cookie-parser";
import { ErrorResponse } from "./backend/errorResponse";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        loginResponseJson: { label: "Login Response", type: "text" },
      },
      authorize: async (credentials) => {
        if (!credentials?.loginResponseJson) return null;

        try {
          const loginData = JSON.parse(
            credentials.loginResponseJson as string
          ) as LoginResponse;
          return {
            ...loginData,
            ...loginData.user,
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
    Google,
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        switch (account.provider) {
          case "google": {
            const googleIdToken = account.id_token;
            if (!googleIdToken) {
              console.error("❌ No Google ID token received");
              return token;
            }

            console.log("🔵 Google OAuth callback - processing ID token");
            const backendData = await loginWithGoogle(googleIdToken);

            if (backendData) {
              console.log("✅ Backend data received, setting token");
              token.accessToken = backendData.accessToken;
              token.expiresAt = backendData.expiresAt;
              token.user = {
                id: backendData.user.id,
                email: backendData.user.email,
                username: backendData.user.username,
                fullname: backendData.user.fullname,
                avatarUrl: backendData.user.avatarUrl,
                roles: backendData.user.roles,
              };
            }
            break;
          }

          case "credentials": {
            token.accessToken = user.accessToken;
            token.expiresAt = user.expiresAt;
            token.user = {
              id: user.id,
              email: user.email,
              username: user.username,
              fullname: user.fullname,
              avatarUrl: user.avatarUrl,
              roles: user.roles,
            };
            break;
          }

          default:
            break;
        }

        return token;
      }

      // Refresh token before it expires (5 minute buffer to prevent edge cases)
      const REFRESH_BUFFER = 5 * 60 * 1000; // 5 minutes
      const shouldRefresh = Date.now() >= token.expiresAt - REFRESH_BUFFER;

      if (!shouldRefresh) {
        return token; // Token still valid
      }

      // Token expiring soon or expired - refresh it
      return await refreshAccessToken(token);
    },
    session({ session, token }) {
      // If token has error or no user data, return empty session to force logout
      if (token.error || !token.user || !token.accessToken) {
        console.error("❌ Session error - forcing logout:", token.error);
        return {
          ...session,
          user: undefined,
          accessToken: undefined,
          error: token.error || "SessionExpired",
        };
      }
      session.accessToken = token.accessToken;
      session.user = { ...session.user, ...token.user };
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    console.log("🔄 Attempting to refresh access token...");
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    // No refresh token available - user needs to login
    if (!refreshToken) {
      console.error("❌ No refresh token found - user needs to login");
      return {
        ...token,
        error: "NoRefreshToken",
        accessToken: undefined,
        user: undefined,
        expiresAt: 0,
      };
    }

    const response = await AuthService.refresh(cookieStore);

    // Refresh token is invalid/expired - force complete logout
    if (!response.ok) {
      const error = (await response.json()) as ErrorResponse;
      console.error("❌ Refresh token failed:", error.detail);
      console.error(
        ">>> Deleting invalid refresh_token cookie and clearing session"
      );

      // Delete the invalid refresh_token cookie to prevent infinite retry loop
      cookieStore.delete("refresh_token");

      // Clear all session data to force complete logout from NextAuth
      return {
        ...token,
        error: error.detail || "RefreshTokenExpired",
        accessToken: undefined,
        user: undefined,
        expiresAt: 0,
      };
    }

    const data = (await response.json()) as ApiResponse<LoginResponse>;

    // update cookie
    const setCookieHeader = response.headers.getSetCookie();
    if (setCookieHeader && setCookieHeader.length > 0) {
      const parsedCookies = setCookieParser.parse(setCookieHeader);
      const cookieStore = await cookies();

      parsedCookies.forEach((cookie) => {
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

    console.log("✅ Token refreshed successfully");
    return {
      ...token,
      accessToken: data.data!.accessToken,
      expiresAt: data.data!.expiresAt,
      user: data.data!.user,
      error: undefined, // Clear any previous errors
    };
  } catch (error) {
    console.error("❌ Unexpected error refreshing token:", error);

    // Delete refresh_token cookie on any error
    const cookieStore = await cookies();
    cookieStore.delete("refresh_token");

    // Clear session data to force logout
    return {
      ...token,
      error: "RefreshAccessTokenError",
      accessToken: undefined,
      user: undefined,
      expiresAt: 0,
    };
  }
}

async function loginWithGoogle(idToken: string): Promise<LoginResponse | null> {
  try {
    console.log("🔵 Starting Google login with backend...");
    const res = await AuthService.loginGoogle(idToken);

    if (!res.ok) {
      const error = (await res.json()) as ErrorResponse;
      console.error("❌ Google login backend error:", error);
      return null;
    }

    const data = (await res.json()) as ApiResponse<LoginResponse>;
    console.log("✅ Google login successful, received data from backend");

    // Get Set-Cookie headers from backend response
    const setCookieHeader = res.headers.getSetCookie();
    console.log(
      "🍪 Set-Cookie headers received:",
      setCookieHeader?.length || 0
    );

    if (setCookieHeader && setCookieHeader.length > 0) {
      const parsedCookies = setCookieParser.parse(setCookieHeader);
      console.log(
        "🍪 Parsed cookies:",
        parsedCookies.map((c) => c.name)
      );

      try {
        const cookieStore = await cookies();

        parsedCookies.forEach((cookie) => {
          console.log(`🍪 Setting cookie: ${cookie.name}`, {
            httpOnly: cookie.httpOnly,
            secure: cookie.secure,
            sameSite: cookie.sameSite,
            maxAge: cookie.maxAge,
          });

          try {
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
          } catch (setCookieError) {
            console.error(
              `❌ Failed to set cookie ${cookie.name}:`,
              setCookieError
            );
          }
        });

        console.log("✅ All cookies set successfully");
      } catch (cookieStoreError) {
        console.error("❌ Failed to access cookie store:", cookieStoreError);
        console.error(
          "⚠️ This might be due to Next.js context limitation during OAuth callback"
        );
        console.error("💡 Cookies from backend might not be set properly");
      }
    } else {
      console.warn("⚠️ No Set-Cookie headers received from backend!");
    }

    return data.data || null;
  } catch (error) {
    console.error("❌ Error during Google Login:", error);
    return null;
  }
}
