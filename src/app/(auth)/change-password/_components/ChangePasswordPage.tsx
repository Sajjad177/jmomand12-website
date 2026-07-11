"use client";

import { EyeOff } from "lucide-react";
import { FormEvent, useState } from "react";
import AuthPageShell from "@/features/auth/components/AuthPageShell";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function ChangePasswordPage() {
  const { error, loading, resetPassword } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await resetPassword({ newPassword, confirmPassword });
  };

  return (
    <AuthPageShell
      title="Change Password"
      subtitle="Please enter and confirm your new password"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-600">
            New Password
          </label>
          <div className="relative">
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              minLength={6}
              required
              className="h-14 w-full rounded-xl border border-gray-200 px-4 pr-12 outline-none transition focus:border-[#0057FF]"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <EyeOff size={20} />
            </span>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-600">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={6}
              required
              className="h-14 w-full rounded-xl border border-gray-200 px-4 pr-12 outline-none transition focus:border-[#0057FF]"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <EyeOff size={20} />
            </span>
          </div>
        </div>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="btn-gradient h-14 w-full rounded-xl font-medium text-white transition hover:opacity-90"
        >
          {loading ? "Changing..." : "Submit"}
        </button>
      </form>
    </AuthPageShell>
  );
}
