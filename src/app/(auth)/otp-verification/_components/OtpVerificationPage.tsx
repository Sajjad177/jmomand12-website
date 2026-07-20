"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import AuthPageShell from "@/features/auth/components/AuthPageShell";
import OtpCodeInput from "@/features/auth/components/OtpCodeInput";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { AuthFlow } from "@/features/auth/types";

export default function OtpVerificationPage() {
  const { error, loading, verifyOtp, resendOtp } = useAuth();
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

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
        <button
          type="button"
          disabled={loading || cooldown > 0}
          onClick={async () => {
            const result = await resendOtp(getOtpFlow());
            if (result.ok) {
              toast.success(result.message || "A new code has been sent.");
              setCooldown(60);
            }
          }}
          className="w-full text-sm font-medium text-orange-600 disabled:text-gray-400"
        >
          {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
        </button>
      </form>
    </AuthPageShell>
  );
}
