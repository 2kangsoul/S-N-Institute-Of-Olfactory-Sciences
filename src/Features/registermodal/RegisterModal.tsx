// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from "react"
import ReactCountryFlag from "react-country-flag";
import apiClient from "../../config/api";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

interface Country {
  name: string;
  iso2: string;
  iso3: string;
  unicodeFlag: string;
}

interface Province {
  id: string;
  name: string;
}

interface Regency {
  id: string;
  name: string;
}

interface District {
  id: string;
  name: string;
}

interface Village {
  id: string;
  name: string;
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

  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [phoneCode, setPhoneCode] = useState("");
  const [countrySearch, setCountrySearch] = useState(""); // ✅ Tambahan baru

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedRegency, setSelectedRegency] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [foreignAddress, setForeignAddress] = useState("");

  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isIndonesia = selectedCountry?.iso2 === "ID";

  // ✅ Tambahan baru: filtered countries
  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  useEffect(() => {
    fetch("http://localhost:8000/api/countries")
      .then((res) => res.json())
      .then((res) => {
        const arr = Array.isArray(res.data) ? res.data : [];
        const sorted = arr
          .filter((c: Country) => c !== null && c?.iso2)
          .filter(
            (c: Country, index: number, self: Country[]) =>
              self.findIndex((t) => t.iso2 === c.iso2) === index,
          )
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
        setCountries(sorted);
      })
      .catch(console.error);
  }, []);

  // ✅ Tambahan baru: lock scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isIndonesia) {
      fetch("http://localhost:8000/api/provinces")
        .then((res) => res.json())
        .then(setProvinces)
        .catch(console.error);
    }
  }, [isIndonesia]);

  useEffect(() => {
    if (selectedProvince) {
      fetch(`http://localhost:8000/api/regencies/${selectedProvince}`)
        .then((res) => res.json())
        .then(setRegencies)
        .catch(console.error);
      setSelectedRegency("");
      setSelectedDistrict("");
      setSelectedVillage("");
      setDistricts([]);
      setVillages([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedRegency) {
      fetch(`http://localhost:8000/api/districts/${selectedRegency}`)
        .then((res) => res.json())
        .then(setDistricts)
        .catch(console.error);
      setSelectedDistrict("");
      setSelectedVillage("");
      setVillages([]);
    }
  }, [selectedRegency]);

  useEffect(() => {
    if (selectedDistrict) {
      fetch(`http://localhost:8000/api/villages/${selectedDistrict}`)
        .then((res) => res.json())
        .then(setVillages)
        .catch(console.error);
      setSelectedVillage("");
    }
  }, [selectedDistrict]);

  const handleCountryChange = (iso2: string) => {
    const country = countries.find((c) => c.iso2 === iso2);
    if (country) {
      setSelectedCountry(country);
      setPhoneCode("");
      setNoHandphone("");
      setSelectedProvince("");
      setSelectedRegency("");
      setSelectedDistrict("");
      setSelectedVillage("");
      setForeignAddress("");
    }
  };

  const getFullAddress = () => {
    if (isIndonesia) {
      const villageName =
        villages.find((v) => v.id === selectedVillage)?.name || "";
      const districtName =
        districts.find((d) => d.id === selectedDistrict)?.name || "";
      const regencyName =
        regencies.find((r) => r.id === selectedRegency)?.name || "";
      const provinceName =
        provinces.find((p) => p.id === selectedProvince)?.name || "";
      return [villageName, districtName, regencyName, provinceName]
        .filter(Boolean)
        .join(", ");
    }
    return foreignAddress;
  };

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);

    try {
      await apiClient.post("/send-email", {
        subject: "Kode Verifikasi (OTP) - SNN Institute Of Olfactory Sciences",
        bodyparts: {
          textmessage: `Halo ${name},\n\nTerima kasih telah mendaftar di SNN Institute Of Olfactory Sciences!\n\nKode OTP Anda adalah: ${randomOtp}\n\nDemi keamanan akun Anda, mohon tidak membagikan kode ini kepada siapapun.\n\nSalam hangat,\nTim SNN Institute Of Olfactory Sciences`,
          htmlmessage: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 500px; margin: 0 auto; padding: 30px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
              <h2 style="color: #111; text-align: center; margin-bottom: 20px;">Verifikasi Akun</h2>
              <p>Halo <strong>${name}</strong>,</p>
              <p>Terima kasih telah mendaftar di <strong>SNN Institute Of Olfactory Sciences</strong>! Kami sangat senang menyambut Anda.</p>
              <p>Untuk menyelesaikan proses pembuatan akun, silakan masukkan 6 digit kode verifikasi (OTP) berikut pada halaman web:</p>
              <div style="text-align: center; margin: 35px 0;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #111; background-color: #f4f2ee; padding: 15px 30px; border-radius: 8px; display: inline-block;">
                  ${randomOtp}
                </span>
              </div>
              <p style="color: #d9534f; font-size: 14px; background-color: #fdf2f2; padding: 10px; border-left: 4px solid #d9534f;">
                <strong>PENTING:</strong> Demi keamanan akun Anda, mohon untuk <strong>tidak membagikan kode ini</strong> kepada siapa pun.
              </p>
              <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
              <p style="font-size: 12px; color: #888; text-align: center;">
                Jika Anda tidak merasa melakukan pendaftaran ini, silakan abaikan email ini.
              </p>
              <p style="font-size: 14px; text-align: center; margin-top: 20px;">
                Salam wangi,<br/><strong>Tim SNN Institute Of Olfactory Sciences</strong>
              </p>
            </div>
          `,
        },
        to: [email],
      });

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

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp !== generatedOtp) {
      alert("Kode OTP salah! Silakan periksa kembali email Anda.");
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.post("/auth/register", {
        email: email,
        password: password,
        fullName: name,
        name: name,
        username: email.split("@")[0] + Date.now(),
        no_handphone: phoneCode + noHandphone,
        role: "user",
        country: selectedCountry?.name || "",
        address: getFullAddress(),
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
    setSelectedCountry(null);
    setPhoneCode("");
    setSelectedProvince("");
    setSelectedRegency("");
    setSelectedDistrict("");
    setSelectedVillage("");
    setForeignAddress("");
    setCountrySearch(""); // ✅ Tambahan baru
    setOtp("");
    setGeneratedOtp("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all max-h-[90vh] overflow-y-auto">
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

              {/* ✅ Update: Searchable country dropdown */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Negara
                </label>
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 12px",
                      background: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  >
                    {selectedCountry && (
                      <span>{selectedCountry.unicodeFlag}</span>
                    )}
                    <input
                      type="text"
                      value={countrySearch}
                      onChange={(e) => {
                        setCountrySearch(e.target.value);
                        setSelectedCountry(null);
                      }}
                      placeholder={
                        selectedCountry
                          ? selectedCountry.name
                          : "Cari negara..."
                      }
                      style={{
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        fontSize: "14px",
                        width: "100%",
                      }}
                    />
                  </div>

                  {/* Dropdown list */}
                  {countrySearch && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        maxHeight: "200px",
                        overflowY: "auto",
                        zIndex: 9999,
                        marginTop: "4px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      {filteredCountries.length === 0 ? (
                        <div
                          style={{
                            padding: "10px 12px",
                            fontSize: "13px",
                            color: "#9ca3af",
                          }}
                        >
                          Negara tidak ditemukan
                        </div>
                      ) : (
                        filteredCountries.slice(0, 50).map((c) => (
                          <div
                            key={c.iso2}
                            onClick={() => {
                              handleCountryChange(c.iso2);
                              setCountrySearch("");
                            }}
                            style={{
                              padding: "8px 12px",
                              fontSize: "13px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = "#f3f4f6")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "transparent")
                            }
                          >
                            <span>{c.unicodeFlag}</span>
                            <span>{c.name}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Nomor Handphone */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Nomor Handphone
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1 px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 min-w-fit">
                    {selectedCountry && (
                      <ReactCountryFlag
                        countryCode={selectedCountry.iso2}
                        svg
                        style={{ width: "16px", height: "16px" }}
                      />
                    )}
                    <span>{selectedCountry?.unicodeFlag || "🌍"}</span>
                  </div>
                  <input
                    type="tel"
                    required
                    value={noHandphone}
                    onChange={(e) =>
                      setNoHandphone(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm transition-all"
                    placeholder="8123456789"
                  />
                </div>
              </div>

              {/* Alamat Indonesia */}
              {isIndonesia && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Provinsi
                    </label>
                    <select
                      value={selectedProvince}
                      onChange={(e) => setSelectedProvince(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm transition-all"
                    >
                      <option value="">Pilih provinsi...</option>
                      {provinces.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedProvince && (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Kabupaten / Kota
                      </label>
                      <select
                        value={selectedRegency}
                        onChange={(e) => setSelectedRegency(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm transition-all"
                      >
                        <option value="">Pilih kabupaten/kota...</option>
                        {regencies.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedRegency && (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Kecamatan
                      </label>
                      <select
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm transition-all"
                      >
                        <option value="">Pilih kecamatan...</option>
                        {districts.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedDistrict && (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Kelurahan / Desa
                      </label>
                      <select
                        value={selectedVillage}
                        onChange={(e) => setSelectedVillage(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm transition-all"
                      >
                        <option value="">Pilih kelurahan/desa...</option>
                        {villages.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}

              {/* Alamat luar negeri */}
              {selectedCountry && !isIndonesia && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Alamat
                  </label>
                  <input
                    type="text"
                    value={foreignAddress}
                    onChange={(e) => setForeignAddress(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm transition-all"
                    placeholder="Masukkan kota / state / alamat Anda"
                  />
                </div>
              )}

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
