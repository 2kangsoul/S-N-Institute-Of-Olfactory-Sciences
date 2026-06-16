import { useState } from "react";
import { Link } from "react-router-dom";
import type { UseMainLayoutReturn } from "../header/types/MainLayout.types";

// Menambahkan fungsi pop-up register dan account ke dalam tipe props
interface DesktopActionsProps extends UseMainLayoutReturn {
  setIsRegisterModalOpen?: (val: boolean) => void;
  setIsAccountModalOpen?: (val: boolean) => void; // <-- Perbaikan baris 8
}

export default function DesktopActions(props: DesktopActionsProps) {
  const {
    isAuthenticated,
    user,
    logout,
    isManageMenuOpen,
    setIsManageMenuOpen,
    setIsAdminModalOpen,
    setIsPerfumeModalOpen,
    setIsBlogModalOpen,
    setIsRegisterModalOpen,
    setIsAccountModalOpen, // <-- Perbaikan baris 20
  } = props;

  // State lokal untuk mengontrol dropdown akun
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  return (
    <div className="hidden lg:flex items-center gap-3 text-xs font-medium">
      {isAuthenticated ? (
        <div className="flex items-center gap-4">
          {/* --- BAGIAN YANG DIUBAH: Dropdown Hai, {user?.name} --- */}
          <div className="relative">
            <button
              onClick={() => {
                setIsAccountMenuOpen(!isAccountMenuOpen);
                // Menutup menu Manage jika sedang terbuka
                if (setIsManageMenuOpen) setIsManageMenuOpen(false);
              }}
              className="text-sm font-medium text-gray-800 hover:text-gray-600 flex items-center gap-1 cursor-pointer"
            >
              Hai, {user?.name || user?.fullname || "..."}
              {/* Lingkaran Foto Profil - DITAMBAHKAN SESUAI PERMINTAAN */}
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300 flex items-center justify-center flex-shrink-0 ml-1">
                {user?.profilePic ? (
                  <img
                    src={`${user.profilePic}?t=${new Date().getTime()}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isAccountMenuOpen && (
              <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50 flex flex-col">
                <button
                  onClick={() => {
                    setIsAccountMenuOpen(false);
                    if (setIsAccountModalOpen) setIsAccountModalOpen(true);
                  }}
                  className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium"
                >
                  ⚙️ Account Setting
                </button>
              </div>
            )}
          </div>
          {/* --- AKHIR BAGIAN YANG DIUBAH --- */}

          {/* LOGIKA ROLE UNTUK DESKTOP */}
          {user?.role === "owner" || user?.role === "admin" ? (
            <div className="relative">
              <button
                onClick={() => {
                  if (setIsManageMenuOpen)
                    setIsManageMenuOpen(!isManageMenuOpen);
                  // Menutup menu Account jika sedang terbuka
                  setIsAccountMenuOpen(false);
                }}
                className="flex items-center gap-1 px-3 py-1 bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors rounded-md"
              >
                Manage
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isManageMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50 flex flex-col">
                  <button
                    onClick={() => {
                      if (setIsManageMenuOpen) setIsManageMenuOpen(false);
                      if (setIsPerfumeModalOpen) setIsPerfumeModalOpen(true);
                    }}
                    className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium"
                  >
                    📦 Manage Parfume
                  </button>

                  <button
                    onClick={() => {
                      if (setIsManageMenuOpen) setIsManageMenuOpen(false);
                      if (setIsBlogModalOpen) setIsBlogModalOpen(true);
                    }}
                    className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium border-t border-gray-100"
                  >
                    ✍️ Manage Blog
                  </button>

                  {user?.role === "owner" && (
                    <button
                      onClick={() => {
                        if (setIsManageMenuOpen) setIsManageMenuOpen(false);
                        if (setIsAdminModalOpen) setIsAdminModalOpen(true);
                      }}
                      className="text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium border-t border-gray-100"
                    >
                      ⚙️ Setting Admin
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                if (setIsBlogModalOpen) setIsBlogModalOpen(true);
                setIsAccountMenuOpen(false);
              }}
              className="flex items-center gap-1 px-3 py-1 bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors rounded-md"
            >
              ✍️ Manage Blog
            </button>
          )}

          <button
            onClick={logout}
            className="px-3 py-1 text-red-500 font-bold hover:bg-red-50 hover:text-red-700 transition-colors rounded-md"
          >
            Logout
          </button>
        </div>
      ) : (
        <>
          <Link
            to="/login"
            className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Sign in
          </Link>

          <button
            onClick={() =>
              setIsRegisterModalOpen && setIsRegisterModalOpen(true)
            }
            className="px-3 py-1 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Register
          </button>
        </>
      )}
    </div>
  );
}
