"use client";

import { useState } from "react";
import Link from "next/link";
import type { UseMainLayoutReturn } from "../header/types/MainLayout.types";

import DesktopNav from "./DesktopNav";
import DesktopActions from "./DesktopActions";
import MobileMenu from "../../Features/header/component/MobileMenu";
import SettingsAccountModal from "../../Features/settingsaccountmodal/SettingsAccountModal";

import { useMe, useLogout } from "@/src/Features/Auth/auth.query";

interface HeaderProps extends UseMainLayoutReturn {
  setIsRegisterModalOpen?: (val: boolean) => void;
  setIsAccountModalOpen?: (val: boolean) => void;
  isAccountModalOpen?: boolean;
}

export default function Header(props: HeaderProps) {
  const { isScrolled } = props;

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const { data: user, isLoading } = useMe();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <>
      <header
        className={`flex justify-between items-center px-6 sticky top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#000000]/90 backdrop-blur-md shadow-sm py-1"
            : "bg-transparent py-2"
        }`}
      >
        <Link href="/" className="flex-shrink-0">
          <img
            src="/SNN.jpeg"
            alt="SNN Institute Of Olfactory Sciences Logo"
            className="h-10 transition duration-300 hover:brightness-110 object-contain"
          />
        </Link>

        <DesktopNav />

        <DesktopActions
          {...props}
          user={user}
          isAuthenticated={!!user}
          logout={handleLogout}
          setIsAccountModalOpen={setIsAccountModalOpen}
        />

        <MobileMenu
          {...props}
          user={user}
          isAuthenticated={!!user}
          logout={handleLogout}
        />
      </header>

      {isAccountModalOpen && (
        <SettingsAccountModal
          isOpen={isAccountModalOpen}
          onClose={() => setIsAccountModalOpen(false)}
          user={user}
        />
      )}
    </>
  );
}
