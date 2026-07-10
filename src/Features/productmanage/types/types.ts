// src/Features/productmanage/types.ts

export interface PerfumeManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface Product {
  id: string; // UPDATE: Menggunakan id (sesuai Prisma)
  name: string;
  brand: string;
  price: number;
  // TAMBAHAN: Agar sesuai dengan database PostgreSQL
  stock: string; 
  imageUrl: string;
  type: string;
  usage_time: string;
  notes: string;
  sillage: string;
  projection: string;
  longevity: string;
  description: string;
  blind_buy_safe: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface PerfumeFormData {
  name: string;
  brand: string;
  price: string;
  stock: string;
  type: string;
  usage_time: string;
  notes: string;
  sillage: string;
  projection: string;
  longevity: string;
  description: string;
  imageUrl: string;
  blind_buy_safe: boolean;
}