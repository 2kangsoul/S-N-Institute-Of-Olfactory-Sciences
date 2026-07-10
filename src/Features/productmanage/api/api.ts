// src/Features/productmanage/api.ts

import apiClient from "../../../config/api"
import type { PerfumeFormData } from "../types/types"

export const fetchProductsApi = async () => {
  // UPDATE: Endpoint diubah ke /products (Express API) dan hapus parameter bawaan Backendless
  const res = await apiClient.get("/products");
  
  // UPDATE: Mengambil array datanya dari res.data.data sesuai format controller Express
  return res.data.data;
};

export const addProductApi = async (data: PerfumeFormData) => {
  // UPDATE: Endpoint diubah ke /products
  const res = await apiClient.post("/products", {
    ...data,
    price: Number(data.price),
  });
  
  // UPDATE: Mengembalikan data produk yang baru dibuat
  return res.data.data;
};

// UPDATE: Ubah parameter objectId menjadi id
export const deleteProductApi = async (id: string) => {
  // UPDATE: Endpoint diubah ke /products/:id
  const res = await apiClient.delete(`/products/${id}`);
  return res.data;
};