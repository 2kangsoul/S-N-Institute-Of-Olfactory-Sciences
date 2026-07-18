"use client";

import { useState } from "react";
import {
  useGetOrders,
  useUpdateOrderStatus,
  useDeleteOrder,
} from "@/src/Features/order-snn/order.query";
import { OrderStatus } from "@/src/Features/order-snn/order.type";

const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "DELIVERED",
  "PAID",
  "REJECTED",
  "REFUNDED",
];

export default function AdminOrdersPage() {
  const { data: orders, isLoading, isError } = useGetOrders();
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateOrderStatus();
  const { mutate: deleteOrder, isPending: isDeleting } = useDeleteOrder();

  const [statusModal, setStatusModal] = useState<{
    id: string;
    selected: OrderStatus;
  } | null>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);

  if (isLoading) return <p className="text-white p-8">Loading orders...</p>;
  if (isError) return <p className="text-white p-8">Failed to load orders.</p>;

  const handleConfirmStatus = () => {
    if (!statusModal) return;
    updateStatus(
      { id: statusModal.id, status: statusModal.selected },
      { onSuccess: () => setStatusModal(null) },
    );
  };

  const handleConfirmDelete = () => {
    if (!deleteModal) return;
    deleteOrder(deleteModal, { onSuccess: () => setDeleteModal(null) });
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-semibold mb-6">Manage Orders</h1>

      {orders?.length === 0 ? (
        <p className="text-white/60">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/20 text-left text-white/60">
                <th className="p-3">Order</th>
                <th className="p-3">Buyer</th>
                <th className="p-3">Product</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr key={order.id} className="border-b border-white/10">
                  <td className="p-3">
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-white/50 text-xs">
                      {new Date(order.createdAt).toLocaleDateString("en-US")}
                    </p>
                  </td>
                  <td className="p-3">
                    <p>{order.user.fullName}</p>
                    <p className="text-white/50 text-xs">{order.user.email}</p>
                  </td>
                  <td className="p-3">
                    {order.items.map((item) => (
                      <p key={item.id}>
                        {item.product.name} x{item.quantity}
                      </p>
                    ))}
                  </td>
                  <td className="p-3">
                    Rp {order.totalAmount.toLocaleString("id-ID")}
                  </td>
                  <td className="p-3">{order.status}</td>
                  <td className="p-3 space-x-3">
                    <button
                      onClick={() =>
                        setStatusModal({ id: order.id, selected: order.status })
                      }
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setDeleteModal(order.id)}
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

      {/* Update Status Modal */}
      {statusModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-black border border-white/20 rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-medium mb-4">Update order status</h2>
            <select
              value={statusModal.selected}
              onChange={(e) =>
                setStatusModal({
                  ...statusModal,
                  selected: e.target.value as OrderStatus,
                })
              }
              className="w-full bg-transparent border border-white/20 rounded px-3 py-2 mb-4"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status} className="bg-black">
                  {status}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setStatusModal(null)}
                className="px-4 py-2 rounded-full border border-white/20"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatus}
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
            <h2 className="text-lg font-medium mb-2">Delete this order?</h2>
            <p className="text-white/60 text-sm mb-4">
              Deleted orders will no longer appear in the list.
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
