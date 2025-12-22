import { handlers } from "@/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Wrap the POST handler to intercept and set cookies from backend
async function POST_with_cookies(req: NextRequest) {
  const response = await handlers.POST(req);

  // If this is a callback from Google OAuth, the cookies should already be set
  // by the loginWithGoogle function in auth.ts

  return response;
}

export const { GET } = handlers;
export { POST_with_cookies as POST };
