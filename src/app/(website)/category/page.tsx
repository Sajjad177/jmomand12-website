import AuctionListingPage from "@/features/auction-site/components/category-page";
import { Suspense } from "react";

export default function Page() {
  return 
   <Suspense fallback={<div>Loading...</div>}>
     <AuctionListingPage/>;
   </Suspense>
}
