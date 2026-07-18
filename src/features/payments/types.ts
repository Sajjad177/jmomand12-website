export type SetupIntentResponse = {
  customerId: string;
  setupIntentId: string;
  clientSecret: string | null;
  publishableKey?: string;
  testHelperEnabled: boolean;
};

export type SetupIntentStatus = {
  id: string;
  status: string;
  customer: string;
  paymentMethodId?: string;
  canSaveAsDefault: boolean;
  nextStep: string;
};

export type SavedPaymentProfile = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  image?: {
    public_id?: string;
    url?: string;
  };
  stripeCustomerId?: string;
  defaultPaymentMethodId?: string;
  hasDefaultPaymentMethod?: boolean;
};

export type CreateBidPayload = {
  auctionProductId: string;
  amount: number;
};

export type CreatedBid = {
  _id: string;
  auctionId: string;
  auctionProductId: string;
  productId: string;
  bidderId: string;
  amount: number;
  isWinningBid: boolean;
  createdAt: string;
  updatedAt: string;
};
