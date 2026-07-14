import { api } from "@/lib/api";
import type { ApiResponse } from "@/features/dashboard/types";
import type { CheckoutSessionResponse, SalesOrder } from "../types";

export async function createCartCheckoutSession() {
  const response = await api.post<ApiResponse<CheckoutSessionResponse>>("/orders/checkout");
  return response.data.data;
}

export async function getMySalesOrders() {
  const response = await api.get<ApiResponse<SalesOrder[]>>("/orders/me");
  return response.data.data;
}
