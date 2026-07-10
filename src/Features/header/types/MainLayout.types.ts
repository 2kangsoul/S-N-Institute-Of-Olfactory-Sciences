import React from "react";

export interface UseMainLayoutReturn {
  // State dasar
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Auth state
  isAuthenticated: boolean;
  user: any; // Mengikuti struktur dari useAuthStore Anda (bisa disesuaikan jika punya interface User khusus)
  logout: () => void;

  // --- STATE MODAL BARU ---
  isManageMenuOpen: boolean;
  setIsManageMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  
  isPerfumeModalOpen: boolean;
  setIsPerfumeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  
  isBlogModalOpen: boolean;
  setIsBlogModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}