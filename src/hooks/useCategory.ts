import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "../features/category/api";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });
};
