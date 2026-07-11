"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, User } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { getInitials } from "../utils/name";

export default function AuthStatusButton() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = session?.user;

  if (status !== "authenticated" || !user) {
    return (
      <button
        type="button"
        onClick={() => router.push("/login")}
        className="flex cursor-pointer h-11 items-center gap-2 rounded-[6px] bg-white px-4 text-[13px] font-medium text-[#111827] transition hover:bg-gray-100"
      >
        <LogIn className="h-4 w-4" />
        Login
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsMenuOpen((current) => !current)}
        className="flex h-11 w-11 items-center justify-center rounded-[6px] bg-white text-[#111827] transition hover:bg-gray-100"
        aria-label="Open profile menu"
        aria-expanded={isMenuOpen}
      >
        <Avatar className="h-8 w-8">
          {user.image ? (
            <AvatarImage src={user.image} alt={user.name || "Profile"} />
          ) : null}
          <AvatarFallback className="bg-[#fe6819] text-xs font-semibold text-white">
            {getInitials(user.name, user.email) || <User className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
      </button>

      {isMenuOpen ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 overflow-hidden rounded-md border border-gray-200 bg-white py-1 text-[#111827] shadow-lg">
          <div className="px-3 py-2">
            <span className="block truncate text-sm font-medium">
              {user.name || "Profile"}
            </span>
            <span className="block truncate text-xs text-gray-500">
            {user.email}
            </span>
          </div>
          <div className="my-1 h-px bg-gray-100" />
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}
