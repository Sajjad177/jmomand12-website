import { api } from "@/lib/api";
import type {
  ApiResponse,
  DashboardAuctionActivity,
  Invoice,
  PickupAppointment,
  PickupSlot,
  UpdateProfilePayload,
  UserProfile,
  WishlistItem,
} from "../types";

export async function getMyProfile() {
  const response = await api.get<ApiResponse<UserProfile>>("/users/me");
  return response.data.data;
}

export async function updateMyProfile(payload: UpdateProfilePayload) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value == null || value === "") return;
    if (key === "image" && value instanceof File) {
      formData.append("image", value);
      return;
    }

    if (typeof value === "string") {
      formData.append(key, value);
    }
  });

  const response = await api.patch<ApiResponse<UserProfile>>("/users/me", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
}

export async function getMyInvoices() {
  const response = await api.get<ApiResponse<Invoice[]>>("/invoices/me");
  return response.data.data;
}

export async function getMyDashboardAuctionActivity() {
  const response = await api.get<ApiResponse<DashboardAuctionActivity>>("/bid/me/dashboard");
  return response.data.data;
}

export async function getMyPickupAppointments() {
  const response = await api.get<ApiResponse<PickupAppointment[]>>("/pickups/me");
  return response.data.data;
}

export async function getMyReadyInvoices() {
  const response = await api.get<ApiResponse<Invoice[]>>("/pickups/ready-invoices");
  return response.data.data;
}

export async function getAvailablePickupSlots() {
  const response = await api.get<ApiResponse<PickupSlot[]>>("/pickups/slots");
  return response.data.data;
}

export async function getMyWishlist() {
  const response = await api.get<ApiResponse<WishlistItem[]>>("/carts/wishlist");
  return response.data.data;
}

export async function removeWishlistItem(wishlistItemId: string) {
  await api.delete<ApiResponse<null>>(`/carts/${wishlistItemId}`);
}

export async function moveWishlistItemToCart(item: WishlistItem) {
  await api.post<ApiResponse<unknown>>("/carts", {
    productId: item.productId._id,
    type: "cart",
    quantity: 1,
  });
  await api.delete<ApiResponse<null>>(`/carts/${item._id}`);
}

export async function schedulePickup(payload: {
  slotId: string;
  invoiceIds: string[];
}) {
  const response = await api.post<ApiResponse<PickupAppointment>>("/pickups", payload);
  return response.data.data;
}
