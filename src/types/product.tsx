// --- API Interfaces Definition matching your response structural mapping ---
interface ProductImage {
  public_id: string;
  url: string;
}

interface InventoryProduct {
  _id: string;
  inventoryId: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  inventoryStatus: string;
  images: ProductImage[];
  type: string;
  color: string[];
  quantity: number;
  price: number;
  manufacturer: string;
}

interface MetaData {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface InventoryProductsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: InventoryProduct[];
  meta: MetaData;
}
