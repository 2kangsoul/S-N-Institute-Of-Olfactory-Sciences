// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from "react"
import ReactCountryFlag from "react-country-flag";
import apiClient from "../../config/api";

interface SettingsAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
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

export default function SettingsAccountModal({
  isOpen,
  onClose,
  user,
}: SettingsAccountModalProps) {
  const [phone, setPhone] = useState(user?.no_handphone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [savedPhone, setSavedPhone] = useState(user?.no_handphone || "-");
  const [savedAddress, setSavedAddress] = useState(user?.address || "-");
  const [savedName, setSavedName] = useState(user?.name || "-");
  const [savedEmail, setSavedEmail] = useState(user?.email || "-");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [countrySearch, setCountrySearch] = useState("");
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedRegency, setSelectedRegency] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [foreignAddress, setForeignAddress] = useState("");
  const [streetAddress, setStreetAddress] = useState(""); // ✅ Tambahan baru

  const isIndonesia = selectedCountry?.iso2 === "ID";

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
      setSelectedProvince("");
      setSelectedRegency("");
      setSelectedDistrict("");
      setSelectedVillage("");
      setForeignAddress("");
      setStreetAddress(""); // ✅ Tambahan baru
    }
  };

  // ✅ Update getFullAddress
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
      return [
        streetAddress,
        villageName,
        districtName,
        regencyName,
        provinceName,
      ]
        .filter(Boolean)
        .join(", ");
    }
    return streetAddress
      ? `${streetAddress}, ${foreignAddress}`
      : foreignAddress || address;
  };

  useEffect(() => {
    if (!isOpen || !user) return;
    setSavedName(user.name || "-");
    setSavedEmail(user.email || "-");
    setSavedPhone(user.no_handphone || "-");
    setSavedAddress(user.address || "-");
    setPhone(user.no_handphone || "");
    setAddress(user.address || "");
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!phone) newErrors.phone = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsLoading(true);

    try {
      let userId = user?.id || user?.objectId;

      if (!userId && user?.email) {
        const userFetchRes = await apiClient.get(`/users?email=${user.email}`);
        if (userFetchRes.data?.data && userFetchRes.data.data.length > 0) {
          userId = userFetchRes.data.data[0].id;
        }
      }

      if (!userId) {
        alert(
          "Error: Gagal memverifikasi ID pengguna. Silakan logout dan login ulang.",
        );
        setIsLoading(false);
        return;
      }

      let profilePicUrl = user.profilePic || "";

      if (profilePic) {
        const formData = new FormData();
        formData.append("file", profilePic);
        const uploadRes: any = await apiClient.post(`users/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        profilePicUrl =
          uploadRes.data?.data?.fileUrl ||
          uploadRes.data?.fileUrl ||
          uploadRes.data?.url;
      }

      const userToUpdate: any = {
        email: user.email,
        name: user.name,
        no_handphone: phone,
        address: getFullAddress(),
        country: selectedCountry?.name || user?.country || "",
        profilePic: profilePicUrl,
      };

      if (password.trim() !== "") {
        userToUpdate.password = password;
      }

      await apiClient.put(`/users/${userId}`, userToUpdate);

      const stored = localStorage.getItem("auth-storage");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.state?.user) {
            parsed.state.user.profilePic = profilePicUrl;
            parsed.state.user.no_handphone = phone;
            parsed.state.user.address = getFullAddress();
            parsed.state.user.country =
              selectedCountry?.name || user?.country || "";
            localStorage.setItem("auth-storage", JSON.stringify(parsed));
          }
        } catch {
          // Bukan JSON valid, lewati
        }
      }

      alert("Profile updated successfully!");
      onClose();
      window.location.reload();
    } catch (error: any) {
      console.error("Gagal menyimpan data:", error);
      const errorMessage = error.response?.data?.message || error.message;
      alert(`Error updating profile: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Account Settings</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-500 hover:text-red-500 text-xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Body Modal */}
        <div className="flex">
          {/* LEFT column: Form */}
          <div className="flex-1 p-6 space-y-4">
            {/* Upload Foto Profil */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                  {profilePic ? (
                    <img
                      src={URL.createObjectURL(profilePic)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : user?.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="Current Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Pic
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isLoading}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800 cursor-pointer disabled:opacity-50"
                />
              </div>
            </div>

            {/* Pilih Negara */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                        : user?.country || "Cari negara..."
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

            {/* ✅ Tambahan baru: Street Address */}
            {selectedCountry && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jalan / Alamat Detail
                </label>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                  placeholder="Contoh: Jalan Raya No. 10, RT 01/RW 02"
                />
              </div>
            )}

            {/* Alamat Indonesia */}
            {isIndonesia && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Provinsi
                  </label>
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kabupaten / Kota
                    </label>
                    <select
                      value={selectedRegency}
                      onChange={(e) => setSelectedRegency(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kecamatan
                    </label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kelurahan / Desa
                    </label>
                    <select
                      value={selectedVillage}
                      onChange={(e) => setSelectedVillage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kota / State
                </label>
                <input
                  type="text"
                  value={foreignAddress}
                  onChange={(e) => setForeignAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                  placeholder="Masukkan kota / state Anda"
                />
              </div>
            )}

            {/* Input Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-sm font-medium text-gray-700 min-w-fit">
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
                  type="text"
                  placeholder="e.g. 08123456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                  className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="Leave blank to keep current"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* RIGHT column: Biodata Read-Only */}
          <div className="w-52 shrink-0 bg-gray-50 border-l border-gray-200 px-5 py-6 space-y-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Biodata
            </p>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Name</p>
              <p className="text-sm font-medium text-gray-800 break-words">
                {savedName}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Email</p>
              <p className="text-sm font-medium text-gray-800 break-words">
                {savedEmail}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Phone</p>
              <p className="text-sm font-medium text-gray-800 break-words">
                {savedPhone}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Address</p>
              {/* ✅ Update: tampilkan format lengkap real-time */}
              <p className="text-sm font-medium text-gray-800 break-words">
                {getFullAddress() || savedAddress}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Country</p>
              <p className="text-sm font-medium text-gray-800 break-words">
                {selectedCountry?.name || user?.country || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
