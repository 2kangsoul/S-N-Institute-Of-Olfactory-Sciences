// File: src/Features/product/hooks/filterringHooks.tsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // <-- TAMBAHAN BARU: Import useLocation
import type { ProductType } from "../types/productTypes";
import type { ProductFiltersHookReturn } from "../types/filteringTypes";

export const useProductFilters = (products: ProductType[]): ProductFiltersHookReturn => {
  const location = useLocation(); // <-- TAMBAHAN BARU: Inisialisasi hook location

  // --- STATE UNTUK FITUR PENCARIAN & FILTER ---
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortPrice, setSortPrice] = useState<string>("");
  const [filterSillage, setFilterSillage] = useState<string>("");
  const [filterProjection, setFilterProjection] = useState<string>("");
  const [filterLongevity, setFilterLongevity] = useState<string>("");
  const [filterNotes, setFilterNotes] = useState<string>("");
  
  // <-- PERUBAHAN DI SINI: Ambil nilai awal dari state Link jika ada, jika tidak kosongkan ("")
  const [filterType, setFilterType] = useState<string>(location.state?.filterType || ""); 
  
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // --- STATE UNTUK FITUR PAGINATION (NEXT PAGE) ---
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    sortPrice,
    filterSillage,
    filterProjection,
    filterLongevity,
    filterNotes,
    filterType,
  ]);

  // =======================================================================
  // LOGIKA PENCARIAN, FILTERING, DAN PAGINATION
  // =======================================================================

  const matchSearch = (p: ProductType) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase());

  const availableTypes = Array.from(
    new Set(
      products
        .filter(
          (p) =>
            matchSearch(p) &&
            (filterNotes ? p.notes === filterNotes : true) &&
            (filterSillage ? p.sillage === filterSillage : true) &&
            (filterProjection ? p.projection === filterProjection : true) &&
            (filterLongevity ? p.longevity === filterLongevity : true)
        )
        .map((p) => p.type)
        .filter(Boolean)
    )
  );

  const availableNotes = Array.from(
    new Set(
      products
        .filter(
          (p) =>
            matchSearch(p) &&
            (filterType ? p.type === filterType : true) &&
            (filterSillage ? p.sillage === filterSillage : true) &&
            (filterProjection ? p.projection === filterProjection : true) &&
            (filterLongevity ? p.longevity === filterLongevity : true)
        )
        .map((p) => p.notes)
        .filter(Boolean)
    )
  );

  const availableSillage = Array.from(
    new Set(
      products
        .filter(
          (p) =>
            matchSearch(p) &&
            (filterType ? p.type === filterType : true) &&
            (filterNotes ? p.notes === filterNotes : true) &&
            (filterProjection ? p.projection === filterProjection : true) &&
            (filterLongevity ? p.longevity === filterLongevity : true)
        )
        .map((p) => p.sillage)
        .filter(Boolean)
    )
  );

  const availableProjection = Array.from(
    new Set(
      products
        .filter(
          (p) =>
            matchSearch(p) &&
            (filterType ? p.type === filterType : true) &&
            (filterNotes ? p.notes === filterNotes : true) &&
            (filterSillage ? p.sillage === filterSillage : true) &&
            (filterLongevity ? p.longevity === filterLongevity : true)
        )
        .map((p) => p.projection)
        .filter(Boolean)
    )
  );

  const availableLongevity = Array.from(
    new Set(
      products
        .filter(
          (p) =>
            matchSearch(p) &&
            (filterType ? p.type === filterType : true) &&
            (filterNotes ? p.notes === filterNotes : true) &&
            (filterSillage ? p.sillage === filterSillage : true) &&
            (filterProjection ? p.projection === filterProjection : true)
        )
        .map((p) => p.longevity)
        .filter(Boolean)
    )
  );

  const filteredProducts = products
    .filter((item) => {
      const matchName = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchType = filterType ? item.type === filterType : true;
      const matchSillage = filterSillage
        ? item.sillage === filterSillage
        : true;
      const matchProjection = filterProjection
        ? item.projection === filterProjection
        : true;
      const matchLongevity = filterLongevity
        ? item.longevity === filterLongevity
        : true;
      const matchNotes = filterNotes ? item.notes === filterNotes : true;

      return (
        matchName &&
        matchType &&
        matchSillage &&
        matchProjection &&
        matchLongevity &&
        matchNotes
      );
    })
    .sort((a, b) => {
      if (sortPrice === "asc") return a.price - b.price;
      if (sortPrice === "desc") return b.price - a.price;
      return 0;
    });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    searchQuery,
    setSearchQuery,
    sortPrice,
    setSortPrice,
    filterSillage,
    setFilterSillage,
    filterProjection,
    setFilterProjection,
    filterLongevity,
    setFilterLongevity,
    filterNotes,
    setFilterNotes,
    filterType,
    setFilterType,
    showFilters,
    setShowFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedProducts,
    availableNotes,
    availableSillage,
    availableProjection,
    availableLongevity,
    availableTypes,
  };
};