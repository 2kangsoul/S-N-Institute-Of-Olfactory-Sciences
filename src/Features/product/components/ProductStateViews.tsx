// File: src/Features/product/components/ProductStateViews.tsx
import React from "react";

// Komponen Tampilan Loading
export const LoadingView: React.FC = () => (
  <div className="flex justify-center items-center h-64">
    <span className="loading loading-spinner loading-lg text-gray-900"></span>
  </div>
);

// Komponen Tampilan Error
interface ErrorViewProps {
  error: string;
}
export const ErrorView: React.FC<ErrorViewProps> = ({ error }) => (
  <div className="alert alert-error shadow-lg max-w-lg mx-auto">
    <span>{error}</span>
  </div>
);

// Komponen Tampilan Tidak Ditemukan (Empty State)
export const EmptyView: React.FC = () => (
  <div className="text-center py-20">
    <h3 className="text-xl font-bold text-gray-800">Parfum tidak ditemukan</h3>
    <p className="text-gray-500 mt-2">
      Coba sesuaikan filter atau kata kunci pencarian Anda.
    </p>
  </div>
);