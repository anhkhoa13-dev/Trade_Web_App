import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { AuthService } from "@/services/authService";
export const authOptions: NextAuthOptions = {
  debug: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        accessToken: { label: "Access Token", type: "text" },
        user: { label: "User", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.accessToken || !credentials.user) return null;

        // Parse user object back from JSON
        const user = JSON.parse(credentials.user);

        return {
          accessToken: credentials.accessToken,
          ...user,
        };
      },
    }),
  ],

  callbacks: {
    // Requests to /api/auth/signin, /api/auth/session
    // and calls to getSession(), getServerSession(),
    // useSession() will invoke this function
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.user = {
          id: user.id,
          email: user.email!,
          username: user.username,
          fullname: user.fullname,
          avatarUrl: user.avatarUrl,
          roles: user.roles,
        };
      }
      // call the update() function from getSession() to trigger this
      if (trigger === "update" && session) {
        // session here contains the payload passed to update()
        if (session.accessToken) {
          token.accessToken = session.accessToken;
        }
        if (session.user) {
          token.user = session.user;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
};
