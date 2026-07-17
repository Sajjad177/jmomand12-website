"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { FormEvent, useState } from "react";
import AuthPageShell from "@/features/auth/components/AuthPageShell";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function SignUpPage() {
  const { error, loading, signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError("");

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    await signup({ name, email, password, remember });
  };

  return (
    <AuthPageShell
      title="Sign up"
      subtitle="Please enter your details to create an account"
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#FF6B35] hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-600">
            Name
          </label>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="h-14 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-[#0057FF]"
          />
        </div>

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

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-600">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
              className="h-14 w-full rounded-xl border border-gray-200 px-4 pr-12 outline-none transition focus:border-[#0057FF]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-600">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={6}
              required
              className="h-14 w-full rounded-xl border border-gray-200 px-4 pr-12 outline-none transition focus:border-[#0057FF]"
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword((visible) => !visible)
              }
              aria-label={
                showConfirmPassword ? "Hide confirm password" : "Show confirm password"
              }
              aria-pressed={showConfirmPassword}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-500">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            className="h-4 w-4 rounded"
          />
          Remember me
        </label>

        {passwordError || error ? (
          <p className="text-sm text-red-500">{passwordError || error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="btn-gradient h-14 w-full rounded-xl font-medium text-white transition hover:opacity-90"
        >
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </form>
    </AuthPageShell>
  );
}
