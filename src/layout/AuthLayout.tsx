import { useEffect } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

export default function AuthLayout() {
  const { isAuthenticated, user, fetchCurrentUser } = useAuthStore();
  const location = useLocation();

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
  }, [location.pathname, isAuthenticated, user]);

  // =========================================================================
  // LOGIKA PENGUNCIAN HALAMAN (GUEST vs PRIVATE)
  // =========================================================================

  const guestOnlyRoutes = ["/login", "/register"];
  const publicRoutes = ["/"]; 

  // SKENARIO A: Orang SUDAH LOGIN, tapi iseng tekan tombol Back ke /login atau /register
  if (isAuthenticated && guestOnlyRoutes.includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  // SKENARIO B: Orang BELUM LOGIN, tapi maksa mau masuk ke halaman dalam
  if (
    !isAuthenticated &&
    !guestOnlyRoutes.includes(location.pathname) &&
    !publicRoutes.includes(location.pathname)
  ) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}