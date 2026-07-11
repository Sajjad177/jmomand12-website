/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { EyeOff } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import AuthPageShell from "@/features/auth/components/AuthPageShell";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getRememberedCredentials } from "@/features/auth/utils/auth-storage";

export default function SignInPage() {
  const { error, loading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    const credentials = getRememberedCredentials();

    if (credentials) {
      setEmail(credentials.email);
      setPassword(credentials.password);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await login(email, password, remember);
  };

  return (
    <AuthPageShell
      title="Sign in"
      subtitle="Please enter your email and password to continue"
      footer={
        <>
          Haven&apos;t an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#FF6B35] hover:underline"
          >
            Sign up
          </Link>
        </>
      }
    >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                E-mail
              </label>

              <input
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="h-14 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-[#0057FF]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Password
              </label>

              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="h-14 w-full rounded-xl border border-gray-200 px-4 pr-12 outline-none transition focus:border-[#0057FF]"
                />

                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <EyeOff size={20} />
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-500">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="h-4 w-4 rounded"
                />
                Remember me
              </label>

              <Link
                href="/forgot-password"
                className="text-gray-500 transition hover:text-[#0057FF]"
              >
                Forgot Password?
              </Link>
            </div>

            {error ? <p className="text-sm text-red-500">{error}</p> : null}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-gradient h-14 w-full rounded-xl font-medium text-white transition hover:opacity-90"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
    </AuthPageShell>
  );
}
