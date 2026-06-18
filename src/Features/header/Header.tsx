import { useState } from "react";
import { Link } from "react-router-dom";
import type { UseMainLayoutReturn } from "../header/types/MainLayout.types";

import DesktopNav from "./DesktopNav";
import DesktopActions from "./DesktopActions";
import MobileMenu from "../../Features/header/component/MobileMenu";
import SettingsAccountModal from "../../Features/settingsaccountmodal/SettingsAccountModal";

interface HeaderProps extends UseMainLayoutReturn {
  setIsRegisterModalOpen?: (val: boolean) => void;
  setIsAccountModalOpen?: (val: boolean) => void;
  isAccountModalOpen?: boolean;
}

export default function Header(props: HeaderProps) {
  const { isScrolled, user } = props;

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  return (
    <>
      <header
        // Mengurangi py-4 menjadi py-2 dan py-2 menjadi py-1 agar header lebih tipis
        className={`flex justify-between items-center px-6 sticky top-0 z-50 transition-all duration-500 relative ${
          isScrolled
            ? "bg-[#f4f2ee]/90 backdrop-blur-md shadow-sm py-1"
            : "bg-transparent py-2"
        }`}
      >
        <Link to="/" className="flex-shrink-0">
          <img
            src="/SaaFragrance.png"
            alt="Saa Fragrance Logo"
            className="h-8 object-contain" // Sedikit diperkecil dari h-10 ke h-8 agar proporsional
          />
        </Link>

        {/* Komponen Navigasi Desktop (Tengah) */}
        <DesktopNav />

        {/* Komponen Aksi Desktop (Kanan) */}
        <DesktopActions
          {...props}
          setIsAccountModalOpen={setIsAccountModalOpen}
        />

        {/* Komponen Menu Mobile (Tombol dan Dropdown) */}
        <MobileMenu {...props} />
      </header>

      {/* --- TAMBAHAN: Menampilkan Pop-up Account Settings --- */}
      <SettingsAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        user={user}
      />
    </>
  );
}
