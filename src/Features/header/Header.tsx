import { useState } from "react"; // <-- TAMBAHAN: Import useState
import { Link } from "react-router-dom";
import type { UseMainLayoutReturn } from "../header/types/MainLayout.types";

import DesktopNav from "./DesktopNav";
import DesktopActions from "./DesktopActions";
import MobileMenu from "../../Features/header/component/MobileMenu";
import SettingsAccountModal from "../../Features/settingsaccountmodal/SettingsAccountModal"; 

// --- TAMBAHAN: Menambahkan tipe props baru agar TypeScript tidak merah ---
interface HeaderProps extends UseMainLayoutReturn {
  setIsRegisterModalOpen?: (val: boolean) => void;
  setIsAccountModalOpen?: (val: boolean) => void; 
  isAccountModalOpen?: boolean; 
}

export default function Header(props: HeaderProps) {
  // Hanya ambil isScrolled dan user dari props
  const { isScrolled, user } = props;

  // --- TAMBAHAN: Buat state lokal di sini agar modal bisa terbuka/tertutup ---
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  return (
    <>
      <header
        className={`flex justify-between items-center px-6 py-2 sticky top-0 z-50 transition-all duration-500 relative ${
          isScrolled
            ? "bg-[#f4f2ee]/90 backdrop-blur-md shadow-sm py-2"
            : "bg-transparent py-4"
        }`}
      >
        <Link to="/" className="flex-shrink-0">
          <img
            src="/SaaFragrance.png"
            alt="Saa Fragrance Logo"
            className="h-10 object-contain"
          />
        </Link>

        {/* Komponen Navigasi Desktop (Tengah) */}
        <DesktopNav />

        {/* Komponen Aksi Desktop (Kanan) */}
        {/* --- TAMBAHAN: Kirimkan fungsi setIsAccountModalOpen ke DesktopActions --- */}
        <DesktopActions 
          {...props} 
          setIsAccountModalOpen={setIsAccountModalOpen} 
        />

        {/* Komponen Menu Mobile (Tombol dan Dropdown) */}
        <MobileMenu {...props} />
      </header>

      {/* --- TAMBAHAN: Menampilkan Pop-up Account Settings --- */}
      <SettingsAccountModal
        isOpen={isAccountModalOpen} // <-- Menggunakan state lokal
        onClose={() => setIsAccountModalOpen(false)} // <-- Menggunakan state lokal
        user={user}
      />
    </>
  );
}