// File: src/Features/product/types/paginationTypes.tsx
import React from "react";

export interface PaginationProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

const PaginationTypeDefinitions = () => null;
export default PaginationTypeDefinitions;