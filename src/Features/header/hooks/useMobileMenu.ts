import type { MobileMenuProps } from "../types/MobileMenu.types";

export const useMobileMenu = (props: MobileMenuProps) => {
  const toggleMenu = () => props.setIsMobileMenuOpen(!props.isMobileMenuOpen);
  const closeMenu = () => props.setIsMobileMenuOpen(false);

  const handleManageBlog = () => {
    closeMenu();
    props.setIsBlogModalOpen(true);
  };

  const handleLogout = () => {
    void props.logout();
    closeMenu();
  };

  return {
    isMobileMenuOpen: props.isMobileMenuOpen,
    isAuthenticated: props.isAuthenticated,
    user: props.user,
    toggleMenu,
    closeMenu,
    handleManageBlog,
    handleLogout,
  };
};
