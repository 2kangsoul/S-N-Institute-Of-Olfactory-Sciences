"use client";
import { useEffect, useState } from "react";
import { useGetProducts } from "@/src/Features/product-snn/product.query";
import ProductCard from "@/src/Features/product-snn/components/productCard";
function getPageNumbers(current: number, total: number) {
  const pages: (number | "...")[] = [];
  const range = 1;
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - range && i <= current + range)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }
  return pages;
}
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
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { data, isLoading } = useGetProducts({ page, limit: 10, search });
  const meta = data?.meta;
  const products = data?.data ?? [];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            {meta && (
              <p className="text-sm text-gray-500 mt-1">
                {meta.total} products found
                {meta.totalPages > 0 && (
                  <>
                    {" "}
                    &middot; Page {meta.page} of {meta.totalPages}
                  </>
                )}
              </p>
            )}
          </div>
        </div>

        <div className="relative mb-8 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full border border-gray-700 bg-neutral-950 text-white pl-9 pr-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-gray-500 transition-colors"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>No products found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>

            {meta && meta.totalPages > 1 && (
              <div className="flex flex-col items-center gap-2 mt-10">
                <div className="flex items-center justify-center gap-1">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1.5 border border-gray-700 rounded-lg text-sm disabled:opacity-30 hover:border-gray-500 transition-colors"
                  >
                    Prev
                  </button>
                  {getPageNumbers(page, meta.totalPages).map((p, i) =>
                    p === "..." ? (
                      <span key={`e-${i}`} className="px-2 text-gray-600">...</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-lg text-sm transition-colors ${
                          p === page ? "bg-white text-black font-semibold" : "border border-gray-700 hover:border-gray-500"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                  <button
                    disabled={page >= meta.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1.5 border border-gray-700 rounded-lg text-sm disabled:opacity-30 hover:border-gray-500 transition-colors"
                  >
                    Next
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Page {meta.page} of {meta.totalPages}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}