import { useQuery } from "@tanstack/react-query";
import {
  ActiveAuctionProduct,
  getAllActiveProduct,
} from "../features/auction-site/api/auction.api";

export const useActiveAuctionProducts = () => {
  return useQuery<ActiveAuctionProduct[]>({
    queryKey: ["active-auction-products"],
    queryFn: async () => {
      const response = await getAllActiveProduct();
      return response.data;
    },
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
};
