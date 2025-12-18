"use server";

import { auth, signIn, signOut } from "@/auth";
import { AuthService } from "@/backend/auth/auth.services";
import { LoginResponse, RegisterResponse } from "@/backend/auth/auth.types";
import { ApiResponse } from "@/backend/constants/ApiResponse";
import { ErrorResponse } from "@/backend/errorResponse";
import { LoginInput } from "@/schema/loginSchema";
import { RegisterInput } from "@/schema/registerSchema";
import { VerificationInput } from "@/schema/verificationSchema";
import { cookies } from "next/headers";
import * as setCookieParser from "set-cookie-parser";
import { withAuthError } from "./utils/action.wrapper";

const loginLogic = async (
  params: LoginInput
): Promise<ApiResponse<LoginResponse>> => {
  const response = await AuthService.login(params);

  // Handle Backend API Error
  if (!response.ok) {
    const error = (await response.json()) as ErrorResponse;
    return {
      status: "error",
      timestamp: new Date().toISOString(),
      message: error.detail,
      data: null,
      statusCode: error.status,
    };
  }

  // Success Logic
  const data = (await response.json()) as ApiResponse<LoginResponse>;

  // Set cookies logic
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

  // NextAuth SignIn
  await signIn("credentials", {
    loginResponseJson: JSON.stringify(data.data),
    redirect: false,
  });

  return data;
};

const registerLogic = async (
  params: RegisterInput
): Promise<ApiResponse<RegisterResponse>> => {
  const response = await AuthService.register(params);

  if (!response.ok) {
    const error = (await response.json()) as ErrorResponse;
    return {
      status: "error",
      timestamp: new Date().toISOString(),
      message: error.detail,
      data: null,
      statusCode: error.status,
    };
  }

  return (await response.json()) as ApiResponse<RegisterResponse>;
};

const activateLogic = async ({
  urlToken,
  params,
}: {
  urlToken: string;
  params: VerificationInput;
}): Promise<ApiResponse<void>> => {
  const response = await AuthService.active({ urlToken, ...params });

  if (!response.ok) {
    const error = (await response.json()) as ErrorResponse;
    return {
      status: "error",
      timestamp: new Date().toISOString(),
      message: error.detail,
      data: null,
      statusCode: error.status,
    };
  }

  return (await response.json()) as ApiResponse<void>;
};

const logoutLogic = async () => {
  // remove refresh token at backend
  const session = await auth();

  if (session) {
    const cookieStore = await cookies();
    const response = await AuthService.logout(cookieStore, session);

    // delete cookie helper
    const setCookieHeader = response.headers.getSetCookie();
    if (setCookieHeader && setCookieHeader.length > 0) {
      const parsedCookies = setCookieParser.parse(setCookieHeader);
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

    // Manually delete refresh_token cookie
    cookieStore.delete("refresh_token");
  }

  await signOut({ redirectTo: "/" });
};

export const googleLogin = async () => {
  await signIn("google", { redirectTo: "/" });
};

export const login = withAuthError(loginLogic);

export const register = withAuthError(registerLogic);

export const activate = withAuthError(activateLogic);

export const logout = withAuthError(logoutLogic);
