import React from "react";

export interface MobileMenuProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthenticated: boolean;
  user: any;
  logout: () => void;
  setIsAdminModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPerfumeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsBlogModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}