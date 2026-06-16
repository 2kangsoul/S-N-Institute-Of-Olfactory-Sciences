// File: src/Features/product/components/componentLogin.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../stores/useAuthStore"; // Pastikan path ini sesuai
import apiClient from "../../../config/api"; // Pastikan path ini sesuai
import type { ComponentLoginProps } from "../types/loginTypes"; 

const ComponentLogin: React.FC<ComponentLoginProps> = ({
  showLoginModal,
  setShowLoginModal,
}) => {
  // --- TAMBAHAN: State untuk menangani input form ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- TAMBAHAN: Panggil Zustand store ---
  const { setAuth } = useAuthStore();

  if (!showLoginModal) return null;

  // --- TAMBAHAN: Fungsi eksekusi login ke backend Express ---
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Email dan password harus diisi");
      return;
    }

    try {
      setIsLoading(true);
      const res = await apiClient.post("/auth/login", {
        emailOrUsername: email,
        password: password,
      });

      toast.success("Login berhasil!");

      const userData = res?.data?.data;
      const userRole = userData?.role || "user";

      // Simpan ke global state Zustand
      setAuth({
        name: userData?.fullName || email.split("@")[0],
        email: userData?.email,
        objectId: userData?.id,
        userToken: res?.data?.token,
        role: userRole,
        profilePic: userData?.profilePic || "",
      });

      // Tutup modal setelah login berhasil
      setShowLoginModal(false);
    } catch (error: any) {
      console.error("Login gagal di modal", error);
      toast.error(
        error.response?.data?.message || "Gagal login, periksa kembali email & password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
      <div className="bg-white relative rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-500 hover:bg-gray-100"
          onClick={() => setShowLoginModal(false)}
        >
          ✕
        </button>

        <div className="text-center mb-6 mt-2">
          <h3 className="font-bold text-2xl text-gray-900 mb-2">
            Sign in required
          </h3>
          <p className="text-sm text-gray-500">
            Silakan masuk untuk menambahkan parfum incaran ke keranjang Anda.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="label text-xs font-semibold text-gray-600 px-1 py-1">
              Email
            </label>
            <input
              type="email"
              value={email} // <-- UPDATE: Bind state email
              onChange={(e) => setEmail(e.target.value)} // <-- UPDATE: Handle perubahan teks
              placeholder="Masukkan email Anda"
              className="input input-bordered w-full bg-[#f8f7f4] border-gray-200 focus:outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="label text-xs font-semibold text-gray-600 px-1 py-1">
              Password
            </label>
            <input
              type="password"
              value={password} // <-- UPDATE: Bind state password
              onChange={(e) => setPassword(e.target.value)} // <-- UPDATE: Handle perubahan teks
              placeholder="Masukkan kata sandi"
              className="input input-bordered w-full bg-[#f8f7f4] border-gray-200 focus:outline-none focus:border-gray-400"
            />
          </div>

          <button 
            onClick={handleLogin} // <-- UPDATE: Pasang event klik
            disabled={isLoading} // <-- UPDATE: Disable saat loading
            className="btn bg-gray-900 text-white hover:bg-black border-none w-full mt-4 rounded-xl cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Memproses..." : "Sign in"} 
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link
            to="/register"
            onClick={() => setShowLoginModal(false)} // <-- UPDATE: Tutup modal otomatis jika klik daftar
            className="text-gray-900 font-bold hover:underline transition-all"
          >
            Daftar sekarang
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComponentLogin;