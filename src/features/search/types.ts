export type SearchProductResult = {
  _id: string;
  inventoryId: string;
  title: string;
  description?: string;
  category: string;
  condition?: string;
  inventoryStatus: string;
  images?: Array<{
    public_id: string;
    url: string;
  }>;
  type: "for_sale" | "for_auction" | string;
  price?: number;
  reservePrice?: number;
  averageReview?: number;
};

export type SearchBrowseResponse = {
  data: SearchProductResult[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
};

export type NewsletterSubscriptionResult = {
  email: string;
  source: string;
  alreadySubscribed: boolean;
};
