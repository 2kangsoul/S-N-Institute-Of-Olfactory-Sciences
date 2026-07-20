import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/lib/axios";

// ponytail: tabel `perfumes` (backend /api/perfumes) feeds halaman /awards —
// TERPISAH dari tabel `products` (/api/product) yg dipakai toko. Awards butuh
// kolom `category`, products tidak punya. Karena itu form ini nulis ke perfumes.

export interface PerfumeInput {
  name: string;
  brand: string;
  category: string;
  description?: string;
  imageUrl?: string;
  gender?: string;
  year?: number;
}

export interface Perfume extends PerfumeInput {
  id: string;
  totalLikes: number;
}

const PERFUMES_KEY = ["perfumes"];

export const usePerfumes = () =>
  useQuery<Perfume[]>({
    queryKey: PERFUMES_KEY,
    queryFn: async () => (await api.get("/perfumes")).data.data,
  });

export const useCreatePerfume = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PerfumeInput) =>
      (await api.post("/perfumes", payload)).data.data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PERFUMES_KEY });
      qc.invalidateQueries({ queryKey: ["perfumes", "categories"] });
    },
  });
};

export const useDeletePerfume = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/perfumes/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: PERFUMES_KEY }),
  });
};

// Kategori yang punya artwork di halaman /awards (src/page/Awards.tsx CATEGORY_META).
// Bukan free-text supaya kartu awards selalu dapat gambar/accent, bukan fallback.
export const AWARD_CATEGORIES = [
  "Best Citrus",
  "Best Floral",
  "Best Fresh",
  "Best Gourmand",
  "Best Niche",
  "Best Oriental",
  "Best Oud",
  "Best Woody",
] as const;
