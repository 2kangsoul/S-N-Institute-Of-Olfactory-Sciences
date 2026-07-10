// @ts-nocheck
/* eslint-disable */
import React from "react";
import type { Product } from "../types/types"; // Mundur 1 folder ke types

interface PerfumeListProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  isFetching: boolean;
  currentProducts: Product[];
  // UPDATE: objectId diubah menjadi id
  handleDeleteProduct: (id: string, productName: string) => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

export default function PerfumeList({
  searchTerm,
  setSearchTerm,
  isFetching,
  currentProducts,
  handleDeleteProduct,
  currentPage,
  setCurrentPage,
  totalPages,
}: PerfumeListProps) {
  return (
    <div className="p-6 flex flex-col bg-gray-50/30">
      {/* Kotak Biru (Title & Search menggunakan DaisyUI) */}
      <div className="mb-3 shrink-0">
        <h3 className="text-sm font-bold text-gray-800 mb-3">
          Katalog Parfum
        </h3>

        <label className="input border-2 border-gray-300 flex items-center gap-2 text-xs w-full bg-white min-h-[36px]">
          <svg
            className="w-4 h-4 opacity-50 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            required
            placeholder="Cari nama atau brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="grow w-full outline-none bg-transparent"
          />
        </label>
      </div>

      {/* Kotak Aqua (Tabel Data 5 Item) */}
      <div className="flex-1 bg-white border border-gray-200 rounded overflow-hidden">
        {isFetching ? (
          <div className="flex h-full items-center justify-center text-gray-500 text-xs">
            Memuat data...
          </div>
        ) : currentProducts.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-500 text-xs text-center px-4">
            Kosong.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {currentProducts.map((product) => (
              <li
                // UPDATE: objectId diubah menjadi id
                key={product.id}
                className="py-2 px-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-xs font-bold text-gray-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate">
                    {product.brand}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] font-semibold text-gray-700">
                    Rp {product.price?.toLocaleString("id-ID")}
                  </span>
                  <button
                    // UPDATE: objectId diubah menjadi id
                    onClick={() =>
                      handleDeleteProduct(product.id, product.name)
                    }
                    className="text-red-400 hover:text-red-600 transition-colors"
                    title="Hapus"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Kotak Ungu (Pagination Bawah) */}
      <div className="mt-3 shrink-0 flex items-center justify-between pt-2 border-t border-gray-100">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 text-[10px] font-bold text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-30 transition-colors"
        >
          PREV
        </button>
        <span className="text-[11px] font-medium text-gray-500">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-[10px] font-bold text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-30 transition-colors"
        >
          NEXT
        </button>
      </div>
    </div>
  );
}