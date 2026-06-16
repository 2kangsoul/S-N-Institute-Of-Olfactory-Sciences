import React from "react";

interface AdminFormProps {
  activeForm: "new" | "existing";
  setActiveForm: (form: "new" | "existing") => void;
  formData: any;
  setFormData: (data: any) => void;
  existingFormData: any;
  setExistingFormData: (data: any) => void;
  handleAddAdmin: (e: React.FormEvent) => void;
  handleMakeAdmin: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export default function AdminForm({
  activeForm,
  setActiveForm,
  formData,
  setFormData,
  existingFormData,
  setExistingFormData,
  handleAddAdmin,
  handleMakeAdmin,
  isLoading,
}: AdminFormProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 h-max">
      {/* Tab Navigasi Kiri */}
      <div className="flex bg-gray-200 p-1 rounded-lg mb-6">
        <button
          onClick={() => setActiveForm("new")}
          className={`flex-1 text-xs font-bold py-2 rounded-md transition-colors ${
            activeForm === "new"
              ? "bg-white text-gray-900 shadow"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Tambah Admin Baru
        </button>
        <button
          onClick={() => setActiveForm("existing")}
          className={`flex-1 text-xs font-bold py-2 rounded-md transition-colors flex items-center justify-center gap-1 ${
            activeForm === "existing"
              ? "bg-white text-gray-900 shadow"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Jadikan Admin
          {/* Tanda Panah */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>

      {/* Render Form Berdasarkan Tab yang Aktif */}
      {activeForm === "new" ? (
        <form onSubmit={handleAddAdmin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Misal: Budi Santoso"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="admin@saafragrance.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Minimal 6 karakter"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-gray-900 text-white font-bold py-2.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Memproses..." : "+ Daftarkan Admin"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleMakeAdmin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Pengguna Aktif
            </label>
            <input
              type="email"
              value={existingFormData.email}
              onChange={(e) =>
                setExistingFormData({
                  ...existingFormData,
                  email: e.target.value,
                })
              }
              placeholder="email.user@gmail.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Durasi Admin
            </label>
            <select
              value={existingFormData.duration}
              onChange={(e) =>
                setExistingFormData({
                  ...existingFormData,
                  duration: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm bg-white"
            >
              <option value="7 hari">7 Hari</option>
              <option value="30 hari">30 Hari</option>
              <option value="permanent">Permanent</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-gray-900 text-white font-bold py-2.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Memproses..." : "+ Jadikan Admin"}
          </button>
        </form>
      )}
    </div>
  );
}