// src/Features/productmanage/api.ts

import apiClient from "../../../config/api";
import type { PerfumeFormData } from "../types/types";

export const fetchProductsApi = async () => {
  // ponytail: endpoint backend baru singular /product/get (router lama /products sudah di-comment)
  const res = await apiClient.get("/product/get");
  return res.data.data;
};

export const addProductApi = async (data: PerfumeFormData) => {
  const res = await apiClient.post("/product/create", {
    ...data,
    price: Number(data.price),
  });
  return res.data.data;
};

// UPDATE: Ubah parameter objectId menjadi id
export const deleteProductApi = async (id: string) => {
  const res = await apiClient.delete(`/product/delete/${id}`);
  return res.data;
};
