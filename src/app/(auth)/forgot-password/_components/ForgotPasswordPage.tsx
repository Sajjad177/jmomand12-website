"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import AuthPageShell from "@/features/auth/components/AuthPageShell";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function ForgotPasswordPage() {
  const { error, loading, forgotPassword } = useAuth();
  const [email, setEmail] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await forgotPassword(email);
  };

  return (
    <AuthPageShell
      title="Forgot Password"
      subtitle="Please enter your email to receive a code"
      footer={
        <Link
          href="/login"
          className="font-semibold text-[#FF6B35] hover:underline"
        >
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
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

        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="btn-gradient h-14 w-full rounded-xl font-medium text-white transition hover:opacity-90"
        >
          {loading ? "Sending..." : "Submit"}
        </button>
      </form>
    </AuthPageShell>
  );
}
