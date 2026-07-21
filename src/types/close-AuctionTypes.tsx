// --- API Interfaces Definition matching your response structural mapping ---
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
  manufacturer: string;
  averageReview: number;
  createdAt: string;
  updatedAt: string;
}

interface PickupSchedule {
  startDate: string;
  endDate: string;
  dailyStartTime: string;
  dailyEndTime: string;
  durationInDays: number;
}

interface ClosedAuctionItem {
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

export interface ClosedAuctionResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: ClosedAuctionItem[];
  meta: MetaData;
}