import type { ApiResponse } from "@/features/dashboard/types";
import { api } from "@/lib/api";

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
      email: string;
      role: string;
      isVerified: boolean;
      hasDefaultPaymentMethod: boolean;
      isBlocked: boolean;
      isSuspend: boolean;
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

// Newly added type representing the active auction products returned by the `/auction-products/active` endpoint
export type ActiveAuctionProduct = {
  _id: string;
  auctionId: {
    _id: string;
    auctionId: string;
    startsAt: string;
    endsAt: string;
  } | null;
  productId: {
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
  startingBid: number;
  bidIncrement: number;
  status: string;
  highestBid?: {
    amount: number;
    placedAt: string | null;
    bidder: string | null;
    bid: string | null;
  } | null;
  paymentStatus: string;
  pickupStatus: string;
  paymentRetryCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export async function getAuctionProductDetails(id: string) {
  const response = await api.get<ApiResponse<AuctionProductDetails>>(
    `/auction-products/details/${id}`,
  );
  return response.data.data;
}

export async function resolveAuctionProductDetails(id: string) {
  try {
    return await getAuctionProductDetails(id);
  } catch (error) {
    const activeProducts = (await getAllActiveProduct()).data;
    const matchingLot = activeProducts.find((item) => item.productId?._id === id);
    if (!matchingLot) throw error;
    return getAuctionProductDetails(matchingLot._id);
  }
}

export async function getAllActiveProduct() {
  const res = await api.get<ApiResponse<ActiveAuctionProduct[]>>("/auction-products/active");
  return res.data;
}
