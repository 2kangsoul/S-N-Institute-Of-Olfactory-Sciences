"use client";

import { usePerfumeManager } from "../hooks/usePerfumeManager";
import PerfumeForm from "./PerfumeForm";
import PerfumeList from "./PerfumeList";

export default function PerfumeManagerPage() {
  const {
    isFetching,
    isLoading,
    formData,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    handleChange,
    handleAddProduct,
    handleDeleteProduct,
    currentProducts,
  } = usePerfumeManager();

  return (
    <section className="flex flex-1 flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Manajemen Produk</h1>
        <p className="mt-1 text-sm text-slate-400">
          Tambah, cari, dan kelola katalog parfum.
        </p>
      </div>

      <div className="grid min-h-0 overflow-hidden rounded-xl border border-slate-800 bg-white lg:grid-cols-2">
        <PerfumeForm
          formData={formData}
          isLoading={isLoading}
          handleChange={handleChange}
          handleAddProduct={handleAddProduct}
        />
        <PerfumeList
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isFetching={isFetching}
          currentProducts={currentProducts}
          handleDeleteProduct={handleDeleteProduct}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </div>
    </section>
  );
}
