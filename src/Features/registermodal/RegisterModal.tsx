import React, { useState } from "react";
// Pastikan path import ini sesuai dengan lokasi file api.ts Anda
import apiClient from "../../config/api";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export default function RegisterModal({
  isOpen,
  onClose,
  onSwitchToLogin,
}: RegisterModalProps) {
  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [noHandphone, setNoHandphone] = useState("");

  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // ==========================================
  // LANGKAH 1: MENGIRIM EMAIL OTP VIA EXPRESS.JS
  // ==========================================
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Buat 6 digit angka acak (misal: 849201)
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);

    try {
      // UPDATE: Mengubah endpoint menjadi endpoint Express (misal: /send-email)
      await apiClient.post("/send-email", {
        subject: "Kode Verifikasi (OTP) - Saa Fragrance",
        bodyparts: {
          textmessage: `Halo ${name},\n\nTerima kasih telah mendaftar di Saa Fragrance!\n\nKode OTP Anda adalah: ${randomOtp}\n\nDemi keamanan akun Anda, mohon tidak membagikan kode ini kepada siapapun.\n\nSalam hangat,\nTim Saa Fragrance`,
          htmlmessage: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 500px; margin: 0 auto; padding: 30px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
              <h2 style="color: #111; text-align: center; margin-bottom: 20px;">Verifikasi Akun</h2>
              <p>Halo <strong>${name}</strong>,</p>
              <p>Terima kasih telah mendaftar di <strong>Saa Fragrance</strong>! Kami sangat senang menyambut Anda.</p>
              <p>Untuk menyelesaikan proses pembuatan akun, silakan masukkan 6 digit kode verifikasi (OTP) berikut pada halaman web:</p>
              
              <div style="text-align: center; margin: 35px 0;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #111; background-color: #f4f2ee; padding: 15px 30px; border-radius: 8px; display: inline-block;">
                  ${randomOtp}
                </span>
              </div>
              
              <p style="color: #d9534f; font-size: 14px; background-color: #fdf2f2; padding: 10px; border-left: 4px solid #d9534f;">
                <strong>PENTING:</strong> Demi keamanan akun Anda, mohon untuk <strong>tidak membagikan kode ini</strong> kepada siapa pun. Kode ini hanya berlaku untuk sesi pendaftaran ini.
              </p>
              
              <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
              <p style="font-size: 12px; color: #888; text-align: center;">
                Jika Anda tidak merasa melakukan pendaftaran ini, silakan abaikan email ini.
              </p>
              <p style="font-size: 14px; text-align: center; margin-top: 20px;">
                Salam wangi,<br/><strong>Tim Saa Fragrance</strong>
              </p>
            </div>
          `,
        },
        to: [email],
      });

      // Jika berhasil dikirim, ganti tampilan ke form input OTP
      setStep(2);
    } catch (error: any) {
      console.error("Gagal mengirim OTP:", error);
      const errorMsg =
        error.response?.data?.message || "Gagal mengirim email OTP.";
      alert(`Error: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // LANGKAH 2: COCOKKAN OTP & DAFTAR USER
  // ==========================================
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Cek apakah angka yang diketik user sama dengan yang dibuat sistem
    if (otp !== generatedOtp) {
      alert("Kode OTP salah! Silakan periksa kembali email Anda.");
      return;
    }

    setIsLoading(true);

    try {
      // UPDATE: Mengubah endpoint menjadi endpoint Express (/auth/register)
      // Menambahkan mapping 'fullName' agar sesuai dengan schema Prisma
      await apiClient.post("/auth/register", {
        email: email,
        password: password,
        fullName: name, // Prisma membutuhkan fullName
        name: name, // Tetap dikirim berjaga-jaga jika controller butuh 'name'
        username: email.split("@")[0] + Date.now(),
        no_handphone: noHandphone,
        role: "user",
      });

      alert("Akun berhasil dibuat! Silakan Sign In.");
      handleCloseModal();
      if (onSwitchToLogin) {
        onSwitchToLogin();
      }
    } catch (error: any) {
      console.error("Gagal mendaftar:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Terjadi kesalahan saat membuat akun. Email mungkin sudah terdaftar.";
      alert(`Gagal: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setStep(1);
    setName("");
    setEmail("");
    setPassword("");
    setNoHandphone("");
    setOtp("");
    setGeneratedOtp("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        {/* Header Modal */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-[#f4f2ee]/30">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            {step === 1 ? "Buat Akun" : "Verifikasi Email"}
          </h2>
          <button
            onClick={handleCloseModal}
            className="text-gray-400 hover:text-gray-700 transition-colors focus:outline-none cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form Area */}
        <div className="p-6">
          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm transition-all"
                  placeholder="Masukkan nama Anda"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm transition-all"
                  placeholder="nama@email.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Nomor Handphone
                </label>
                <input
                  type="tel"
                  required
                  value={noHandphone}
                  onChange={(e) =>
                    setNoHandphone(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm transition-all"
                  placeholder="Contoh: 08123456789"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm transition-all"
                  placeholder="Minimal 8 karakter"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`mt-2 w-full py-3 bg-gray-900 text-white text-sm font-bold uppercase tracking-wider rounded-lg transition-colors shadow-md cursor-pointer ${isLoading ? "opacity-50" : "hover:bg-gray-800"}`}
              >
                {isLoading ? "Mengirim..." : "Kirim Kode OTP"}
              </button>
              {onSwitchToLogin && (
                <p className="text-center text-xs text-gray-500 mt-4">
                  Sudah punya akun?{" "}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-gray-900 font-bold hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              )}
            </form>
          ) : (
            <form
              onSubmit={handleVerifyAndRegister}
              className="flex flex-col gap-4"
            >
              <div className="text-center mb-2">
                <p className="text-sm text-gray-600">
                  Kami telah mengirimkan 6 digit kode OTP ke email: <br />
                  <span className="font-bold text-gray-900">{email}</span>
                </p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 text-center">
                  Masukkan Kode OTP
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-2xl text-center font-mono tracking-[0.5em] transition-all"
                  placeholder="••••••"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                  className="w-1/3 py-3 bg-white border border-gray-300 text-gray-700 text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-2/3 py-3 bg-gray-900 text-white text-sm font-bold uppercase tracking-wider rounded-lg transition-colors shadow-md cursor-pointer ${isLoading ? "opacity-50" : "hover:bg-gray-800"}`}
                >
                  {isLoading ? "Loading..." : "Verifikasi"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}