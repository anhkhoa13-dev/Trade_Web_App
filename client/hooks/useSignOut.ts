"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import useAxiosAuth from "./useAxiosAuth";

export function useSignOut() {
  const queryClient = useQueryClient();
  const api = useAxiosAuth();

  return useMutation({
    mutationFn: async () => {
      // 1. Call backend logout to clear refresh token + cookie
      await api.post("auth/logout");
    },
    onSuccess: async () => {
      // 2. Clear React Query cache so stale user data disappears
      queryClient.clear();

      // 3. Trigger NextAuth signOut to clear session + redirect
      await signOut({
        callbackUrl: "/",
      });
      toast.success("You have been logged out.");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      toast.error("Failed to log out. Please try again.");
    },
  });
}
