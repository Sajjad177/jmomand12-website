import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

import { AuctionPrimaryButton } from "./auction-buttons";
import { quickLinks, supportLinks } from "../data";
import { SiteBrand } from "./site-brand";

export function SiteFooter() {
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
            <div className="mt-5 space-y-3">
              <input
                className="w-full rounded-[6px] border border-[#6e82ab] bg-transparent px-4 py-3 text-[12px] text-white outline-none placeholder:text-[#dce6f5]"
                placeholder="Your email address"
              />
              <AuctionPrimaryButton className="h-9 px-5 text-[12px]">
                Subscribe
              </AuctionPrimaryButton>
            </div>
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
