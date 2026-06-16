// File: src/Features/product/types/filteringTypes.tsx
import React from "react";
import type { ProductType } from "./productTypes"; // Import ProductType untuk digunakan di paginatedProducts

// Tipe data untuk Props yang diterima oleh komponen FilteringProduct
export interface FilteringProductProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  sortPrice: string;
  setSortPrice: (val: string) => void;
  filterSillage: string;
  setFilterSillage: (val: string) => void;
  filterProjection: string;
  setFilterProjection: (val: string) => void;
  filterLongevity: string;
  setFilterLongevity: (val: string) => void;
  filterNotes: string;
  setFilterNotes: (val: string) => void;
  filterType: string; // <-- TAMBAHAN BARU
  setFilterType: (val: string) => void; // <-- TAMBAHAN BARU
  showFilters: boolean;
  setShowFilters: (val: boolean) => void;
  availableNotes: string[];
  availableSillage: string[];
  availableProjection: string[];
  availableLongevity: string[];
  availableTypes: string[]; // <-- TAMBAHAN BARU
}

// Tipe data untuk nilai yang dikembalikan oleh Custom Hook useProductFilters
// Menggunakan 'extends' agar tidak perlu menulis ulang tipe yang sama dengan Props
export interface ProductFiltersHookReturn extends FilteringProductProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  paginatedProducts: ProductType[];
}

const FilteringTypeDefinitions = () => null;
export default FilteringTypeDefinitions;