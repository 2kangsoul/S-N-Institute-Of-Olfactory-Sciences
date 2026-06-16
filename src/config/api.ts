import axios from "axios";

// Mengarah ke backend lokal Express.js
const API_URL = "http://localhost:8000/api";

// UBAH: Nama variabel sekarang menjadi apiClient
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ====================================================================
// INTERCEPTOR REQUEST: Menyelipkan JWT token otomatis ke setiap request API
// ====================================================================
apiClient.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem("auth-storage");

    if (authStorage) {
      try {
        const parsedStorage = JSON.parse(authStorage);
        // Dukung properti 'token' (Express) dan 'userToken' (Sistem lama)
        const token = parsedStorage?.state?.user?.token || parsedStorage?.state?.user?.userToken;

        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      } catch (e) {
        console.error("Gagal memproses token:", e);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ====================================================================
// INTERCEPTOR RESPONSE: Global Error Handler (Auto-Logout)
// ====================================================================
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
        !window.location.pathname.includes("/login")
      ) {
        console.warn("Sesi habis atau token tidak valid. Membersihkan sesi...");

        localStorage.removeItem("auth-storage");
        alert("Sesi login Anda telah berakhir demi keamanan. Silakan login kembali.");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;