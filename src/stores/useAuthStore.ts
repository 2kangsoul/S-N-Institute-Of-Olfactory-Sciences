import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "../config/api";

interface UserData {
  fullname?: string;
  name?: string;
  email?: string;
  address?: string;
  no_handphone?: string;
  objectId: string;
  id?: string;
  userToken: string;
  role?: string;
  profilePic?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  setAuth: (userData: UserData) => void;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      setAuth: (userData) => set({ isAuthenticated: true, user: userData }),
      logout: () => set({ isAuthenticated: false, user: null }),

      fetchCurrentUser: async () => {
        const currentUser = get().user;

        // Update: Memastikan ID (objectId) ada untuk fetch data
        if (!currentUser?.userToken || !currentUser?.objectId) return;

        try {
          console.groupCollapsed(
            `🔐 [AuthStore] Sesi Aktif: ${currentUser.name || "User"}`,
          );

          // Update: Endpoint disesuaikan ke Express.js
          const response = await apiClient.get(
            `/users/${currentUser.objectId}`,
          );

          console.log("✅ Data dari DB:", response.data);

          set({
            user: {
              ...currentUser,
              name: response.data.fullName || currentUser.name,
              email: response.data.email,
              address: response.data.address,
              no_handphone: response.data.no_handphone,
              objectId: response.data.id || currentUser.objectId,
              role: response.data.role || "user",
              profilePic: response.data.profilePic || currentUser.profilePic,
              userToken: currentUser.userToken,
            },
          });

          console.groupEnd();
        } catch (error: any) {
          console.error("❌ [AuthStore] Gagal mengambil data:", error);

          if (error.response?.status === 401) {
            get().logout();
          }
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user
          ? {
              userToken: state.user.userToken,
              objectId: state.user.objectId,
            }
          : null,
      }),
    },
  ),
);