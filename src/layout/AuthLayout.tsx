"use client";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../stores/useAuthStore";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, user, fetchCurrentUser } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  // Hindari mismatch SSR: evaluasi auth hanya setelah ter-mount di client
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Sensor Auto-Restore saat Refresh
  useEffect(() => {
    // Update: Memastikan pengecekan userToken dan name/email sinkron dengan store baru
    if (isAuthenticated && user?.userToken && !user?.name) {
      fetchCurrentUser();
    }
  }, [isAuthenticated, user, fetchCurrentUser]);

  // Sensor Anti-Hapus Local Storage
  useEffect(() => {
    if (isAuthenticated) {
      const checkStorage = localStorage.getItem("auth-storage");
      if (!checkStorage) {
        useAuthStore.setState({ isAuthenticated, user });
      }
    }
  }, [pathname, isAuthenticated, user]);

  // =========================================================================
  // LOGIKA PENGUNCIAN HALAMAN (GUEST vs PRIVATE)
  // =========================================================================

  const guestOnlyRoutes = ["/login", "/register"];
  const publicRoutes = ["/"];

  // SKENARIO A: Orang SUDAH LOGIN, tapi iseng tekan tombol Back ke /login atau /register
  const redirectHome =
    isAuthenticated && guestOnlyRoutes.includes(pathname);

  // SKENARIO B: Orang BELUM LOGIN, tapi maksa mau masuk ke halaman dalam
  const redirectLogin =
    !isAuthenticated &&
    !guestOnlyRoutes.includes(pathname) &&
    !publicRoutes.includes(pathname);

  useEffect(() => {
    if (!mounted) return;
    if (redirectHome) router.replace("/");
    else if (redirectLogin) router.replace("/login");
  }, [mounted, redirectHome, redirectLogin, router]);

  if (!mounted || redirectHome || redirectLogin) return null;

  return <>{children}</>;
}
