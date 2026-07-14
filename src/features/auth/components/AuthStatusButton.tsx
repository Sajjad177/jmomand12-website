"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogIn, LogOut, User } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "../utils/name";

export default function AuthStatusButton() {
  const { data: session, status } = useSession();
  const router = useRouter();
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-[6px] bg-white text-[#111827] transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fe6819]"
          aria-label="Open profile menu"
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
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-72 rounded-xl border-[#dce6f5] p-2"
      >
        <DropdownMenuLabel className="p-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-[#f8fbff]"
          >
            <Avatar className="h-10 w-10">
              {user.image ? (
                <AvatarImage src={user.image} alt={user.name || "Profile"} />
              ) : null}
              <AvatarFallback className="bg-[#fe6819] text-xs font-semibold text-white">
                {getInitials(user.name, user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#111827]">
                {user.name || "Profile"}
              </p>
              <p className="truncate text-xs font-normal text-[#6b7280]">{user.email}</p>
            </div>
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="rounded-lg px-2 py-2">
          <Link href="/dashboard">
            <LayoutDashboard className="h-4 w-4" />
            Open dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="rounded-lg px-2 py-2 text-red-600 focus:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
