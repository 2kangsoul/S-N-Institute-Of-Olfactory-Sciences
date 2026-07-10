import { Suspense } from "react";
import Products from "@/src/page/Products";
import type { ProductType } from "@/src/Features/product/types/productTypes";

export const metadata = {
  title: "Curated Collection | Saa Fragrance",
  description:
    "Eksplorasi mahakarya wewangian niche & designer dengan performa 'beast mode'. Sillage, projection, dan longevity terkurasi.",
};

// ISR: katalog di-render di server, re-generate tiap 60 detik.
export const revalidate = 60;

// ponytail: endpoint publik Express; ISR gagal-halus -> [] biar client hook fetch ulang.
async function getProducts(): Promise<ProductType[]> {
  const base = process.env.API_URL || "http://localhost:8000/api";
  try {
    const res = await fetch(`${base}/products`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? json ?? [];
  } catch {
    return []; // server down saat build/revalidate -> client (useProducts) fetch sendiri
  }
}

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    // Suspense wajib karena useProductFilters memakai useSearchParams()
    <Suspense fallback={null}>
      <Products initialProducts={products.length ? products : undefined} />
    </Suspense>
  );
}
