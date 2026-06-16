import type { MobileMenuProps } from "../types/MobileMenu.types";

export const useMobileMenu = (props: MobileMenuProps) => {
  // Fungsi untuk toggle (buka/tutup) menu hamburger
  const toggleMenu = () => props.setIsMobileMenuOpen(!props.isMobileMenuOpen);
  
  // Fungsi untuk menutup menu saat link/tombol diklik
  const closeMenu = () => props.setIsMobileMenuOpen(false);

  // Kumpulan fungsi aksi modal
  const handleManagePerfume = () => {
    closeMenu();
    props.setIsPerfumeModalOpen(true);
  };

  const handleManageBlog = () => {
    closeMenu();
    props.setIsBlogModalOpen(true);
  };

  const handleSettingAdmin = () => {
    closeMenu();
    props.setIsAdminModalOpen(true);
  };

  const handleLogout = () => {
    props.logout();
    closeMenu();
  };

  return {
    isMobileMenuOpen: props.isMobileMenuOpen,
    isAuthenticated: props.isAuthenticated,
    user: props.user,
    toggleMenu,
    closeMenu,
    handleManagePerfume,
    handleManageBlog,
    handleSettingAdmin,
    handleLogout,
  };
};