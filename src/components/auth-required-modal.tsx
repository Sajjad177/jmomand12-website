"use client";

import Link from "next/link";
import { Lock, LogIn, UserPlus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AuthRequiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthRequiredModal({
  open,
  onOpenChange,
}: AuthRequiredModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-3xl border-0 p-0 shadow-[0_30px_80px_rgba(15,23,42,.18)] sm:max-w-[430px]">
        {/* Top Section */}
        <div className="bg-gradient-to-br from-[#0D3B8E] via-[#1253c5] to-[#1f6fff] px-8 py-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur-md">
            <Lock className="h-10 w-10 text-[#FB670A]" />
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-7">
          <DialogHeader className="space-y-3 text-center">
            <DialogTitle className="text-2xl font-bold text-slate-900">
              Sign in Required
            </DialogTitle>

            <DialogDescription className="text-[15px] leading-6 text-slate-600">
              Please sign in or create an account to access this feature and
              enjoy a personalized shopping experience.
            </DialogDescription>
          </DialogHeader>

          {/* Buttons */}
          <div className="mt-8 flex gap-5">
            <Link
              href="/login"
              onClick={() => onOpenChange(false)}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FB670A] text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FB670A]/80"
            >
              <LogIn className="h-4 w-4" />
              Log In
            </Link>

            <Link
              href="/signup"
              onClick={() => onOpenChange(false)}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-50"
            >
              <UserPlus className="h-4 w-4" />
              Create Account
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-4 border-t border-slate-100 pt-5 text-center">
            <p className="text-xs leading-5 text-slate-500">
              Join thousands of customers already shopping with us.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
