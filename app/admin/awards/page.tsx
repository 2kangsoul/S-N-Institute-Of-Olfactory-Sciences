"use client";

import { useState } from "react";
import {
  usePerfumes,
  useCreatePerfume,
  useDeletePerfume,
  AWARD_CATEGORIES,
  PerfumeInput,
} from "@/src/Features/awards/awards.service";

const EMPTY: PerfumeInput = {
  name: "",
  brand: "",
  category: AWARD_CATEGORIES[0],
  imageUrl: "",
  gender: "",
  description: "",
};

export default function AdminAwardsPage() {
  const { data: perfumes = [], isLoading } = usePerfumes();
  const create = useCreatePerfume();
  const del = useDeletePerfume();

  const [form, setForm] = useState<PerfumeInput>(EMPTY);
  const [error, setError] = useState("");

  const set = (k: keyof PerfumeInput, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.brand.trim()) {
      setError("Name and brand are required.");
      return;
    }
    create.mutate(
      {
        ...form,
        year: form.year ? Number(form.year) : undefined,
      },
      {
        onSuccess: () => setForm(EMPTY),
        onError: () => setError("Failed to save. Is the backend running?"),
      },
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-semibold mb-1">Manage Awards (Perfumes)</h1>
      <p className="text-white/50 text-sm mb-6">
        Entries here populate the /awards page. Stored in the{" "}
        <code className="text-amber-300">perfumes</code> table.
      </p>

      {/* Add form */}
      <form
        onSubmit={submit}
        className="grid gap-4 md:grid-cols-2 mb-10 max-w-3xl"
      >
        <div>
          <label className="block text-sm text-white/70 mb-1">Name *</label>
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full px-3 py-2 rounded bg-white/5 border border-white/15 outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="block text-sm text-white/70 mb-1">Brand *</label>
          <input
            value={form.brand}
            onChange={(e) => set("brand", e.target.value)}
            className="w-full px-3 py-2 rounded bg-white/5 border border-white/15 outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="block text-sm text-white/70 mb-1">Category *</label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full px-3 py-2 rounded bg-white/5 border border-white/15 outline-none focus:border-amber-400"
          >
            {AWARD_CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-black">
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-white/70 mb-1">
            Image URL
          </label>
          <input
            value={form.imageUrl}
            onChange={(e) => set("imageUrl", e.target.value)}
            className="w-full px-3 py-2 rounded bg-white/5 border border-white/15 outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="block text-sm text-white/70 mb-1">Gender</label>
          <input
            value={form.gender}
            onChange={(e) => set("gender", e.target.value)}
            placeholder="Unisex / Male / Female"
            className="w-full px-3 py-2 rounded bg-white/5 border border-white/15 outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="block text-sm text-white/70 mb-1">Year</label>
          <input
            type="number"
            value={form.year ?? ""}
            onChange={(e) => set("year", e.target.value)}
            className="w-full px-3 py-2 rounded bg-white/5 border border-white/15 outline-none focus:border-amber-400"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-white/70 mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded bg-white/5 border border-white/15 outline-none focus:border-amber-400"
          />
        </div>

        {error && (
          <p className="md:col-span-2 text-red-400 text-sm">{error}</p>
        )}

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={create.isPending}
            className="px-5 py-2 rounded-full bg-amber-400 text-black text-sm font-semibold hover:bg-amber-300 disabled:opacity-50"
          >
            {create.isPending ? "Saving..." : "+ Add Perfume"}
          </button>
        </div>
      </form>

      {/* List */}
      <h2 className="text-lg font-medium mb-3">
        Perfumes ({perfumes.length})
      </h2>
      {isLoading ? (
        <p className="text-white/60">Loading...</p>
      ) : perfumes.length === 0 ? (
        <p className="text-white/60">No perfumes yet — add one above.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/20 text-left text-white/60">
                <th className="p-3">Name</th>
                <th className="p-3">Brand</th>
                <th className="p-3">Category</th>
                <th className="p-3">Likes</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {perfumes.map((p) => (
                <tr key={p.id} className="border-b border-white/10">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{p.brand}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">{p.totalLikes}</td>
                  <td className="p-3">
                    <button
                      onClick={() => del.mutate(p.id)}
                      disabled={del.isPending}
                      className="text-red-400 hover:text-red-300 disabled:opacity-50"
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
    </div>
  );
}
