"use client";

import { useState } from "react";
import Link from "next/link";
import type { UseMainLayoutReturn } from "../header/types/MainLayout.types";

import DesktopNav from "./DesktopNav";
import DesktopActions from "./DesktopActions";
import MobileMenu from "../../Features/header/component/MobileMenu";
import SettingsAccountModal from "../../Features/settingsaccountmodal/SettingsAccountModal";

interface HeaderProps extends UseMainLayoutReturn {
  setIsRegisterModalOpen?: (val: boolean) => void;
  setIsAccountModalOpen?: (val: boolean) => void;
  isAccountModalOpen?: boolean;
}

// ponytail: Header dulu baca auth dari useMe() (React Query) dan MENIMPA props
// dari useMainLayout (Zustand) — dua sumber kebenaran yang gak pernah sinkron,
// jadi login via Zustand gak ke-reflect di navbar. Sekarang cuma pakai Zustand
// (isAuthenticated/user/logout) yang sudah mengalir lewat props, sama seperti
// 14 tempat lain di app. Satu sumber kebenaran.
export default function Header(props: HeaderProps) {
  const { isScrolled } = props;

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

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
          setIsAccountModalOpen={setIsAccountModalOpen}
        />

        <MobileMenu {...props} />
      </header>

      {isAccountModalOpen && (
        <SettingsAccountModal
          isOpen={isAccountModalOpen}
          onClose={() => setIsAccountModalOpen(false)}
          user={props.user}
        />
      )}
    </>
  );
}
