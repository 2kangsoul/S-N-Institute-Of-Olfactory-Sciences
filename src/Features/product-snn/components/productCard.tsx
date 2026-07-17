"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Product } from "../product.type";
import { useDeleteProduct } from "../product.query";
import { useAuthStore } from "@/src/stores/useAuthStore";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const deleteProduct = useDeleteProduct();
  const [confirming, setConfirming] = useState(false);

  const handleDeleteClick = () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    setConfirming(false);
    toast.promise(deleteProduct.mutateAsync(product.id), {
      loading: `Menghapus ${product.name}...`,
      success: `${product.name} berhasil dihapus`,
      error: "Gagal menghapus produk",
    });
  };

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="group border border-gray-800 rounded-xl overflow-hidden bg-neutral-950 hover:border-gray-600 transition-all duration-200 flex flex-col">
      <div className="relative aspect-square w-full overflow-hidden bg-gray-900">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
        />
        {isOutOfStock && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-semibold px-2 py-1 rounded-full">
            Out of Stock
          </span>
        )}
        {isLowStock && (
          <span className="absolute top-2 left-2 bg-yellow-500 text-black text-[10px] font-semibold px-2 py-1 rounded-full">
            Sisa {product.stock}
          </span>
        )}
      </div>

      <div className="p-3 flex-1 flex flex-col gap-0.5">
        <p className="text-[11px] text-gray-500 uppercase tracking-wide">{product.brand}</p>
        <h3 className="text-sm font-semibold text-white leading-snug line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500">{product.type}</p>

        <div className="flex items-center justify-between mt-2">
          <p className="text-sm font-bold text-white">
            Rp {product.price.toLocaleString("id-ID")}
          </p>
          <p className="text-[11px] text-gray-500">Stock: {product.stock}</p>
        </div>

        {isAdmin ? (
          <div className="mt-3 flex gap-2">
            <Link
              href={`/admin/products/${product.id}/edit`}
              className="flex-1 bg-white text-black text-center py-2 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={handleDeleteClick}
              disabled={deleteProduct.isPending}
              className={`flex-1 text-center py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40 ${
                confirming
                  ? "bg-red-600 text-white"
                  : "border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              }`}
            >
              {deleteProduct.isPending ? "..." : confirming ? "Yakin?" : "Delete"}
            </button>
          </div>
        ) : (
          <Link
            href={`/order/create/${product.id}`}
            className={`mt-3 text-center py-2 rounded-lg text-sm font-semibold transition-colors ${
              isOutOfStock
                ? "bg-gray-800 text-gray-500 pointer-events-none"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            {isOutOfStock ? "Habis" : "Buy Now"}
          </Link>
        )}
      </div>
    </div>
  );
}