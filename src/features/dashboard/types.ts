export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
};

export type UserProfile = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  street?: string;
  location?: string;
  postalCode?: string;
  dateOfBirth?: string;
  image?: {
    public_id?: string;
    url?: string;
  };
  role: string;
  hasDefaultPaymentMethod?: boolean;
  defaultPaymentMethodId?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductImage = {
  public_id: string;
  url: string;
};

export type ProductSummary = {
  _id: string;
  inventoryId: string;
  title: string;
  description?: string;
  category: string;
  condition?: string;
  images?: ProductImage[];
  inventoryStatus?: string;
};

export type AuctionSummary = {
  _id: string;
  title?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
};

export type Invoice = {
  _id: string;
  invoiceNumber: string;
  inventoryId: string;
  amount: number;
  status: "payment_pending" | "paid" | "payment_failed" | "void";
  pickupCode: string;
  pickupQrDataUrl?: string;
  paymentFailureReason?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  product?: ProductSummary;
  auction?: AuctionSummary;
};

export type PickupSlot = {
  _id: string;
  startsAt: string;
  endsAt: string;
  maxCustomers: number;
  maxItems: number;
  bookedCustomers: number;
  bookedItems: number;
  isActive: boolean;
};

export type PickupAppointment = {
  _id: string;
  slot?: PickupSlot;
  invoices: Array<Invoice | string>;
  products: Array<ProductSummary | string>;
  pickupCode: string;
  status: "scheduled" | "picked_up" | "completed" | "cancelled";
  pickedUpAt?: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type DashboardOrder = {
  invoice: Invoice;
  appointment?: PickupAppointment;
  pickupStatusLabel: string;
  pickupActionable: boolean;
};

export type UpdateProfilePayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  street?: string;
  location?: string;
  postalCode?: string;
  dateOfBirth?: string;
  image?: File | null;
};
