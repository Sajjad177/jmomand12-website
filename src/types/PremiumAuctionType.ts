// Auction Type Definitions for Premium Card System

export interface AuctionProductImage {
  public_id?: string;
  url: string;
}

export interface ProductDetails {
  _id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  images: AuctionProductImage[];
}

export interface HighestBid {
  amount: number;
}

export interface AuctionTimeline {
  _id: string;
  auctionId: string;
  startsAt: string;
  endsAt: string;
  status: "active" | "closed" | "upcoming";
}

export interface PremiumAuctionProduct {
  _id: string;
  auctionId: AuctionTimeline;
  productId: ProductDetails;
  startingBid: number;
  bidIncrement: number;
  status: "active" | "closed" | "upcoming";
  highestBid?: HighestBid | null;
  totalBids?: number;
}

export interface PremiumAuctionResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: PremiumAuctionProduct[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}
