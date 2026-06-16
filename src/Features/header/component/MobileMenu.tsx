import { Link } from "react-router-dom";
import { useMobileMenu } from "../hooks/useMobileMenu";
import type { MobileMenuProps } from "../types/MobileMenu.types";

// Menambahkan fungsi pop-up register ke dalam tipe props
interface ExtendedMobileMenuProps extends MobileMenuProps {
  setIsRegisterModalOpen?: (val: boolean) => void;
}

export default function MobileMenu(props: ExtendedMobileMenuProps) {
  // Ambil data dan fungsi bersih dari custom hook
  const {
    isMobileMenuOpen,
    isAuthenticated,
    user,
    toggleMenu,
    closeMenu,
    handleManagePerfume,
    handleManageBlog,
    handleSettingAdmin,
    handleLogout,
  } = useMobileMenu(props);

  return (
    <>
      {/* TOMBOL MENU MOBILE */}
      <button
        className="lg:hidden p-2 text-gray-800 focus:outline-none"
        onClick={toggleMenu}
      >
        {isMobileMenuOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* MENU MOBILE */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#f4f2ee]/95 backdrop-blur-md shadow-md border-t border-gray-200 flex flex-col px-6 py-6 gap-4 transition-all z-50">
          <Link
            to="/products"
            onClick={closeMenu}
            className="text-gray-800 font-medium hover:text-gray-500 transition-colors"
          >
            Products
          </Link>
          <Link
            to="/team"
            onClick={closeMenu}
            className="text-gray-800 font-medium hover:text-gray-500 transition-colors"
          >
            Team
          </Link>
          <Link
            to="/blog"
            onClick={closeMenu}
            className="text-gray-800 font-medium hover:text-gray-500 transition-colors"
          >
            Blog
          </Link>
           <Link
            to="/aboutus"
            onClick={closeMenu}
            className="text-gray-800 font-medium hover:text-gray-500 transition-colors"
          >
            About Us
          </Link>

          <div className="w-full border-t border-gray-300 my-2"></div>

          {isAuthenticated ? (
            <div className="flex flex-col gap-4">
              <span className="font-medium text-gray-800">
                Hai, {user?.name}
              </span>

              {/* LOGIKA ROLE UNTUK MOBILE */}
              {user?.role === "owner" || user?.role === "admin" ? (
                <div className="flex flex-col gap-3 pl-3 border-l-2 border-gray-300">
                  <button
                    onClick={handleManagePerfume}
                    className="w-max px-4 py-2 bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors rounded-md text-sm"
                  >
                    📦 Manage Parfume
                  </button>

                  <button
                    onClick={handleManageBlog}
                    className="w-max px-4 py-2 bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors rounded-md text-sm"
                  >
                    ✍️ Manage Blog
                  </button>

                  {user?.role === "owner" && (
                    <button
                      onClick={handleSettingAdmin}
                      className="w-max px-4 py-2 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors rounded-md text-sm"
                    >
                      ⚙️ Setting Admin
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleManageBlog}
                  className="w-max px-4 py-2 bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors rounded-md text-sm"
                >
                  ✍️ Manage Blog
                </button>
              )}

              <button
                onClick={handleLogout}
                className="w-max px-4 py-2 text-red-500 font-bold bg-red-50 hover:bg-red-100 transition-colors rounded-md"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                onClick={closeMenu}
                className="w-full text-center px-4 py-2 border border-gray-400 text-gray-800 font-medium rounded-md hover:bg-gray-50 transition-colors"
              >
                Sign in
              </Link>
              
              {/* --- PERBAIKAN: Link Register diubah menjadi Button Modal --- */}
              <button
                onClick={() => {
                  closeMenu(); // Tutup menu mobile dulu
                  if (props.setIsRegisterModalOpen) {
                    props.setIsRegisterModalOpen(true); // Lalu buka modal register
                  }
                }}
                className="w-full text-center px-4 py-2 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}