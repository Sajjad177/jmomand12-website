import Image from "next/image";

import { AuctionPrimaryButton, AuctionOutlineButton } from "./auction-buttons";
import type { AuctionProduct } from "../types";
import { cn } from "@/lib/utils";

const badgeStyles = {
  live: "bg-[#00c950] text-white",
  ending: "bg-[#fff3eb] text-[#ff7a18] border border-[#ffd3ba]",
  upcoming: "bg-[#0b57d0] text-white",
};

type Props = {
  product: AuctionProduct;
  actionLabel?: string;
  outlineAction?: boolean;
  className?: string;
};

export function AuctionProductCard({
  product,
  actionLabel = "Place Bid",
  outlineAction = false,
  className,
}: Props) {
  return (
    <article
      className={cn(
        "auction-card overflow-hidden rounded-[8px] bg-white",
        className,
      )}
    >
      <div className="relative h-[220px] bg-[#f4f6fa]">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover"
        />
        {product.badge ? (
          <div
            className={cn(
              "absolute left-2 top-2 rounded-[4px] px-2 py-1 text-[9px] font-black uppercase tracking-[0.08em]",
              badgeStyles[product.badge.tone],
            )}
          >
            {product.badge.label}
          </div>
        ) : null}
      </div>
      <div className="space-y-3 p-3">
        <div className="space-y-1">
          <h3 className="truncate text-[18px] font-semibold text-[#111827]">
            {product.title}
          </h3>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#6b7280]">
            {product.category} • {product.bids} bids
          </p>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-[10px] text-[#6b7280]">Current Bid</div>
            <div className="text-[15px] font-black text-[#111827]">
              {product.currentBid}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-[#6b7280]">Time Left</div>
            <div className="text-[13px] font-black text-[#fe6819]">
              {product.timeLeft}
            </div>
          </div>
        </div>
        {outlineAction ? (
          <AuctionOutlineButton className="h-8 w-full text-[11px]">
            {actionLabel}
          </AuctionOutlineButton>
        ) : (
          <AuctionPrimaryButton className="h-8 w-full text-[11px]">
            {actionLabel}
          </AuctionPrimaryButton>
        )}
      </div>
    </article>
  );
}
