import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Lock,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { AuctionOutlineButton, AuctionPrimaryButton } from "./auction-buttons";
import { AuctionProductCard } from "./auction-product-card";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { liveBids, similarAuctions } from "../data";

const productGallery = [
  "/images/login.jpg",
  "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg",
  "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d (1).jpg",
  "/images/login.jpg",
  "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg",
  "/images/login.jpg",
];

const specs = [
  ["Dimensions", `70" H x 35.75" W x 34.25" D`],
  ["Capacity", "28 Cubic Feet"],
  ["Ice Maker", "Dual Ice Maker (Cubed & Ice Bites)"],
];

export function ProductDetailsPage() {
  return (
    <main className="bg-[#f7f9fc]">

      <section className="container py-10">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,974px)_360px]">
          <div className="space-y-4">
            <div className="auction-card rounded-[8px] bg-white p-6">
              <div className="relative h-[520px] overflow-hidden rounded-[4px] bg-white">
                <Image
                  src="/images/login.jpg"
                  alt="Samsung refrigerator"
                  fill
                  className="object-contain"
                />
                <div className="absolute bottom-4 right-4 rounded-[8px] bg-[#eef4ff] px-4 py-2 text-[12px] text-[#111827]">
                  1/6
                </div>
              </div>
              <div className="mt-4 grid grid-cols-6 gap-3">
                {productGallery.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className={`relative h-[56px] overflow-hidden rounded-[8px] border p-2 ${
                      index === 0
                        ? "border-2 border-[#003da5]"
                        : "border-[#dce6f5] opacity-70"
                    }`}
                  >
                    <Image src={image} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div className="auction-card rounded-[8px] bg-white p-5">
              <div className="inline-flex rounded-[4px] bg-[#eef4ff] px-3 py-1 text-[11px] font-black uppercase text-[#003da5]">
                LOT #8472-A
              </div>
              <h1 className="mt-4 max-w-[780px] text-[28px] font-bold leading-[1.2] text-[#1e293b] lg:text-[36px]">
                Samsung 28 cu. ft. 4-Door French Door Refrigerator with AutoFill
                Water Pitcher
              </h1>

              <div className="mt-5 grid gap-4 border-b border-[#dce6f5] pb-5 md:grid-cols-3">
                <div className="text-center md:border-r md:border-[#dce6f5]">
                  <div className="text-[11px] text-[#6b7280]">Retail Price</div>
                  <div className="mt-1 text-[13px] font-medium text-[#6b7280] line-through">
                    $2,899.00
                  </div>
                </div>
                <div className="text-center md:border-r md:border-[#dce6f5]">
                  <div className="text-[11px] text-[#6b7280]">Category</div>
                  <div className="mt-1 text-[13px] font-medium text-[#374151]">
                    Major Appliances
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[11px] text-[#6b7280]">Condition</div>
                  <div className="mt-1 text-[13px] font-medium text-[#ff6b1a]">
                    Open Box - Like New
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h2 className="text-[14px] font-bold text-[#111827]">
                  Product Description
                </h2>
                <p className="mt-2 max-w-[850px] text-[13px] leading-6 text-[#6b7280]">
                  This open-box Samsung refrigerator features a sleek, modern
                  look with a built-in AutoFill Water Pitcher. It has been fully
                  inspected and tested by our certified warehouse team. There is
                  a minor cosmetic scratch on the right side panel not visible
                  when installed between cabinets. Includes all original
                  interior shelving, bins, and hardware.
                </p>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-[8px] bg-[#eef4ff] px-4 py-4">
                  <div className="text-[12px] text-[#6b7280]">Source</div>
                  <div className="mt-1 text-[14px] font-bold text-[#003da5]">
                    Major Retailer Overstock
                  </div>
                </div>
                <div className="rounded-[8px] bg-[#eef4ff] px-4 py-4">
                  <div className="text-[12px] text-[#6b7280]">
                    Pickup Information
                  </div>
                  <div className="mt-1 text-[14px] font-bold text-[#003da5]">
                    Local Pickup Only (No Shipping)
                  </div>
                </div>
              </div>
            </div>

            <div className="auction-card overflow-hidden rounded-[8px] bg-white">
              <div className="border-b border-[#dce6f5] px-5 py-3 text-[12px] font-bold text-[#003da5]">
                Description
              </div>
              <div className="px-5 py-6">
                <h2 className="text-[22px] font-bold text-[#111827]">
                  Detailed Specifications
                </h2>
                <div className="mt-4 space-y-4 text-[13px] leading-6 text-[#6b7280]">
                  <p>
                    Upgrade your kitchen with this premium 28 cu. ft. 4-Door
                    French Door Refrigerator. Featuring a sleek design, it
                    seamlessly blends into any contemporary kitchen aesthetic
                    while offering massive storage capacity.
                  </p>
                  <p>
                    AutoFill Water Pitcher: A built-in pitcher that
                    automatically refills filtered water.
                  </p>
                  <p>
                    FlexZone Drawer: A flexible storage drawer with four
                    different temperature settings.
                  </p>
                  <p>
                    Twin Cooling Plus: Independent fridge and freezer controls
                    keep food fresher longer.
                  </p>
                  <p>
                    Fingerprint Resistant Finish: Withstands everyday smudges,
                    so you spend less time cleaning.
                  </p>
                  <p>
                    AutoFill Water Pitcher: A built-in pitcher that
                    automatically refills with filtered water.
                  </p>
                </div>
                <div className="mt-6 overflow-hidden rounded-[4px] border border-[#e5edf8]">
                  {specs.map(([label, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-[1fr_1fr] border-b border-[#e5edf8] text-[12px] last:border-b-0"
                    >
                      <div className="bg-[#f8fbff] px-4 py-3 text-[#6b7280]">
                        {label}
                      </div>
                      <div className="px-4 py-3 text-[#6b7280]">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="auction-card overflow-hidden rounded-[8px] bg-white">
              <div className="border-b border-[#dce6f5] bg-[#eef4ff] px-4 py-3">
                <span className="text-[12px] font-bold text-[#0b57d0]">
                  • Live Auction
                </span>
              </div>
              <div className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[12px] text-[#6b7280]">
                      Current Bid
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="text-[46px] font-black leading-none text-[#111827]">
                        $850.00
                      </div>
                      <div className="pb-1 text-[12px] text-[#6b7280]">USD</div>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-[12px]">
                      <span className="text-[#6b7280]">Retail: $2,899.00</span>
                      <span className="rounded bg-[#d7f6e6] px-2 py-0.5 text-[#00a63f]">
                        Save 70%
                      </span>
                    </div>
                  </div>
                  <AuctionOutlineButton className="h-10 px-4 text-[12px]">
                    <Heart className="h-4 w-4" />
                    Add to Watchlist
                  </AuctionOutlineButton>
                </div>

                <div className="rounded-[8px] bg-[#eef4ff] p-4">
                  <div className="text-center text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b7280]">
                    Auction Ends In
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {[
                      ["00", "Days"],
                      ["04", "Hours"],
                      ["32", "Mins"],
                      ["15", "Secs"],
                    ].map(([value, label]) => (
                      <div
                        key={label}
                        className="rounded-[6px] bg-white px-3 py-3 text-center"
                      >
                        <div className="text-[22px] font-bold text-[#111827]">
                          {value}
                        </div>
                        <div className="mt-1 text-[10px] font-bold uppercase text-[#6b7280]">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[8px] border border-[#f7d288] bg-[#fff9e9] px-4 py-3 text-[12px] text-[#b66500]">
                  Card verification required before bidding. A temporary $1 hold
                  will be placed to verify your account.
                </div>

                <AuctionPrimaryButton className="h-11 w-full text-[13px]">
                  Quick Bid: $875.00
                </AuctionPrimaryButton>

                <div className="flex gap-2">
                  <div className="flex h-11 flex-1 items-center rounded-[4px] border border-[#dce6f5] bg-white px-3 text-[13px] text-[#6b7280]">
                    $ Enter max bid
                  </div>
                  <AuctionOutlineButton className="h-11 px-4 text-[12px]">
                    Set Max Bid
                  </AuctionOutlineButton>
                </div>

                <div className="flex items-center justify-center gap-8 pt-2 text-center text-[10px] font-bold uppercase text-[#111827]">
                  <div>
                    <Lock className="mx-auto mb-1 h-4 w-4 text-[#111827]" />
                    Secure
                  </div>
                  <div>
                    <ShieldCheck className="mx-auto mb-1 h-4 w-4 text-[#0b57d0]" />
                    Verified
                  </div>
                  <div>
                    <Truck className="mx-auto mb-1 h-4 w-4 text-[#fe6819]" />
                    Guaranteed
                  </div>
                </div>
              </div>
            </div>

            <div className="auction-card overflow-hidden rounded-[8px] bg-white">
              <div className="flex items-center justify-between border-b border-[#dce6f5] bg-[#f8fbff] px-4 py-3">
                <span className="text-[14px] font-bold text-[#111827]">
                  Live Bid Activity
                </span>
                <span className="text-[11px] text-[#6b7280]">24 Bids</span>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {liveBids.map((bid) => (
                    <div
                      key={`${bid.bidder}-${bid.timeAgo}`}
                      className="flex items-center justify-between rounded-[8px] bg-[#f8fbff] px-3 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e2ebfb] text-[10px] font-bold text-[#6b7280]">
                          {bid.bidder.slice(0, 3)}
                        </div>
                        <div>
                          <div className="text-[12px] font-semibold text-[#111827]">
                            {bid.bidder}
                          </div>
                          <div className="text-[10px] text-[#6b7280]">
                            {bid.timeAgo}
                          </div>
                        </div>
                      </div>
                      <div className="text-[12px] font-bold text-[#0b57d0]">
                        {bid.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[40px] font-bold text-[#1e293b]">
            Similar Auctions Closing Soon
          </h2>
          <div className="flex gap-3">
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dce6f5] text-[#94a3b8]">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dce6f5] text-[#64748b]">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {similarAuctions.map((product) => (
            <AuctionProductCard
              key={product.id}
              product={product}
              actionLabel="Bid Now"
              outlineAction
              className="shadow-none"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
