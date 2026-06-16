import type { PerfumeManagerModalProps } from "../types/types";
import { usePerfumeManager } from "../hooks/usePerfumeManager";
import PerfumeForm from "./PerfumeForm";
import PerfumeList from "./PerfumeList";

export default function PerfumeManagerModal({
  isOpen,
  onClose,
}: PerfumeManagerModalProps) {
  // Panggil semua state dan logic dari custom hook kita
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
  } = usePerfumeManager(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Container dikunci ukurannya agar pas di tengah layar */}
      <div
        className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol X (Tutup) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-bold text-gray-900">
            📦 Manajemen Parfum
          </h2>
        </div>

        {/* Layout Utama KIRI - KANAN (Tinggal memanggil komponen anak) */}
        <div className="grid grid-cols-2 min-h-0 bg-white">
          
          {/* ==================== KIRI: Komponen Form ==================== */}
          <PerfumeForm
            formData={formData}
            isLoading={isLoading}
            handleChange={handleChange}
            handleAddProduct={handleAddProduct}
          />

          {/* ==================== KANAN: Komponen List & Search ==================== */}
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
      </div>
    </div>
  );
}