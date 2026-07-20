"use client";

import { useState } from "react";
import {
  useGetUsers,
  useUpdateUserRole,
  useDeleteUser,
} from "@/src/Features/user-snn/user.query";
import { UserRole } from "@/src/Features/user-snn/user.type";

const ROLE_OPTIONS: UserRole[] = ["USER", "ADMIN", "SUPER_ADMIN"];

export default function AdminUsersPage() {
  const { data: users, isLoading, isError } = useGetUsers();
  const { mutate: updateRole, isPending: isUpdating } = useUpdateUserRole();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const [roleModal, setRoleModal] = useState<{
    id: string;
    selected: UserRole;
  } | null>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);

  if (isLoading) return <p className="text-white p-8">Loading users...</p>;
  if (isError) return <p className="text-white p-8">Failed to load users.</p>;

  const handleConfirmRole = () => {
    if (!roleModal) return;
    updateRole(
      { id: roleModal.id, role: roleModal.selected },
      { onSuccess: () => setRoleModal(null) },
    );
  };

  const handleConfirmDelete = () => {
    if (!deleteModal) return;
    deleteUser(deleteModal, { onSuccess: () => setDeleteModal(null) });
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-semibold mb-6">Manage Users</h1>

      {users?.length === 0 ? (
        <p className="text-white/60">No users yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/20 text-left text-white/60">
                <th className="p-3">User</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Role</th>
                <th className="p-3">Joined</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id} className="border-b border-white/10">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 flex items-center justify-center text-xs shrink-0">
                        {user.profilePic ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={user.profilePic}
                            alt={user.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          user.fullName?.[0]?.toUpperCase() ?? "?"
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-white/50 text-xs">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.no_handphone || "-"}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded-full border border-white/20 text-xs">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3 text-white/50 text-xs">
                    {new Date(user.createdAt).toLocaleDateString("en-US")}
                  </td>
                  <td className="p-3 space-x-3">
                    <button
                      onClick={() =>
                        setRoleModal({ id: user.id, selected: user.role })
                      }
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Edit role
                    </button>
                    <button
                      onClick={() => setDeleteModal(user.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Role Modal */}
      {roleModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-black border border-white/20 rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-medium mb-4">Edit user role</h2>
            <select
              value={roleModal.selected}
              onChange={(e) =>
                setRoleModal({
                  ...roleModal,
                  selected: e.target.value as UserRole,
                })
              }
              className="w-full bg-transparent border border-white/20 rounded px-3 py-2 mb-4"
            >
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role} className="bg-black">
                  {role}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRoleModal(null)}
                className="px-4 py-2 rounded-full border border-white/20"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRole}
                disabled={isUpdating}
                className="px-4 py-2 rounded-full bg-white text-black disabled:opacity-50"
              >
                {isUpdating ? "Saving..." : "OK"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-black border border-white/20 rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-medium mb-2">Delete this user?</h2>
            <p className="text-white/60 text-sm mb-4">
              Deleted users will no longer appear in the list.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 rounded-full border border-white/20"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-full bg-red-500 text-white disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
