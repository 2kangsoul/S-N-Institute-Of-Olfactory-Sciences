// @ts-nocheck
/* eslint-disable */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../stores/useAuthStore";
import apiClient from "../config/api"; // UPDATE: Menggunakan apiClient

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email tidak boleh kosong" })
    .email({ message: "Format email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal harus 6 karakter" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  // Panggil setAuth DAN isAuthenticated dari Zustand
  const { setAuth, isAuthenticated } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      // UPDATE: Endpoint disesuaikan untuk Express.js
      const res = await apiClient.post("/auth/login", {
        emailOrUsername: data.email,
        password: data.password,
      });

      toast.success("Login successfully");

      // UPDATE: Menyesuaikan pengambilan data dari format Express (res.data.data)
      const userData = res.data.data;
      const userRole = userData?.role || "user";

      setAuth({
        name: userData?.fullName || data.email.split("@")[0],
        email: userData?.email,
        objectId: userData?.id, // ID dari MongoDB/Postgres
        userToken: res.data.token, // Token dari Express
        role: userRole,
        profilePic: userData?.profilePic || "",
      });

      // Pindah ke halaman utama dan MELAKUKAN FULL REFRESH
      if (userRole === "admin" || userRole === "owner") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    } catch (error: any) {
      console.error("Login gagal", error);
      toast.error(
        error.response?.data?.message ||
          "Gagal login, periksa kembali email & password Anda",
      );
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] dark:bg-[#161722] px-4 transition-colors duration-300">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#25273D] p-8 shadow-xl border border-gray-100 dark:border-gray-800">
        <h2 className="mb-2 text-center text-3xl font-bold text-gray-800 dark:text-white">
          Welcome Back
        </h2>
        <p className="mb-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Silakan masuk untuk menjelajahi koleksi kami
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Input Email */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="text"
              {...register("email")}
              placeholder="user@gmail.com"
              className={`w-full rounded-xl border bg-transparent px-4 py-3 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              } transition-all`}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Input Password */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="....................."
                className={`w-full rounded-xl border bg-transparent px-4 py-3 pr-12 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                } transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("rememberMe")}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Remember me
              </span>
            </label>
            <a
              href="#"
              className="text-sm font-semibold text-blue-600 hover:text-blue-500"
            >
              Lupa Password?
            </a>
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-black focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-50"
          >
            {isSubmitting ? "Memproses..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
