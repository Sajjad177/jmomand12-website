"use client";

import { useCallback, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type {
  AuthFlow,
  AuthResult,
  ResetPasswordPayload,
  SignUpPayload,
} from "../types";
import { getAuthErrorMessage } from "../utils/auth-error";
import {
  PASSWORD_RESET_TOKEN_KEY,
  SIGNUP_ACCESS_TOKEN_KEY,
  readStorage,
  removeStorage,
  saveRememberedCredentials,
  writeStorage,
} from "../utils/auth-storage";
import { splitFullName } from "../utils/name";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = useCallback(
    async (email: string, password: string, remember: boolean) => {
      setLoading(true);
      setError("");

      const callbackUrl =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("callbackUrl") || "/"
          : "/";
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      setLoading(false);

      if (result?.error) {
        setError(result.error);
        return { ok: false, message: result.error };
      }

      saveRememberedCredentials(email, password, remember);
      router.push(callbackUrl);
      router.refresh();

      return { ok: true };
    },
    [router],
  );

  const signup = useCallback(
    async ({ name, email, password, remember }: SignUpPayload) => {
      setLoading(true);
      setError("");

      try {
        const { firstName, lastName } = splitFullName(name);
        const response = await api.post("/users/register", {
          firstName,
          lastName,
          email,
          password,
        });

        const accessToken = response.data?.data?.accessToken;
        if (accessToken) {
          writeStorage(SIGNUP_ACCESS_TOKEN_KEY, accessToken);
        }

        saveRememberedCredentials(email, password, remember);
        router.push("/otp-verification?type=signup");

        return { ok: true, message: response.data?.message } satisfies AuthResult;
      } catch (err) {
        const message = getAuthErrorMessage(err, "Signup failed");
        setError(message);
        return { ok: false, message };
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  const forgotPassword = useCallback(
    async (email: string) => {
      setLoading(true);
      setError("");

      try {
        const response = await api.post("/auth/forgot-password", { email });
        const accessToken = response.data?.data?.accessToken;

        if (accessToken) {
          writeStorage(PASSWORD_RESET_TOKEN_KEY, accessToken);
        }

        router.push("/otp-verification?type=forgot");

        return { ok: true, message: response.data?.message } satisfies AuthResult;
      } catch (err) {
        const message = getAuthErrorMessage(err, "Could not send OTP");
        setError(message);
        return { ok: false, message };
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  const verifyOtp = useCallback(
    async (otp: string, type: AuthFlow) => {
      setLoading(true);
      setError("");

      try {
        const tokenKey =
          type === "signup" ? SIGNUP_ACCESS_TOKEN_KEY : PASSWORD_RESET_TOKEN_KEY;
        const token = readStorage(tokenKey);
        const url =
          type === "signup"
            ? "/users/email-verifications"
            : "/auth/verify-otp";

        const response = await api.post(
          url,
          { otp },
          token
            ? {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            : undefined,
        );

        const accessToken = response.data?.data?.accessToken;
        if (type === "forgot" && accessToken) {
          writeStorage(PASSWORD_RESET_TOKEN_KEY, accessToken);
        }

        if (type === "signup") {
          removeStorage(SIGNUP_ACCESS_TOKEN_KEY);
          router.push("/login");
        } else {
          router.push("/change-password");
        }

        return { ok: true, message: response.data?.message } satisfies AuthResult;
      } catch (err) {
        const message = getAuthErrorMessage(err, "OTP verification failed");
        setError(message);
        return { ok: false, message };
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  const resetPassword = useCallback(
    async ({ newPassword, confirmPassword }: ResetPasswordPayload) => {
      if (newPassword !== confirmPassword) {
        const message = "Passwords do not match";
        setError(message);
        return { ok: false, message };
      }

      setLoading(true);
      setError("");

      try {
        const token = readStorage(PASSWORD_RESET_TOKEN_KEY);
        const response = await api.post(
          "/auth/reset-password",
          { newPassword },
          token
            ? {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            : undefined,
        );

        removeStorage(PASSWORD_RESET_TOKEN_KEY);
        router.push("/login");

        return { ok: true, message: response.data?.message } satisfies AuthResult;
      } catch (err) {
        const message = getAuthErrorMessage(err, "Password change failed");
        setError(message);
        return { ok: false, message };
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  return {
    error,
    loading,
    login,
    signup,
    forgotPassword,
    verifyOtp,
    resetPassword,
  };
}
