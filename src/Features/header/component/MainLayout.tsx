// @ts-nocheck
/* eslint-disable */
import { useState } from "react"; // <-- TAMBAHAN: Import useState
import { Outlet } from "react-router-dom";
import { useMainLayout } from "../hooks/useMainLayout";

import AdminManagerModal from "../../adminmanage/component/AdminManagerModal";
import PerfumeManagerModal from "../../productmanage/component/PerfumeManagerModal";
import BlogManagerModal from "../../blogmanage/component/BlogManagerModal";

// --- TAMBAHAN: Import Register Modal dari folder Anda ---
import RegisterModal from "../../registermodal/RegisterModal";

import Header from "../Header";
import FooterLayout from "../FooterLayout";

export default function MainLayout() {
  const layoutState = useMainLayout();

  // --- TAMBAHAN: State khusus untuk membuka/menutup Register Modal ---
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#000000]">
      {/* Oper state tambahan setIsRegisterModalOpen ke Header */}
      <Header
        {...layoutState}
        setIsRegisterModalOpen={setIsRegisterModalOpen}
      />

      <main>
        <Outlet />
      </main>

      {/* SEMUA MODAL POPUP LAINNYA */}
      <AdminManagerModal
        isOpen={layoutState.isAdminModalOpen}
        onClose={() => layoutState.setIsAdminModalOpen(false)}
      />

      <PerfumeManagerModal
        isOpen={layoutState.isPerfumeModalOpen}
        onClose={() => layoutState.setIsPerfumeModalOpen(false)}
      />

      <BlogManagerModal
        isOpen={layoutState.isBlogModalOpen}
        onClose={() => layoutState.setIsBlogModalOpen(false)}
      />

      {/* --- TAMBAHAN: Render Register Modal di sini --- */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

      <FooterLayout />
    </div>
  );
}
