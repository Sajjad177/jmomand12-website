import Hero from "@/components/hero";
import AuctionDays from "@/components/auctiondays";
import BrowseCategories from "@/components/categories";
import ClosingSoon from "@/components/closing-soon";
// import ActiveAuctions from "@/components/Auction/active-auctions";
import FeaturedProducts from "@/components/Products/FeaturedProducts";
import HowItWorks from "@/components/HowItWorks";
import ClosedAuctions from "@/components/closed-auctions";
import StatsSection from "@/components/StatsSection";
import UpcomingAuctions from "@/components/UpcomingAuctions";
import WhyChooseUs from "@/components/WhyChooseUs";
import CTASection from "@/components/CTASection";
import ActiveAuctions from "../../../components/Auction/active-auctions";

export function HomePage() {
  return (
    <main className=" bg-[#f7f9fc]">
      <Hero />
      {/* <AuctionDays /> */}
      <BrowseCategories />
      <ActiveAuctions />

      <UpcomingAuctions />
      <ClosingSoon />
      <FeaturedProducts />
      <HowItWorks />
      <ClosedAuctions />
      <StatsSection />
      <WhyChooseUs />
      {/* <Testimonials /> */}
      <CTASection />
    </main>
  );
}
