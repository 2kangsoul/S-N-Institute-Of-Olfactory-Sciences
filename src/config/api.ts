import axios from "axios";
import toast from "react-hot-toast";

// Mengarah ke backend lokal Express.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// UBAH: Nama variabel sekarang menjadi apiClient
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // WAJIB: supaya cookie httpOnly "token" ikut terkirim ke backend
  headers: {
    "Content-Type": "application/json",
  },
});
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (
        status === 401 &&
        !error.config?.url?.includes("/auth/login") &&
        !error.config?.url?.includes("/auth/me") &&
        !error.config?.url?.includes("/liked") &&
        !window.location.pathname.includes("/login")
      ) {
        console.warn("Sesi habis atau token tidak valid. Membersihkan sesi...");

        toast.error(
          "Sesi login Anda telah berakhir demi keamanan. Silakan login kembali.",
        );
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;