"use client";

import { AuthService } from "@/services/authService";
import { signIn, useSession } from "next-auth/react";

export const useRefreshToken = () => {
  const { update } = useSession();

  const refreshToken = async () => {
    try {
      const res = await AuthService.refresh();
      if (res?.data?.accessToken) {
        await update({
          accessToken: res.data.accessToken,
          user: res.data.user,
        });
      } else {
        console.warn("No access token received, forcing sign-in");
        signIn();
      }
    } catch (err) {
      console.error("Refresh token failed:", err);
      signIn();
    }
  };
  return refreshToken;
};
