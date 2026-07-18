import { api } from "@/lib/api";
import type { ApiResponse } from "@/features/dashboard/types";
import type {
  CreateBidPayload,
  CreatedBid,
  SavedPaymentProfile,
  SetupIntentResponse,
  SetupIntentStatus,
  TestHelperStatus,
} from "../types";

export async function createSetupIntent() {
  const response = await api.post<ApiResponse<SetupIntentResponse>>("/payments/setup-intents");
  return response.data.data;
}

export async function getTestHelperStatus() {
  const response = await api.get<ApiResponse<TestHelperStatus>>("/payments/test-helper-status");
  return response.data.data;
}

export async function getSetupIntentStatus(setupIntentId: string) {
  const response = await api.get<ApiResponse<SetupIntentStatus>>(
    `/payments/setup-intents/${setupIntentId}`,
  );
  return response.data.data;
}

export async function saveDefaultPaymentMethod(payload: { setupIntentId: string }) {
  const response = await api.post<ApiResponse<SavedPaymentProfile>>(
    "/payments/default-payment-method",
    payload,
  );
  return response.data.data;
}

export async function createTestDefaultPaymentMethod(testPaymentMethodId = "pm_card_visa") {
  const response = await api.post<ApiResponse<SavedPaymentProfile>>(
    "/payments/test-default-payment-method",
    { testPaymentMethodId },
  );
  return response.data.data;
}

export async function createBid(payload: CreateBidPayload) {
  const response = await api.post<ApiResponse<CreatedBid>>("/bid", payload);
  return response.data.data;
}
