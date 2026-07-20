"use client";

import Link from "next/link";
import { Lock, ArrowRight, UserPlus } from "lucide-react";

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
      <DialogContent className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-0 shadow-[0_24px_70px_-10px_rgba(15,23,42,0.12)] sm:max-w-[400px]">

        {/* Top Minimal Icon Header */}
        <div className="pt-8 pb-4 flex justify-center">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 ring-4 ring-slate-50/50">
            <Lock className="h-6 w-6 text-slate-700" strokeWidth={2.2} />
          </div>
        </div>

        {/* Body Content */}
        <div className="px-6 pb-8">
          <DialogHeader className="space-y-2 text-center">
            <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
              Authentication Required
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-slate-500">
              Please sign in or create an account to unlock this feature and personalize your shopping experience.
            </DialogDescription>
          </DialogHeader>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              href="/login"
              onClick={() => onOpenChange(false)}
              className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-medium text-white transition-all duration-200 hover:bg-slate-800 active:scale-[0.98]"
            >
              Log In
              <ArrowRight className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/signup"
              onClick={() => onOpenChange(false)}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]"
            >
              <UserPlus className="h-4 w-4 text-slate-500" />
              Create Account
            </Link>
          </div>

          {/* Minimal Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400 font-medium">
              Join thousands of customers shopping with us.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
