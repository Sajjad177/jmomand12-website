import { api } from "@/lib/api";
import type { ApiResponse } from "@/features/dashboard/types";
import type {
  NewsletterSubscriptionResult,
  SearchBrowseResponse,
} from "../types";

export async function browseProductsForSearch(searchTerm: string) {
  const response = await api.get<ApiResponse<SearchBrowseResponse["data"]>>("/products/browse", {
    params: {
      searchTerm,
      limit: 8,
      page: 1,
      sortBy: "createdAt",
      sortOrder: "desc",
    },
  });

  return {
    data: response.data.data,
    meta: response.data.meta,
  } satisfies SearchBrowseResponse;
}

export async function subscribeToNewsletter(email: string) {
  const response = await api.post<ApiResponse<NewsletterSubscriptionResult>>(
    "/newsletters/subscribe",
    {
      email,
      source: "website-footer",
    },
  );

  return response.data.data;
}
