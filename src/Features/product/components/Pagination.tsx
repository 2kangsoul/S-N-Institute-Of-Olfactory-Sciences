// File: src/Features/product/components/Pagination.tsx
import React from "react";
import type { PaginationProps } from "../types/paginationTypes";

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  // Jika total halaman hanya 1 atau kurang, pagination tidak perlu ditampilkan
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center mt-12 gap-6">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="btn btn-sm h-10 px-6 bg-white border border-gray-200 text-gray-800 hover:bg-gray-100 disabled:opacity-40 disabled:bg-gray-50 rounded-xl"
      >
        ❮ Sebelumnya
      </button>
      <span className="text-sm font-semibold text-gray-600">
        Halaman {currentPage} dari {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="btn btn-sm h-10 px-6 bg-white border border-gray-200 text-gray-800 hover:bg-gray-100 disabled:opacity-40 disabled:bg-gray-50 rounded-xl"
      >
        Selanjutnya ❯
      </button>
    </div>
  );
};

export default Pagination;