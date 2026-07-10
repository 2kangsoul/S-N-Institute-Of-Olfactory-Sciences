import apiClient from '../config/api';

export const getDashboardStats = async () => {
  // Ambil data penjualan terbanyak, total pendapatan, dll.
  // Sesuaikan endpoint dengan nama rute di Express Anda
  const [products, orders] = await Promise.all([
    apiClient.get("/products?sortBy=soldCount%20DESC&pageSize=5"),
    apiClient.get("/orders")
  ]);
  
  return {
    // UPDATE: Mengambil data dari bungkus response Express (res.data.data) atau fallback ke res.data
    topProducts: products.data.data || products.data,
    totalOrders: (orders.data.data || orders.data).length
  };
};