"use client";
import { getSession, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRefreshToken } from "./useRefreshToken";
import { authApi } from "@/lib/api";

const useAxiosAuth = () => {
  const { data: session } = useSession();
  const refreshToken = useRefreshToken();

  useEffect(() => {
    const requestIntercept = authApi.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${session?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseIntercept = authApi.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;

          await refreshToken(); // triggers session update
          const newSession = await getSession(); // fetch updated session
          prevRequest.headers["Authorization"] =
            `Bearer ${newSession?.accessToken}`;

          return authApi(prevRequest);
        }
        return Promise.reject(error);
      },
    );

    return () => {
      authApi.interceptors.request.eject(requestIntercept);
      authApi.interceptors.response.eject(responseIntercept);
    };
  }, [session, refreshToken]);

  return authApi;
};

export default useAxiosAuth;
