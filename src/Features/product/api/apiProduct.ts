// File: src/Features/product/api/apiProduct.ts
import { useState, useEffect } from "react";
import apiClient from "../../../config/api"; // Sesuaikan path ini jika posisi folder berbeda
import type { ProductType } from "../types/productTypes"; // Sesuaikan path ini dengan lokasi file type Anda

// Membuat Custom Hook sesuai standar React
export const useProducts = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async (isRetry = false) => {
      try {
        // UPDATE: Mengarah ke endpoint Express.js
        const response = await apiClient.get(
          "/products",
        );
        // UPDATE: Karena dari controller dikirim { success: true, data: products }
        setProducts(response.data.data);
      } catch (err: any) {
        // UPDATE: Ubah pesan log agar tidak membingungkan
        console.error("Gagal mengambil data produk dari server:", err);

        // LOGIKA PENANGKAL EXPIRED TOKEN:
        // Mengecek apakah error disebabkan oleh token sesi yang hangus
        const errorMessage = err.response?.data?.message || err.message;
        const statusCode = err.response?.status;

        const isSessionExpired =
          statusCode === 401 ||
          (typeof errorMessage === "string" &&
            errorMessage.toLowerCase().includes("session"));

        if (isSessionExpired && !isRetry) {
          // 1. Bersihkan token yang kadaluwarsa
          localStorage.removeItem("userToken");
          // Anda bisa menambahkan removeItem lain jika ada (misal: "userData")

          // 2. Coba panggil lagi secara publik (isRetry = true)
          return fetchProducts(true);
        }

        setError(
          "Koneksi ke database terputus. Silakan coba muat ulang halaman.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Mengembalikan nilai agar bisa dipakai di komponen mana saja
  return { products, loading, error };
};