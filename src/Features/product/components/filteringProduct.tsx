// @ts-nocheck
/* eslint-disable */
// File: src/Features/product/components/filteringProduct.tsx
import React from "react";
import type { FilteringProductProps } from "../types/filteringTypes"; // Import Type dari file terpisah

const FilteringProduct: React.FC<FilteringProductProps> = ({
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
  // JARING PENGAMAN: Tambahkan = [] agar tidak crash jika data belum turun dari parent
  availableNotes = [],
  availableSillage = [],
  availableProjection = [],
  availableLongevity = [],
  availableTypes = [], 
}) => {
  return (
    <>
      {/* AREA PENCARIAN & FILTER */}
      <div className="mb-6 flex flex-col md:flex-row gap-3 justify-between items-center bg-white py-2.5 px-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="w-full md:w-1/2 relative">
          <input
            type="text"
            placeholder="Cari nama parfum..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full bg-[#f8f7f4] border-gray-200 focus:outline-none focus:border-gray-400 pl-4 rounded-xl h-9 min-h-0 text-sm"
          />
        </div>

        <div className="w-full md:w-auto flex gap-3">
          <select
            value={sortPrice}
            onChange={(e) => setSortPrice(e.target.value)}
            className="select select-bordered bg-[#f8f7f4] border-gray-200 focus:outline-none rounded-xl h-9 min-h-0 text-sm w-full md:w-auto font-medium"
          >
            <option value="">Urutkan Harga</option>
            <option value="asc">Terendah - Tertinggi</option>
            <option value="desc">Tertinggi - Terendah</option>
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn h-9 min-h-0 border-none px-5 rounded-xl text-sm font-medium ${showFilters ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-800"}`}
          >
            {showFilters ? "Tutup Filter" : "Filter Spesifik"}
          </button>
        </div>
      </div>

      {/* Panel Filter Spesifik */}
      {showFilters && (
        <div className="mb-8 grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-3 bg-white py-4 px-5 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
          
          {/* KOTAK FILTER TIPE (NICHE/DESIGNER) */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 tracking-wider">
              Tipe Parfum
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="select select-bordered select-sm text-xs rounded-lg bg-[#f8f7f4] focus:outline-none"
            >
              <option value="">Semua Tipe</option>
              {availableTypes?.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 tracking-wider">
              Aroma Notes
            </label>
            <select
              value={filterNotes}
              onChange={(e) => setFilterNotes(e.target.value)}
              className="select select-bordered select-sm text-xs rounded-lg bg-[#f8f7f4] focus:outline-none"
            >
              <option value="">Semua Notes</option>
              {availableNotes?.map((note, idx) => (
                <option key={idx} value={note}>
                  {note}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 tracking-wider">
              Sillage
            </label>
            <select
              value={filterSillage}
              onChange={(e) => setFilterSillage(e.target.value)}
              className="select select-bordered select-sm text-xs rounded-lg bg-[#f8f7f4] focus:outline-none"
            >
              <option value="">Semua Sillage</option>
              {availableSillage?.map((item, idx) => (
                <option key={idx} value={item}>
                  ⭐ {item}/10
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 tracking-wider">
              Projection
            </label>
            <select
              value={filterProjection}
              onChange={(e) => setFilterProjection(e.target.value)}
              className="select select-bordered select-sm text-xs rounded-lg bg-[#f8f7f4] focus:outline-none"
            >
              <option value="">Semua Projection</option>
              {availableProjection?.map((item, idx) => (
                <option key={idx} value={item}>
                  ⭐ {item}/10
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 tracking-wider">
              Longevity
            </label>
            <select
              value={filterLongevity}
              onChange={(e) => setFilterLongevity(e.target.value)}
              className="select select-bordered select-sm text-xs rounded-lg bg-[#f8f7f4] focus:outline-none"
            >
              <option value="">Semua Longevity</option>
              {availableLongevity?.map((item, idx) => (
                <option key={idx} value={item}>
                  ⭐ {item}/10
                </option>
              ))}
            </select>
          </div>
          
          <div className="col-span-2 md:col-span-5 mt-1 flex justify-end">
            <button
              onClick={() => {
                setFilterType(""); 
                setFilterSillage("");
                setFilterProjection("");
                setFilterLongevity("");
                setFilterNotes("");
                setSearchQuery("");
                setSortPrice("");
              }}
              className="text-[11px] font-bold text-red-500 hover:text-red-700 hover:underline"
            >
              Reset Filter
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FilteringProduct;