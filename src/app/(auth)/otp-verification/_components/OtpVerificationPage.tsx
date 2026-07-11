"use client";

import { FormEvent, useState } from "react";
import AuthPageShell from "@/features/auth/components/AuthPageShell";
import OtpCodeInput from "@/features/auth/components/OtpCodeInput";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { AuthFlow } from "@/features/auth/types";

export default function OtpVerificationPage() {
  const { error, loading, verifyOtp } = useAuth();
  const [otp, setOtp] = useState("");

  const getOtpFlow = (): AuthFlow => {
    if (typeof window === "undefined") return "forgot";

    return new URLSearchParams(window.location.search).get("type") === "signup"
      ? "signup"
      : "forgot";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await verifyOtp(otp, getOtpFlow());
  };

  return (
    <AuthPageShell
      title="OTP Verification"
      subtitle="Please enter the code sent to your email"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-600">
            Enter Code
          </label>
          <OtpCodeInput
            value={otp}
            onChange={setOtp}
            disabled={loading}
          />
        </div>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="btn-gradient h-14 w-full rounded-xl font-medium text-white transition hover:opacity-90"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </AuthPageShell>
  );
}
