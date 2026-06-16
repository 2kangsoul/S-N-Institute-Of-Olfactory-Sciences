// src/Features/productmanage/usePerfumeManager.ts

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import type { Product, PerfumeFormData } from "../types/types"
import { fetchProductsApi, addProductApi, deleteProductApi } from "../api/api"

export function usePerfumeManager(isOpen: boolean) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // Pencarian & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const initialFormState: PerfumeFormData = {
    name: "", brand: "", price: "", stock: "", type: "", usage_time: "",
    notes: "", sillage: "", projection: "", longevity: "", description: "",
    imageUrl: "", blind_buy_safe: false,
  };

  const [formData, setFormData] = useState<PerfumeFormData>(initialFormState);

  const fetchProducts = async () => {
    setIsFetching(true);
    try {
      const data = await fetchProductsApi();
      setProducts(data);
    } catch (error) {
      toast.error("Gagal memuat daftar parfum");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      setSearchTerm("");
      setCurrentPage(1);
    }
  }, [isOpen]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.brand || !formData.price) {
      toast.error("Nama, Brand, dan Harga wajib diisi!");
      return;
    }
    setIsLoading(true);
    try {
      await addProductApi(formData);
      toast.success(`Parfum berhasil ditambahkan!`);
      setFormData(initialFormState);
      fetchProducts();
    } catch (error: any) {
      toast.error("Gagal menambahkan parfum");
    } finally {
      setIsLoading(false);
    }
  };

  // UPDATE: Mengubah parameter objectId menjadi id
  const handleDeleteProduct = async (id: string, productName: string) => {
    if (!window.confirm(`Hapus parfum ${productName}?`)) return;
    try {
      await deleteProductApi(id);
      toast.success(`Parfum dihapus.`);
      fetchProducts();
    } catch (error) {
      toast.error("Gagal menghapus parfum.");
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return {
    isFetching, isLoading, formData, searchTerm, setSearchTerm,
    currentPage, setCurrentPage, totalPages,
    handleChange, handleAddProduct, handleDeleteProduct, currentProducts
  };
}