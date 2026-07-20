"use client";

import { useState } from "react";
import Link from "next/link";
import { useMobileMenu } from "../hooks/useMobileMenu";
import type { MobileMenuProps } from "../types/MobileMenu.types";

interface ExtendedMobileMenuProps extends MobileMenuProps {
  setIsRegisterModalOpen?: (val: boolean) => void;
}

export default function MobileMenu(props: ExtendedMobileMenuProps) {
  const { isMobileMenuOpen, isAuthenticated, user, toggleMenu, closeMenu, handleManageBlog, handleLogout } =
    useMobileMenu(props);

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="lg:hidden flex items-center gap-2">
      {isAuthenticated && (
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-600"
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
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg ring-1 ring-black/5 py-1.5 z-50 overflow-hidden">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.fullName}
                </p>
                {user?.role && (
                  <p className="text-xs text-gray-400 capitalize">
                    {user.role.toLowerCase().replace("_", " ")}
                  </p>
                )}
              </div>

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      <button className="p-2 text-gray-800 focus:outline-none" onClick={toggleMenu}>
        {isMobileMenuOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#f4f2ee]/95 backdrop-blur-md shadow-md border-t border-gray-200 flex flex-col px-6 py-6 gap-4 transition-all z-50">
          <Link href="/products" onClick={closeMenu} className="text-gray-800 font-medium hover:text-gray-500 transition-colors">
            Products
          </Link>
          <Link href="/team" onClick={closeMenu} className="text-gray-800 font-medium hover:text-gray-500 transition-colors">
            Team
          </Link>
          <Link href="/blog" onClick={closeMenu} className="text-gray-800 font-medium hover:text-gray-500 transition-colors">
            Blog
          </Link>
          <Link href="/aboutus" onClick={closeMenu} className="text-gray-800 font-medium hover:text-gray-500 transition-colors">
            About Us
          </Link>

          <div className="w-full border-t border-gray-300 my-2"></div>

          {isAuthenticated && (
            <button
              onClick={handleManageBlog}
              className="w-full text-left text-gray-800 font-medium hover:text-gray-500 transition-colors"
            >
              Tulis Blog
            </button>
          )}

          {!isAuthenticated && (
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={closeMenu}
                className="w-full text-center px-4 py-2 border border-gray-400 text-gray-800 font-medium rounded-md hover:bg-gray-50 transition-colors"
              >
                Sign in
              </Link>

              <button
                onClick={() => {
                  closeMenu();
                  if (props.setIsRegisterModalOpen) {
                    props.setIsRegisterModalOpen(true);
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
    </div>
  );
}