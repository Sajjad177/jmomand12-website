// --- API Schema Configuration Contracts ---
export interface CategoryImage {
  public_id: string;
  url: string;
}

export interface CategoryItem {
  categoryImage: CategoryImage | null;
  category: string;
}

export interface CategoriesApiResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: CategoryItem[];
}
