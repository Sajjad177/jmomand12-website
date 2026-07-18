interface AuctionProductImage {
  public_id: string;
  url: string;
}

interface AuctionProduct {
  _id: string;
  inventoryId: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  day: string;
  reservePrice: number;
  inventoryStatus: string;
  images: AuctionProductImage[];
  totalReview: number;
  type: string;
  color: string[];
  quantity: number;
  averageReview: number;
}

interface PickupSchedule {
  startDate: string;
  endDate: string;
  dailyStartTime: string;
  dailyEndTime: string;
  durationInDays: number;
}

interface AuctionItem {
  _id: string;
  auctionId: string;
  products: AuctionProduct[];
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  durationInDays: number;
  status: string;
  pickupSchedule: PickupSchedule;
  createdAt: string;
  updatedAt: string;
}

interface MetaData {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface ActiveAuctionResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    meta: MetaData;
    data: AuctionItem[];
  };
}

export interface LiveAuctionProductsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: AuctionProduct[];
  meta: MetaData;
}

export interface AuctionCardProps {
  image: string;
  title: string;
  category: string;
  bids: number;
  currentBid: string;
  timeLeft: string;
  href: string;
}
