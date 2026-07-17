import { Product, ProductListResult, GetProductsParams } from "./product.type";
import { api } from "@/src/lib/axios";

export class ProductService {
  static async getProducts(params?: GetProductsParams) {
    const { data } = await api.get<{ message: string; data: ProductListResult }>(
      "/product/get",
      { params }
    );
    return data.data;
  }

  static async getProductById(id: string) {
    const { data } = await api.get<{ message: string; data: Product }>(
      `/product/get/${id}`
    );
    return data.data;
  }

  static async createProduct(formData: FormData) {
    const { data } = await api.post<{ message: string; data: Product }>(
      "/product/create",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
  }

  static async updateProduct(id: string, formData: FormData) {
    const { data } = await api.patch<{ message: string; data: Product }>(
      `/product/update/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
  }

  static async deleteProduct(id: string) {
    const { data } = await api.delete<{ message: string; data: Product }>(
      `/products/delete/${id}`
    );
    return data.data;
  }
}