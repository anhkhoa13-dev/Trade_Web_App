import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  // Extend the built-in session type
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      email: string;
      username: string;
      fullname: string;
      avatarUrl?: string | null;
      roles: string[];
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    accessToken: string;
    id: string;
    username: string;
    fullname: string;
    avatarUrl?: string | null;
    roles: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    user?: {
      id: string;
      email: string;
      username: string;
      fullname: string;
      avatarUrl?: string | null;
      roles: string[];
    };
  }
}
