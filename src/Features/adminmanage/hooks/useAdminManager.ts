import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import type { AdminUser } from "../types/adminManagerTypes";
import {
  fetchAdminsApi,
  registerAdminApi,
  findUserByEmailApi,
  updateUserRoleApi,
  deleteUserApi,
} from "../api/adminManagerApi";

export const useAdminManager = (isOpen: boolean) => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [activeForm, setActiveForm] = useState<"new" | "existing">("new");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [existingFormData, setExistingFormData] = useState({
    email: "",
    duration: "permanent",
  });

  const fetchAdmins = async () => {
    setIsFetching(true);
    try {
      const data = await fetchAdminsApi();
      setAdmins(data);
    } catch (error: any) {
      console.error("Gagal mengambil data admin:", error);
      toast.error("Gagal memuat daftar admin");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAdmins();
    }
  }, [isOpen]);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Semua kolom harus diisi!");
      return;
    }

    setIsLoading(true);
    try {
      await registerAdminApi({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "admin",
      });

      toast.success(`Admin ${formData.name} berhasil ditambahkan!`);
      setFormData({ name: "", email: "", password: "" });
      fetchAdmins();
    } catch (error: any) {
      console.error("Gagal menambah admin:", error);
      toast.error(error.response?.data?.message || "Gagal menambahkan admin");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMakeAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!existingFormData.email) {
      toast.error("Email harus diisi!");
      return;
    }

    setIsLoading(true);
    try {
      const users = await findUserByEmailApi(existingFormData.email);

      if (users.length === 0) {
        toast.error("Pengguna dengan email tersebut tidak ditemukan!");
        setIsLoading(false);
        return;
      }

      const user = users[0];

      // UPDATE: Mengubah user.objectId menjadi user.id
      await updateUserRoleApi(user.id, {
        role: "admin",
        adminDuration: existingFormData.duration,
      });

      toast.success(
        `Berhasil menjadikan ${existingFormData.email} sebagai admin!`,
      );
      setExistingFormData({ email: "", duration: "permanent" });
      fetchAdmins();
    } catch (error: any) {
      console.error("Gagal memproses:", error);
      toast.error("Gagal menjadikan admin.");
    } finally {
      setIsLoading(false);
    }
  };

  // UPDATE: Mengubah parameter objectId menjadi id
  const handleDeleteAdmin = async (id: string, adminName: string) => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin mencopot jabatan dan menghapus akun ${adminName}?`,
    );
    if (!confirmDelete) return;

    try {
      // UPDATE: Menggunakan id
      await deleteUserApi(id);
      toast.success(`Admin ${adminName} berhasil dihapus.`);
      fetchAdmins();
    } catch (error: any) {
      console.error("Gagal menghapus admin:", error);
      toast.error("Gagal menghapus admin. Pastikan Anda memiliki izin.");
    }
  };

  return {
    admins,
    isLoading,
    isFetching,
    activeForm,
    setActiveForm,
    formData,
    setFormData,
    existingFormData,
    setExistingFormData,
    handleAddAdmin,
    handleMakeAdmin,
    handleDeleteAdmin,
  };
};