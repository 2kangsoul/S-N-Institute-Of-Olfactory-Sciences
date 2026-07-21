"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import Pagination from "@mui/material/Pagination";
import { useGetProducts } from "@/src/Features/product-snn/product.query";
import ProductCard from "@/src/Features/product-snn/components/productCard";
import { useAuthStore } from "@/src/stores/useAuthStore";

function ProductCardSkeleton() {
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden bg-neutral-950 animate-pulse">
      <div className="aspect-square w-full bg-gray-900" />
      <div className="p-3 space-y-2">
        <div className="h-2 w-1/3 bg-gray-800 rounded" />
        <div className="h-3 w-2/3 bg-gray-800 rounded" />
        <div className="h-2 w-1/2 bg-gray-800 rounded" />
        <div className="h-8 w-full bg-gray-800 rounded mt-3" />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search] = useDebounce(searchInput, 400);

  const [sortBy, setSortBy] = useState<"createdAt" | "price" | "name">("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [brand, setBrand] = useState("");
  const [type, setType] = useState("");
  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  useEffect(() => {
    setPage(1);
  }, [search, sortBy, order, brand, type]);
  const { data, isLoading } = useGetProducts({
    page,
    limit: 10,
    search,
    sortBy,
    order,
    brand: brand || undefined,
    type: type || undefined,
  });
  const meta = data?.meta;
  const products = data?.data ?? [];
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
          </div>
          {isAdmin && (
            <Link
              href="/admin/products/create"
              className="bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              + Create Product
            </Link>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="relative max-w-sm flex-1 min-w-[200px]">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full border border-gray-700 bg-neutral-950 text-white pl-9 pr-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-gray-500 transition-colors"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "createdAt" | "price" | "name")}
            className="border border-gray-700 bg-neutral-950 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-gray-500 transition-colors"
          >
            <option value="createdAt">Newest</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
          </select>

          <select
            value={order}
            onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
            className="border border-gray-700 bg-neutral-950 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-gray-500 transition-colors"
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>

          <input
            type="text"
            placeholder="Filter brand..."
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="border border-gray-700 bg-neutral-950 text-white px-3 py-2.5 rounded-lg text-sm w-40 focus:outline-none focus:border-gray-500 transition-colors"
          />

          <input
            type="text"
            placeholder="Filter type..."
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border border-gray-700 bg-neutral-950 text-white px-3 py-2.5 rounded-lg text-sm w-40 focus:outline-none focus:border-gray-500 transition-colors"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>No products found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {meta && meta.totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <Pagination
                  count={meta.totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  shape="rounded"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "white",
                      borderColor: "#374151",
                    },
                    "& .Mui-selected": {
                      backgroundColor: "white !important",
                      color: "black",
                    },
                    "& .MuiPaginationItem-root:hover": {
                      borderColor: "#6b7280",
                    },
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}