import { useState, useEffect } from "react";
import apiClient from "../../config/api"; // Sesuaikan path ini dengan lokasi file api.ts kamu

interface SettingsAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any; // Sesuaikan dengan tipe data user kamu
}

export default function SettingsAccountModal({
  isOpen,
  onClose,
  user,
}: SettingsAccountModalProps) {
  // Mengambil data default dari user agar form tidak kosong jika data sudah ada
  const [phone, setPhone] = useState(user?.no_handphone || "");
  const [address, setAddress] = useState(user?.address || "");
  // Nilai yang tersimpan di DB — dipakai di biodata, tidak berubah saat user mengetik
  const [savedPhone, setSavedPhone] = useState(user?.no_handphone || "-");
  const [savedAddress, setSavedAddress] = useState(user?.address || "-");
  const [savedName, setSavedName] = useState(user?.name || "-");
  const [savedEmail, setSavedEmail] = useState(user?.email || "-");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // State untuk menyimpan error per field
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // FIX: Sinkronisasi langsung menggunakan data dari props (user) tanpa fetch HTTP yang bisa memicu interceptor logout otomatis
  useEffect(() => {
    if (!isOpen || !user) return;

    setSavedName(user.name || "-");
    setSavedEmail(user.email || "-");
    setSavedPhone(user.no_handphone || "-");
    setSavedAddress(user.address || "-");

    // Isi juga form dengan data terbaru dari props
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
    if (!address) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return; // Berhenti jika validasi gagal

    setIsLoading(true);

    try {
      let userId = user?.id || user?.objectId;

      // Mencari ID ke Backend menggunakan email jika tidak ada di state
      if (!userId && user?.email) {
        // UPDATE: Ubah endpoint query parameter ke /users?email=...
        const userFetchRes = await apiClient.get(
          `/users?email=${user.email}`,
        );
        // UPDATE: Ambil dari .data.data dan ubah objectId menjadi id
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

      // 1. Jika ada file foto baru yang dipilih, unggah ke Storage
      if (profilePic) {
        const formData = new FormData();
        // UPDATE: Biasanya Express/Multer menerima field 'file' atau 'image', sesuaikan jika berbeda
        formData.append("file", profilePic);

        // UPDATE: Endpoint upload disesuaikan ke Express (misal: /upload)
        const uploadRes: any = await apiClient.post(
          `users/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        // UPDATE: Mengambil link URL secara aman (sesuaikan dengan respon dari controller upload Express-mu)
        profilePicUrl =
          uploadRes.data?.data?.fileUrl ||
          uploadRes.data?.fileUrl ||
          uploadRes.data?.url;
      }

      // 2. Siapkan data yang akan di-update ke tabel Users
      const userToUpdate: any = {
        email: user.email,
        name: user.name,
        no_handphone: phone,
        address: address,
        profilePic: profilePicUrl,
      };

      // Jika kolom password diisi (tidak kosong), ikutkan untuk diganti
      if (password.trim() !== "") {
        userToUpdate.password = password;
      }

      // 3. Update data ke tabel Users
      // UPDATE: Ubah endpoint ke /users/:id
      await apiClient.put(`/users/${userId}`, userToUpdate);

      // 4. FIX: Perbarui data user di localStorage key "auth-storage" agar header langsung tampil foto terbaru setelah reload
      const stored = localStorage.getItem("auth-storage");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Struktur: { state: { isAuthenticated: true, user: { ... } }, version: 0 }
          if (parsed?.state?.user) {
            parsed.state.user.profilePic = profilePicUrl;
            parsed.state.user.no_handphone = phone;
            parsed.state.user.address = address;
            localStorage.setItem("auth-storage", JSON.stringify(parsed));
          }
        } catch {
          // Bukan JSON valid, lewati
        }
      }

      alert("Profile updated successfully!");
      onClose(); // Tutup modal setelah save
      window.location.reload(); // Refresh halaman agar data terbaru langsung muncul
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
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden">
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

        {/* Body Modal — two columns */}
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

            {/* Input Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 08123456789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 ${errors.phone ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Input Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Enter your full address"
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none ${errors.address ? "border-red-500" : "border-gray-300"}`}
              ></textarea>
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
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
              <p className="text-sm font-medium text-gray-800 break-words">
                {savedAddress}
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