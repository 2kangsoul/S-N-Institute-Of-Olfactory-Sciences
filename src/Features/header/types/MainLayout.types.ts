import React from "react";

export interface UseMainLayoutReturn {
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthenticated: boolean;
  user: any;
  logout: () => Promise<void>;
  isBlogModalOpen: boolean;
  setIsBlogModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
