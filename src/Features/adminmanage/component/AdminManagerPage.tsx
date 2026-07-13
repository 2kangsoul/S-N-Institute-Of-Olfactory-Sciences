"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { useAdminManager } from "../hooks/useAdminManager";
import AdminForm from "./AdminForm";
import AdminList from "./AdminList";

function AdminManagerContent() {
  const manager = useAdminManager();

  return (
    <section className="flex flex-1 flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Manajemen Admin</h1>
        <p className="mt-1 text-sm text-slate-400">
          Tambah administrator, promosikan pengguna, dan kelola akses.
        </p>
      </div>

      <div className="grid gap-8 rounded-xl border border-slate-800 bg-white p-6 md:grid-cols-2">
        <AdminForm
          activeForm={manager.activeForm}
          setActiveForm={manager.setActiveForm}
          formData={manager.formData}
          setFormData={manager.setFormData}
          existingFormData={manager.existingFormData}
          setExistingFormData={manager.setExistingFormData}
          handleAddAdmin={manager.handleAddAdmin}
          handleMakeAdmin={manager.handleMakeAdmin}
          isLoading={manager.isLoading}
        />
        <AdminList
          admins={manager.admins}
          isFetching={manager.isFetching}
          handleDeleteAdmin={manager.handleDeleteAdmin}
        />
      </div>
    </section>
  );
}

export default function AdminManagerPage() {
  const router = useRouter();
  const { user, isAuthLoading } = useAuthStore();
  const isOwner = user?.role === "owner";

  useEffect(() => {
    if (!isAuthLoading && !isOwner) router.replace("/admin");
  }, [isAuthLoading, isOwner, router]);

  if (isAuthLoading || !isOwner) return null;

  return <AdminManagerContent />;
}
