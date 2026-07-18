import { api } from "../../lib/api";

export async function getAllCategories() {
  const res = await api.get("/products/categories");
  return res.data;
}
