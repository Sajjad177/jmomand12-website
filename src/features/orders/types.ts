import type { ProductSummary } from "@/features/dashboard/types";

export type CheckoutSessionResponse = {
  checkoutUrl: string | null;
};

export type SalesOrderItem = {
  product: ProductSummary | string;
  quantity: number;
  price: number;
};

export type SalesOrder = {
  _id: string;
  orderNumber: string;
  customer: string;
  items: SalesOrderItem[];
  totalAmount: number;
  status: "pending" | "paid" | "failed" | "cancelled";
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  paidAt?: string;
  pickupCode: string;
  pickupQrDataUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};
