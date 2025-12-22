"use client";

import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

/**
 * SessionErrorHandler component monitors the NextAuth session for errors.
 * When the refresh token fails (expired/invalid), this component detects
 * the error and forces a complete logout by calling signOut().
 *
 * This ensures that if the backend refresh_token is invalid:
 * 1. The refresh_token cookie is deleted (done in auth.ts)
 * 2. The NextAuth session is cleared (done here)
 * 3. User is redirected to login page
 */
export function SessionErrorHandler() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Check if session has an error (e.g., RefreshTokenExpired, NoRefreshToken)
    if (session?.error) {
      console.error("🔴 Session error detected:", session.error);
      console.log(">>> Forcing logout and redirecting to login...");

      // Force complete logout - this will:
      // 1. Delete the authjs.session-token cookie
      // 2. Clear NextAuth session data
      // 3. Redirect to login page
      signOut({
        callbackUrl: "/login",
        redirect: true,
      });
    }
  }, [session]);

  // Check if user data is missing even without explicit error
  useEffect(() => {
    if (
      status === "authenticated" &&
      (!session?.user || !session?.accessToken)
    ) {
      console.error("🔴 Session is authenticated but missing user/accessToken");
      console.log(">>> Forcing logout...");

      signOut({
        callbackUrl: "/login",
        redirect: true,
      });
    }
  }, [status, session]);

  return null; // This component renders nothing
}
