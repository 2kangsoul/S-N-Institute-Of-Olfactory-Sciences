"use client";

import { useState } from "react";
import Link from "next/link";
import type { UseMainLayoutReturn } from "../header/types/MainLayout.types";

interface DesktopActionsProps extends UseMainLayoutReturn {
  setIsRegisterModalOpen?: (val: boolean) => void;
  setIsAccountModalOpen?: (val: boolean) => void;
}

export default function DesktopActions(props: DesktopActionsProps) {
  const { isAuthenticated, user, logout } = props;

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="hidden lg:flex items-center gap-3 text-xs font-medium">
      {isAuthenticated ? (
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
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
            </div>
            <span className="text-sm font-medium text-gray-100">
              {user?.fullName}
            </span>
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
                  logout();
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <Link
            href="/login"
            className="px-3 py-1 border text-black border-gray-300 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Sign in
          </Link>

          <Link
            href="/register"
            className="px-3 py-1 bg-gray-100 text-black rounded-md hover:bg-gray-200 transition-colors"
          >
            Register
          </Link>
        </>
      )}
    </div>
  );
}