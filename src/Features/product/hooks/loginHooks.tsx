// File: src/Features/product/hooks/loginHooks.tsx
import { useState } from "react";
import { useAuthStore } from "../../../stores/useAuthStore"; // <-- TAMBAHAN: Import global auth
import type { LoginHookReturn } from "../types/loginTypes"; 

// Terapkan tipe balikan (return type) ke Custom Hook
export const useLoginState = (): LoginHookReturn => {
  // --- UPDATE: Mengambil status login asli dari global state Zustand ---
  const { isAuthenticated } = useAuthStore(); 
  
  // --- STATE UNTUK FITUR LOGIN MODAL ---
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const handleAddToCart = () => {
    // UPDATE: Gunakan isAuthenticated dari Zustand
    if (!isAuthenticated) { 
      setShowLoginModal(true);
    } else {
      console.log("Produk berhasil ditambahkan ke keranjang!");
    }
  };

  return {
    isLoggedIn: isAuthenticated, // <-- Hubungkan ke global state
    setIsLoggedIn: () => {},     // <-- Fungsi kosong agar TypeScript tidak error karena interface meminta fungsi ini
    showLoginModal,
    setShowLoginModal,
    handleAddToCart,
  };
};