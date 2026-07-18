"use client";

import Link from "next/link";

import AuctionCard from "./auction-card";
import Loading from "../loading";
import { useActiveAuctionProducts } from "../../hooks/useAuction";

export default function ActiveAuctions() {
  const {
    data: activeProducts,
    isLoading,
    isError,
    error,
    refetch,
  } = useActiveAuctionProducts();

  const products = (activeProducts || []).filter(
    (product) => product.status === "active",
  );
  console.log("products for auction", products);

  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-14">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
              Active Auctions
            </h2>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Live bidding on premium marketplace collectibles.
            </p>
          </div>

          <Link
            href="/category"
            className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-orange-600 shadow-sm hover:shadow active:scale-[0.98] sm:px-8 sm:py-3.5 sm:text-base"
          >
            View All Items
          </Link>
        </div>

        {/* Dynamic States Layout Engine */}
        {isLoading ? (
          <Loading />
        ) : isError ? (
          <div className="mx-auto max-w-md text-center py-12">
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm font-medium text-red-600">
              Failed to connect or pull live marketplace data. Please refresh.
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 rounded-3xl border border-dashed border-slate-200 bg-white p-8">
            <p className="text-slate-400 font-medium">
              No live active auctions right now. Check back soon!
            </p>
          </div>
        ) : (
          /* Grid Presentation Layer */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const displayImage =
                product.productId?.images?.[0]?.url ||
                "/img/auctions/placeholder.png";
              const currentBidVal =
                product.highestBid?.amount ||
                product.startingBid ||
                product.productId?.reservePrice ||
                0;
              const displayBid = `$${currentBidVal}`;
              const title = product.productId?.title || "Untitled Auction";
              const category =
                product.productId?.category || "General Marketplace";
              const description = product.productId?.description || "";
              const condition = product.productId?.condition || "";

              return (
                <AuctionCard
                  key={product._id}
                  href={`/auction-details/${product._id}`}
                  image={displayImage}
                  title={title}
                  category={category}
                  description={description}
                  condition={condition}
                  currentBid={displayBid}
                  timeLeft={product.auctionId?.endsAt || ""}
                  status={product.status}
                  auctionProductId={product._id}
                  startingBid={product.startingBid}
                  bidIncrement={product.bidIncrement}
                  highestBidAmount={product.highestBid?.amount || 0}
                  onBidPlaced={refetch}
                  bids={0}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
