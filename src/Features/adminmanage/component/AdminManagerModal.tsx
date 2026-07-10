// @ts-nocheck
/* eslint-disable */
import React from "react";
import type { AdminManagerModalProps } from "../types/adminManagerTypes";
import { useAdminManager } from "../hooks/useAdminManager";
import AdminForm from "./AdminForm";
import AdminList from "./AdminList";

export default function AdminManagerModal({
  isOpen,
  onClose,
}: AdminManagerModalProps) {
  const {
    admins,
    isLoading,
    isFetching,
    activeForm,
    setActiveForm,
    formData,
    setFormData,
    existingFormData,
    setExistingFormData,
    handleAddAdmin,
    handleMakeAdmin,
    handleDeleteAdmin,
  } = useAdminManager(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      {/* Container Modal */}
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-6 md:p-8 m-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam modal menutup modal
      >
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
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

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            ⚙️ Manajemen Admin
          </h2>
          <p className="text-sm text-gray-500">
            Kelola akses administrator untuk butik SNN Institute Of Olfactory Sciences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* BAGIAN KIRI: Form Dinamis (Tambah Admin / Jadikan Admin) */}
          <AdminForm
            activeForm={activeForm}
            setActiveForm={setActiveForm}
            formData={formData}
            setFormData={setFormData}
            existingFormData={existingFormData}
            setExistingFormData={setExistingFormData}
            handleAddAdmin={handleAddAdmin}
            handleMakeAdmin={handleMakeAdmin}
            isLoading={isLoading}
          />

          {/* BAGIAN KANAN: Daftar Admin */}
          <AdminList
            admins={admins}
            isFetching={isFetching}
            handleDeleteAdmin={handleDeleteAdmin}
          />
        </div>
      </div>
    </div>
  );
}
