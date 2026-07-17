"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCreateOrder } from "@/src/Features/order-snn/order.query";
import { useGetProductById } from "@/src/Features/product-snn/product.query";

export default function OrderCreatePage() {
  const { productId } = useParams<{ productId: string }>();
  const router = useRouter();

  const { data: product, isLoading, isError } = useGetProductById(productId);
  const { mutate: createOrder, isPending, error } = useCreateOrder();

  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [showToast, setShowToast] = useState(false);

  if (isLoading) return <p className="text-white p-8">Loading produk...</p>;
  if (isError || !product)
    return <p className="text-white p-8">Produk tidak ditemukan.</p>;

  const totalAmount = product.price * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity < 1 || quantity > product.stock) return;

    createOrder(
      { productId, quantity, ...(note.trim() && { note: note.trim() }) },
      {
        onSuccess: () => {
          setShowToast(true);
          setTimeout(() => {
            router.push("/products?order=success");
          }, 2000); // toast keliatan 2 detik dulu, baru pindah halaman
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 max-w-lg mx-auto">
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white text-black px-5 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <span className="text-green-600 font-bold">✓</span>
          <span className="text-sm font-medium">
            Order berhasil dibuat! Mengalihkan ke halaman produk...
          </span>
        </div>
      )}

      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

      <div className="mb-6 border border-white/20 rounded-lg p-4">
        <p className="text-sm text-white/60">{product.brand}</p>
        <p className="text-lg font-medium">{product.name}</p>
        <p className="text-sm text-white/60 mb-2">{product.type}</p>
        <p className="font-semibold">
          Rp {product.price.toLocaleString("id-ID")}
        </p>
        <p className="text-sm text-white/50">Stock: {product.stock}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Quantity</label>
          <input
            type="number"
            min={1}
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            disabled={showToast}
            className="w-full bg-transparent border border-white/20 rounded px-3 py-2 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Note (opsional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={500}
            rows={3}
            disabled={showToast}
            className="w-full bg-transparent border border-white/20 rounded px-3 py-2 disabled:opacity-50"
          />
        </div>

        <div className="flex justify-between text-sm text-white/70">
          <span>Total</span>
          <span>Rp {totalAmount.toLocaleString("id-ID")}</span>
        </div>

        {error && (
          <p className="text-red-400 text-sm">
            {(error as any)?.response?.data?.message ?? "Gagal membuat order"}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending || showToast || quantity > product.stock}
          className="w-full bg-white text-black rounded-full py-3 font-medium disabled:opacity-50"
        >
          {showToast ? "Berhasil ✓" : isPending ? "Memproses..." : "Confirm Order"}
        </button>
      </form>
    </div>
  );
}