import React from "react";

export interface MobileMenuProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthenticated: boolean;
  user: any;
  logout: () => Promise<void>;
  setIsBlogModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
