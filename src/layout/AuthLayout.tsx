"use client";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../stores/useAuthStore";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAuthLoading, fetchCurrentUser } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  // Hindari mismatch SSR: evaluasi auth hanya setelah ter-mount di client
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Verifikasi sesi ke server (cookie httpOnly) tiap kali layout ini mount.
  // Ini juga yang jadi pengganti "Sensor Anti-Hapus Local Storage" versi lama —
  // sekarang tidak ada apa pun yang perlu dijaga di localStorage, karena token
  // memang tidak pernah ada di sana. Status login selalu ditentukan oleh server.
  useEffect(() => {
    fetchCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // =========================================================================
  // LOGIKA PENGUNCIAN HALAMAN (GUEST vs PRIVATE)
  // =========================================================================

  const guestOnlyRoutes = ["/login", "/register"];
  const publicRoutes = ["/"];

  // SKENARIO A: Orang SUDAH LOGIN, tapi iseng tekan tombol Back ke /login atau /register
  const redirectHome = isAuthenticated && guestOnlyRoutes.includes(pathname);

  // SKENARIO B: Orang BELUM LOGIN, tapi maksa mau masuk ke halaman dalam
  const redirectLogin =
    !isAuthenticated &&
    !guestOnlyRoutes.includes(pathname) &&
    !publicRoutes.includes(pathname);

  useEffect(() => {
    // Tunggu fetchCurrentUser() ke server selesai dulu sebelum memutuskan redirect,
    // supaya user yang sebenarnya masih login (cookie valid) tidak sempat
    // "terlempar" ke /login cuma karena request /auth/me belum selesai.
    if (!mounted || isAuthLoading) return;
    if (redirectHome) router.replace("/");
    else if (redirectLogin) router.replace("/login");
  }, [mounted, isAuthLoading, redirectHome, redirectLogin, router]);

  if (!mounted || isAuthLoading || redirectHome || redirectLogin) return null;

  return <>{children}</>;
}