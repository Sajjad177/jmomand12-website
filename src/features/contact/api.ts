import { api } from "@/lib/api";
import type { ApiResponse } from "@/features/dashboard/types";

export type ContactPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

export async function submitContact(payload: ContactPayload) {
  const response = await api.post<ApiResponse<unknown>>("/contacts", payload);
  return response.data;
}
