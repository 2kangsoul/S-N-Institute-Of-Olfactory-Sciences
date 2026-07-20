import { create } from "zustand";
import apiClient from "../config/api";

interface UserData {
  fullname?: string;
  fullName?: string;
  username?: string;
  name?: string;
  email?: string;
  address?: string;
  country?: string;
  no_handphone?: string;
  objectId: string;
  id?: string;
  role?: string;
  profilePic?: string;
  // userToken DIHAPUS: token sekarang cuma hidup di cookie httpOnly milik backend,
  // JS di browser tidak pernah (dan tidak boleh) bisa membacanya.
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  // true selama pengecekan sesi awal (fetchCurrentUser) sedang berjalan.
  // Dipakai route guard (AuthLayout/AdminLayout) supaya tidak salah redirect
  // ke /login sebelum kita sempat tahu cookie-nya valid atau tidak.
  isAuthLoading: boolean;
  setAuth: (userData: UserData) => void;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

// CATATAN MIGRASI AUTH (httpOnly cookie):
// Store ini SENGAJA tidak lagi dibungkus `persist`/localStorage seperti versi lama
// (key "auth-storage"). Sumber kebenaran sesi login sekarang murni cookie httpOnly
// "token" yang dikelola backend — store ini cuma cache di memori untuk sesi berjalan,
// dan selalu diverifikasi ulang ke server lewat fetchCurrentUser() (dipanggil di
// app/providers.tsx setiap kali aplikasi pertama kali dimuat).
export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  user: null,
  isAuthLoading: true,

  setAuth: (userData) => set({ isAuthenticated: true, user: userData }),

  logout: async () => {
    try {
      // Cookie httpOnly tidak bisa dihapus dari JS — harus lewat request
      // ke backend supaya Set-Cookie dengan maxAge kadaluarsa dikirim balik.
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Gagal logout di server:", error);
    } finally {
      set({ isAuthenticated: false, user: null });
    }
  },

  fetchCurrentUser: async () => {
    set({ isAuthLoading: true });
    try {
      // Tidak perlu cek token apa pun di client dulu — cookie httpOnly otomatis
      // ikut terkirim (withCredentials di api.ts). Backend yang menentukan valid/tidak.
      const response = await apiClient.get("/auth/me");
      const data = response.data?.data || response.data;

      set({
        isAuthenticated: true,
        user: {
          fullname: data.fullName,
          fullName: data.fullName,
          name: data.fullName,
          username: data.username,
          email: data.email,
          address: data.address,
          country: data.country,
          no_handphone: data.no_handphone,
          objectId: data.id,
          id: data.id,
          role: data.role || "user",
          profilePic: data.profilePic,
        },
      });
    } catch (error) {
      // 401/403 di sini wajar — artinya memang belum login / cookie sudah tidak valid,
      // bukan error tak terduga.
      set({ isAuthenticated: false, user: null });
    } finally {
      set({ isAuthLoading: false });
    }
  },
}));
