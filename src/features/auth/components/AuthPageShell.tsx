"use client";

import Image from "next/image";
import type { ReactNode } from "react";

type AuthPageShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthPageShell({
  title,
  subtitle,
  children,
  footer,
}: AuthPageShellProps) {
  return (
    <div className="grid h-screen overflow-hidden md:grid-cols-2">
      <div className="relative hidden h-full md:block">
        <Image
          src="/login.png"
          alt="Auth Banner"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="flex h-full items-center justify-center overflow-y-auto px-6 py-10 lg:px-16">
        <div className="w-full max-w-[420px]">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
            <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
          </div>

          {children}

          {footer ? (
            <div className="mt-8 text-center text-sm text-gray-500">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
