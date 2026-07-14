"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Facebook, Instagram, Loader2, Twitter } from "lucide-react";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/features/search/api/search.api";
import { AuctionPrimaryButton } from "./auction-buttons";
import { quickLinks, supportLinks } from "../data";
import { SiteBrand } from "./site-brand";

function getErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message ===
      "string"
  ) {
    return (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function SiteFooter() {
  const [email, setEmail] = useState("");

  const subscribeMutation = useMutation({
    mutationFn: subscribeToNewsletter,
    onSuccess: (result) => {
      toast.success(
        result.alreadySubscribed
          ? "You are already subscribed to the newsletter."
          : "Newsletter subscription successful.",
      );
      setEmail("");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "We couldn't subscribe you right now."));
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    subscribeMutation.mutate(trimmedEmail);
  }

  return (
    <footer className="bg-[#08255a] text-white">
      <div className="container py-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.6fr_0.6fr_1fr]">
          <div>
            <SiteBrand />
            <p className="mt-8 max-w-[360px] text-[14px] leading-7 text-[#7e8fb4]">
              Premium liquidation destination for smart buyers. Access exclusive
              overstock and returned inventory at unbeatable prices through our
              secure auction platform.
            </p>
            <div className="mt-8 flex gap-3">
              {[Facebook, Twitter, Instagram].map((Icon, index) => (
                <button
                  key={index}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[#dce6f5]"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[14px] font-bold">Quick Links</h3>
            <div className="mt-8 space-y-3">
              {quickLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block text-[12px] text-[#7e8fb4]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[14px] font-bold">Support</h3>
            <div className="mt-8 space-y-3">
              {supportLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block text-[12px] text-[#7e8fb4]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[14px] font-bold">Newsletter</h3>
            <p className="mt-8 text-[12px] text-[#7e8fb4]">
              Get weekly alerts on the hottest premium lots.
            </p>
            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-[6px] border border-[#6e82ab] bg-transparent px-4 py-3 text-[12px] text-white outline-none placeholder:text-[#dce6f5]"
                placeholder="Your email address"
                type="email"
                autoComplete="email"
              />
              <AuctionPrimaryButton
                type="submit"
                className="h-9 px-5 text-[12px]"
                disabled={subscribeMutation.isPending}
              >
                {subscribeMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
              </AuctionPrimaryButton>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-[10px] uppercase tracking-[0.16em] text-[#dce6f5] md:flex-row md:items-center md:justify-between">
          <p className="tracking-normal text-white/75">
            © 2026{" "}
            <span className="font-bold text-[#ff6900]">Discount Deals</span>.
            All rights reserved.
          </p>
          <div className="flex gap-6">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
