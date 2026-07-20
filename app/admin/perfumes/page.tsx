"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetProducts,
  useDeleteProduct,
} from "@/src/Features/product-snn/product.query";

export default function AdminPerfumesPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useGetProducts({ limit: 100 });
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const [deleteModal, setDeleteModal] = useState<string | null>(null);

  const products = data?.data ?? [];

  if (isLoading) return <p className="text-white p-8">Loading perfumes...</p>;
  if (isError) return <p className="text-white p-8">Failed to load perfumes.</p>;

  const handleConfirmDelete = () => {
    if (!deleteModal) return;
    deleteProduct(deleteModal, { onSuccess: () => setDeleteModal(null) });
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Manage Perfumes</h1>
        <button
          onClick={() => router.push("/admin/products/create")}
          className="px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-gray-200"
        >
          + Add Perfume
        </button>
      </div>

      {products.length === 0 ? (
        <p className="text-white/60">No perfumes yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/20 text-left text-white/60">
                <th className="p-3">Perfume</th>
                <th className="p-3">Brand</th>
                <th className="p-3">Type</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-white/10">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded overflow-hidden bg-white/10 flex items-center justify-center text-xs shrink-0">
                        {product.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          product.name?.[0]?.toUpperCase() ?? "?"
                        )}
                      </div>
                      <p className="font-medium">{product.name}</p>
                    </div>
                  </td>
                  <td className="p-3">{product.brand}</td>
                  <td className="p-3">{product.type}</td>
                  <td className="p-3">
                    Rp {product.price.toLocaleString("id-ID")}
                  </td>
                  <td className="p-3">{product.stock}</td>
                  <td className="p-3 space-x-3">
                    <button
                      onClick={() =>
                        router.push(`/admin/products/${product.id}/edit`)
                      }
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteModal(product.id)}
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

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-black border border-white/20 rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-medium mb-2">Delete this perfume?</h2>
            <p className="text-white/60 text-sm mb-4">
              Deleted perfumes will no longer appear in the list.
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
