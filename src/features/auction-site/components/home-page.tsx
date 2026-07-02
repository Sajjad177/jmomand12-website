import {
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Gavel,
  PackageCheck,
  User,
} from "lucide-react";
import Image from "next/image";

import { AuctionOutlineButton, AuctionPrimaryButton } from "./auction-buttons";
import { AuctionProductCard } from "./auction-product-card";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { homeActiveAuctions } from "../data";

const categoryCircles = [
  { title: "Appliances", image: "/images/login.jpg" },
  {
    title: "Electronics",
    image: "/images/12043465729ab7c8ceffce00749e7c71df0c9e25.jpg",
  },
  { title: "Automotive", image: "/images/car.jpg" },
  {
    title: "Office",
    image: "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg",
  },
  { title: "Kitchen", image: "/images/login.jpg" },
  {
    title: "Furniture",
    image: "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d (1).jpg",
  },
  { title: "Overstock", image: "/images/car.jpg" },
];

export function HomePage() {
  return (
    <main className="bg-[#f7f9fc]">
      <SiteHeader />

      <section className="overflow-hidden bg-[linear-gradient(135deg,#0b3f9c_0%,#06379d_48%,#0a2f8d_100%)] text-white">
        <div className="auction-shell grid gap-10 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-24">
          <div className="max-w-[745px]">
            <p className="text-[14px] uppercase tracking-[0.24em] text-[#dce6f5]">
              Welcome to Discount Deals
            </p>
            <h1 className="mt-4 text-[56px] font-bold leading-[1.06] lg:text-[72px]">
              <span className="block">Bid Smarter.</span>
              <span className="block text-[#fe6819]">Win Bigger.</span>
              <span className="block">Save More.</span>
            </h1>
            <p className="mt-6 max-w-[670px] text-[16px] leading-7 text-[#dce6f5]">
              Discover premium liquidation deals, overstock inventory,
              electronics, furniture, appliances, and exclusive auction
              opportunities from trusted sellers.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <AuctionPrimaryButton className="h-[54px] px-8 text-[16px]">
                Live Auctions
              </AuctionPrimaryButton>
              <AuctionOutlineButton className="h-[54px] bg-transparent px-8 text-[16px] text-[#fe6819] hover:bg-white/10">
                Buy Now
              </AuctionOutlineButton>
            </div>
          </div>

          <div className="relative h-[560px]">
            <div className="absolute right-[14%] top-0 h-[255px] w-[180px] rounded-[16px] bg-[linear-gradient(180deg,#f1f1f1_0%,#949494_100%)] shadow-[0_24px_60px_rgba(0,0,0,0.28)]" />
            <div className="absolute bottom-[95px] left-[6%] h-[165px] w-[300px] rounded-[28px] bg-[#efe6dc] shadow-[0_24px_60px_rgba(0,0,0,0.24)]" />
            <div className="absolute bottom-[97px] left-[20%] h-[165px] w-[190px] rounded-[18px] bg-[linear-gradient(180deg,#eef1f5_0%,#c4ccd6_100%)] shadow-[0_24px_60px_rgba(0,0,0,0.24)]" />
            <div className="absolute bottom-[68px] right-[6%] h-[166px] w-[255px] rounded-[18px] bg-[radial-gradient(circle_at_74%_34%,#5e86ff_0%,transparent_24%),radial-gradient(circle_at_31%_57%,#ff7a18_0%,transparent_27%),linear-gradient(135deg,#071842_0%,#111f57_100%)] shadow-[0_24px_60px_rgba(0,0,0,0.28)]" />
            <div className="absolute bottom-[60px] right-[27%] h-[94px] w-[134px] rounded-[12px] bg-[linear-gradient(180deg,#161a23_0%,#0a0c12_100%)] shadow-[0_20px_45px_rgba(0,0,0,0.28)]" />
            <div className="absolute bottom-[20px] right-[5%] h-[86px] w-[86px] rounded-full border-[10px] border-[#121921] bg-[#020202]" />

            <div className="absolute right-[34%] top-[105px] rounded-[8px] border-2 border-white/20 bg-white/20 px-5 py-4 backdrop-blur-sm">
              <p className="text-[13px] font-bold uppercase tracking-[0.14em]">
                Auction Closing
              </p>
              <div className="mt-2 flex gap-3">
                {[
                  { value: "04", label: "HR" },
                  { value: "22", label: "MIN" },
                  { value: "15", label: "SEC" },
                ].map((item, index) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-[24px] font-bold leading-7">
                        {item.value}
                      </div>
                      <div className="text-[12px] font-bold text-[#dce6f5]">
                        {item.label}
                      </div>
                    </div>
                    {index < 2 ? (
                      <div className="text-[20px] font-bold">:</div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute right-0 top-[70px] rounded-[8px] border-2 border-white/20 bg-white/30 px-6 py-5 backdrop-blur-sm">
              <p className="text-[14px] font-bold uppercase">Jom D. wm</p>
              <p className="mt-2 text-[15px] font-bold">Samsung 55&quot; TV</p>
              <p className="mt-2 text-[15px] font-bold">$180</p>
            </div>

            <div className="absolute bottom-[34px] right-[18px] rounded-[8px] border-2 border-white/20 bg-white/30 px-6 py-5 backdrop-blur-sm">
              <p className="text-[14px] font-bold uppercase">Live Bid</p>
              <p className="mt-2 text-[18px] font-bold">New Bid: $1,240</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="auction-shell text-center">
          <h2 className="text-[36px] font-bold uppercase text-[#111827]">
            Auction Days
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {["Monday", "Tuesday", "Wednesday", "Thursday"].map((day) => (
              <div
                key={day}
                className="flex items-center gap-3 rounded-[8px] border border-black/20 px-5 py-3"
              >
                <CalendarDays className="h-5 w-5 text-[#fe6819]" />
                <span className="text-[14px] font-semibold uppercase tracking-[0.12em] text-[#003da5]">
                  {day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#e5edf8] bg-[#f7f9fc] py-12">
        <div className="auction-shell">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="auction-section-title">Browse Categories</h2>
              <p className="mt-2 text-[16px] text-[#6b7280]">
                Find exactly what you&apos;re looking for by category.
              </p>
            </div>
            <AuctionPrimaryButton className="h-9 px-4 text-[12px]">
              Explore All
              <ChevronRight className="h-4 w-4" />
            </AuctionPrimaryButton>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-7">
            {categoryCircles.map((item) => (
              <div key={item.title} className="text-center">
                <div className="mx-auto flex h-[160px] w-[160px] items-center justify-center rounded-full border-[4px] border-[#0b57d0] bg-white">
                  <div className="relative h-[130px] w-[130px] overflow-hidden rounded-full">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <h3 className="mt-4 text-[18px] font-semibold text-[#111827]">
                  {item.title}
                </h3>
                <p className="mt-1 text-[14px] font-medium text-[#fe6819]">
                  2,850 Items
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0e47bb] py-14 text-white">
        <div className="auction-shell">
          <h2 className="text-[40px] font-bold">Closing Soon</h2>
          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            {[0, 1].map((card) => (
              <div
                key={card}
                className="rounded-[8px] bg-white p-6 text-[#111827] shadow-[0_16px_30px_rgba(13,33,91,0.08)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[22px] font-bold">
                      {card === 0
                        ? "Auction Premium Plus - 11 Closing First"
                        : "Auction 169 Closing Next"}
                    </h3>
                    <p className="mt-3 text-[14px] text-[#6b7280]">
                      Thu, Jun 18 at 6:00 PM ET
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {["09", "05", "05"].map((value, index) => (
                      <div
                        key={`${value}-${index}`}
                        className="flex items-center gap-2"
                      >
                        <div className="rounded-[8px] bg-[#f7f9fc] px-3 py-2 text-center">
                          <div className="text-[16px] font-bold">{value}</div>
                          <div className="text-[10px] font-bold uppercase text-[#6b7280]">
                            {index === 0 ? "H" : index === 1 ? "M" : "S"}
                          </div>
                        </div>
                        {index < 2 ? (
                          <span className="text-[#fe6819]">:</span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6">
                  <div className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#6b7280]">
                    High Value
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2 lg:grid-cols-8">
                    {homeActiveAuctions
                      .concat(homeActiveAuctions)
                      .slice(0, 8)
                      .map((item) => (
                        <div
                          key={`grid-${card}-${item.id}`}
                          className="relative aspect-square overflow-hidden rounded-[6px]"
                        >
                          <Image
                            src={item.image}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                  </div>
                  <p className="mt-4 text-center text-[14px] font-semibold text-[#fe6819]">
                    {card === 0
                      ? "+94 more lots available"
                      : "+48 more lots available"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="auction-shell">
          <div className="flex items-center justify-between">
            <h2 className="auction-section-title">Active Auctions</h2>
            <button className="text-[12px] font-semibold text-[#6b7280]">
              Sort by: Newest
            </button>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {homeActiveAuctions
              .concat(homeActiveAuctions)
              .slice(0, 10)
              .map((product, index) => (
                <AuctionProductCard
                  key={`${product.id}-${index}`}
                  product={product}
                />
              ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0e47bb] py-16 text-white">
        <div className="auction-shell text-center">
          <h2 className="text-[36px] font-bold">How It Works</h2>
          <p className="mt-3 text-[16px] text-[#dce6f5]">
            Join thousands of smart buyers winning premium products in four
            simple steps.
          </p>
          <div className="mt-10 grid gap-10 md:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: User, label: "1. Register Account" },
              { icon: Gavel, label: "2. Place Bid" },
              { icon: CircleDollarSign, label: "3. Win Auction" },
              { icon: PackageCheck, label: "4. Pay & Pickup" },
            ].map(({ icon: StepIcon, label }) => {
              return (
                <div key={label}>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#fe6819]">
                    <StepIcon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-[18px] font-bold">{label}</h3>
                  <p className="mt-3 text-[14px] leading-6 text-[#dce6f5]">
                    Browse inventory, bid confidently, and win premium deals
                    with transparent listings and secure checkout.
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 lg:px-10">
        <div className="auction-shell rounded-[12px] bg-[linear-gradient(135deg,#08255a_0%,#06235a_100%)] px-8 py-16 text-center text-white">
          <h2 className="mx-auto max-w-3xl text-[48px] font-bold leading-[1.1]">
            Ready To Start Winning Incredible Deals?
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-[16px] text-[#dce6f5]">
            Join over 15,000 smart bidders today and get instant access to
            premium liquidation inventory at up to 90% off retail.
          </p>
          <AuctionPrimaryButton className="mt-8 h-11 px-6 text-[13px]">
            Start Bidding Now
          </AuctionPrimaryButton>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
