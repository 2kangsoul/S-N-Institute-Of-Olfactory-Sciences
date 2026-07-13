import { useState, useEffect } from "react";
import { useAuthStore } from "../../../stores/useAuthStore";
import type { UseMainLayoutReturn } from "../types/MainLayout.types";

export const useMainLayout = (): UseMainLayoutReturn => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);

  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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
    isBlogModalOpen,
    setIsBlogModalOpen,
  };
};
