// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { refreshAccessToken } from "@/features/auth/api/refresh-token.api";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const getRefreshTokenFromCookie = (setCookie: string | null) => {
  if (!setCookie) return "";

  const match = setCookie.match(/refreshToken=([^;]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : "";
};

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const res = await fetch(`${baseUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Login failed");
          }

          const user = data.data?.user;
          const accessToken = data.data?.accessToken;
          const refreshToken = getRefreshTokenFromCookie(
            res.headers.get("set-cookie"),
          );

          if (!user || !accessToken) {
            throw new Error("Invalid response from server");
          }

          return {
            id: user._id || user.id,
            name:
              user.name ||
              [user.firstName, user.lastName].filter(Boolean).join(" "),
            email: user.email,
            image: user.image?.url || user.profileImage || "",
            role: user.role,
            token: accessToken,
            refreshToken,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          accessToken: user.token,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + 60 * 60 * 1000, // Default 1 hour expiry
        };
      }

      // Update session trigger
      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to update it
      try {
        const refreshedTokens = await refreshAccessToken(token.refreshToken);

        if (!refreshedTokens.success) {
          throw refreshedTokens;
        }

        return {
          ...token,
          accessToken: refreshedTokens.data.accessToken,
          accessTokenExpires: Date.now() + 60 * 60 * 1000, // Update expiration
          refreshToken: token.refreshToken,
        };
      } catch (error) {
        console.error("Error refreshing access token", error);
        return {
          ...token,
          error: "RefreshAccessTokenError",
        };
      }
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          name: token.name,
          email: token.email,
          image: token.image,
          role: token.role,
        };
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.error = token.error;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
