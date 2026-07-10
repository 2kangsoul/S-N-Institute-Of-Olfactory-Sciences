import { useState, useEffect } from "react";
import { useAuthStore } from "../../../stores/useAuthStore"; 
import type { UseMainLayoutReturn } from "../types/MainLayout.types";

export const useMainLayout = (): UseMainLayoutReturn => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- STATE MODAL YANG DIPINDAHKAN DARI MAINLAYOUT.TSX ---
  const [isManageMenuOpen, setIsManageMenuOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isPerfumeModalOpen, setIsPerfumeModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);

  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return {
    isScrolled,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isAuthenticated,
    user,
    logout,
    // --- RETURN STATE MODAL BARU ---
    isManageMenuOpen,
    setIsManageMenuOpen,
    isAdminModalOpen,
    setIsAdminModalOpen,
    isPerfumeModalOpen,
    setIsPerfumeModalOpen,
    isBlogModalOpen,
    setIsBlogModalOpen,
  };
};