import { api } from "@/lib/api";
import type { ApiResponse } from "@/features/dashboard/types";

export type AuctionProductDetails = {
  auctionProductId: string;
  status: string;
  canBid: boolean;
  startingBid: number;
  reservePrice?: number;
  bidIncrement: number;
  highestBid: {
    amount: number;
    placedAt: string | null;
    bidder: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string
      role: string
      isVerified : boolean
      hasDefaultPaymentMethod: boolean
      isBlocked: boolean
      isSuspend: boolean
    } | null;
  };
  minimumNextBid: number;
  winner: {
    _id: string;
    firstName: string;
    lastName: string;
  } | null;
  closedAt: string | null;
  paymentStatus: string;
  pickupStatus: string;
  auction: {
    _id: string;
    auctionId: string;
    title: string;
    description?: string;
    startsAt: string;
    endsAt: string;
    status: string;
  } | null;
  product: {
    _id: string;
    inventoryId: string;
    title: string;
    description: string;
    category: string;
    condition: string;
    day?: string;
    reservePrice?: number;
    inventoryStatus: string;
    images: Array<{
      public_id: string;
      url: string;
    }>;
    totalReview: number;
    type: string;
    color: string[];
    quantity?: number;
    averageReview: number;
    manufacturer?: string;
    createdAt?: string;
    updatedAt?: string;
  } | null;
};

export async function getAuctionProductDetails(id: string) {
  const response = await api.get<ApiResponse<AuctionProductDetails>>(
    `/auction-products/details/${id}`,
  );
  return response.data.data;
}
