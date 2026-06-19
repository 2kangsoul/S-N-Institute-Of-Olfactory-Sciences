// @ts-nocheck
/* eslint-disable */
import React from "react";
import type { AdminUser } from "../types/adminManagerTypes";

interface AdminListProps {
  admins: AdminUser[];
  isFetching: boolean;
  // UPDATE: objectId diubah menjadi id
  handleDeleteAdmin: (id: string, name: string) => void;
}

export default function AdminList({
  admins,
  isFetching,
  handleDeleteAdmin,
}: AdminListProps) {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Daftar Admin Aktif
      </h3>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {isFetching ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            Memuat data...
          </div>
        ) : admins.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            Belum ada admin lain yang terdaftar.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 max-h-[350px] overflow-y-auto">
            {admins.map((admin) => (
              <li
                // UPDATE: objectId diubah menjadi id
                key={admin.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {admin.name}
                  </p>
                  <p className="text-xs text-gray-500">{admin.email}</p>
                </div>
                <button
                  // UPDATE: objectId diubah menjadi id
                  onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus Admin"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
