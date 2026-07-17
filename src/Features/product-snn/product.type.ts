export type Product = {
  id: string;
  name: string;
  brand: string;
  type: string;
  description: string;
  notes: string | null;
  price: number;
  stock: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type ProductListResult = {
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type GetProductsParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "createdAt" | "price" | "name";
  order?: "asc" | "desc";
  brand?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
};