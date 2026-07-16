import Hero from "@/components/hero";
import AuctionDays from "@/components/auctiondays";
import BrowseCategories from "@/components/categories";
import ClosingSoon from "@/components/closing-soon";
import ActiveAuctions from "@/components/Auction/active-auctions";
import FeaturedProducts from "@/components/Products/FeaturedProducts";
import HowItWorks from "@/components/HowItWorks";
import ClosedAuctions from "@/components/closed-auctions";
import StatsSection from "@/components/StatsSection";
import UpcomingAuctions from "@/components/UpcomingAuctions";
import WhyChooseUs from "@/components/WhyChooseUs";
import CTASection from "@/components/CTASection";

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
