// @ts-nocheck
/* eslint-disable */
import React from "react";
import type { BlogFormData } from "../types/blogManagerTypes";

interface AIGeneratorTabProps {
  formData: BlogFormData;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  isGenerating: boolean;
  handleGenerateAI: () => void;
  editId: string | null;
  isAdminOrOwner: boolean;
  handleCancelEdit: () => void;
  handleSaveBlog: (e: React.FormEvent) => void;
  isSaving: boolean;
  isEditingPending: boolean;
}

export default function AIGeneratorTab({
  formData,
  handleChange,
  isGenerating,
  handleGenerateAI,
  editId,
  isAdminOrOwner,
  handleCancelEdit,
  handleSaveBlog,
  isSaving,
  isEditingPending,
}: AIGeneratorTabProps) {
  return (
    <>
      <div className="flex-1 overflow-hidden p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* KOLOM KIRI */}
          <div className="lg:col-span-4 space-y-4 overflow-y-auto pr-2 pb-10">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Judul Artikel *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 text-sm"
                placeholder="Contoh: Sejarah Parfum Niche"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Kategori *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 text-sm bg-white"
                >
                  <option value="Niche">Niche</option>
                  <option value="Designer">Designer</option>
                  <option value="Tips">Tips</option>
                  <option value="Review">Review</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Penulis
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  disabled // <-- UBAH: Kunci input agar tidak bisa diketik
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-100 text-gray-500 cursor-not-allowed select-none" // <-- UBAH: Jadikan abu-abu visualnya
                  placeholder="Mengambil data..."
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Ringkasan (Excerpt)
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 text-sm resize-none"
                placeholder="Teks singkat yang muncul di kartu blog..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                URL Gambar Cover (Utama) *
              </label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 text-sm"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                URL Gambar 2 (Opsional)
              </label>
              <input
                type="text"
                name="imageUrl2"
                value={formData.imageUrl2}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 text-sm"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                URL Gambar 3 (Opsional)
              </label>
              <input
                type="text"
                name="imageUrl3"
                value={formData.imageUrl3}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 text-sm"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Link Referensi (Bahan AI)
              </label>
              <input
                type="text"
                name="referenceLink"
                value={formData.referenceLink}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 text-sm"
                placeholder="URL artikel/web untuk bahan bacaan AI"
              />
            </div>
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="w-full mt-4 bg-gradient-to-r from-[#F58427] to-orange-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <span className="animate-pulse">
                  ✨ AI Sedang Berpikir...
                </span>
              ) : (
                <>Generate Konten AI</>
              )}
            </button>
          </div>

          {/* KOLOM KANAN */}
          <div className="lg:col-span-8 flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden bg-white">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 shrink-0">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                Full Review (Preview)
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 shrink-0">
                {formData.imageUrl && (
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                    <img
                      src={formData.imageUrl}
                      className="w-full h-full object-cover"
                      alt="Preview 1"
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://via.placeholder.com/400x225?text=Error")
                      }
                    />{" "}
                    <div className="absolute top-2 left-2 bg-black/60 text-[8px] text-white px-1.5 py-0.5 rounded font-bold uppercase">
                      Cover
                    </div>
                  </div>
                )}
                {formData.imageUrl2 && (
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                    <img
                      src={formData.imageUrl2}
                      className="w-full h-full object-cover"
                      alt="Preview 2"
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://via.placeholder.com/400x225?text=Error")
                      }
                    />{" "}
                    <div className="absolute top-2 left-2 bg-black/60 text-[8px] text-white px-1.5 py-0.5 rounded font-bold uppercase">
                      Image 2
                    </div>
                  </div>
                )}
                {formData.imageUrl3 && (
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                    <img
                      src={formData.imageUrl3}
                      className="w-full h-full object-cover"
                      alt="Preview 3"
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://via.placeholder.com/400x225?text=Error")
                      }
                    />{" "}
                    <div className="absolute top-2 left-2 bg-black/60 text-[8px] text-white px-1.5 py-0.5 rounded font-bold uppercase">
                      Image 3
                    </div>
                  </div>
                )}
              </div>
              {!formData.imageUrl &&
                !formData.imageUrl2 &&
                !formData.imageUrl3 && (
                  <div className="w-full h-24 rounded-xl border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-400 shrink-0 text-xs italic">
                    Belum ada URL gambar yang dimasukkan...
                  </div>
                )}
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="w-full min-h-[400px] flex-1 focus:outline-none focus:ring-0 text-sm text-gray-800 leading-relaxed resize-none bg-transparent font-serif"
                placeholder="Hasil AI akan muncul di sini. Anda bisa mengeditnya..."
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 shrink-0">
        {editId && isAdminOrOwner && (
          <button
            onClick={handleCancelEdit}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 text-sm font-bold rounded hover:bg-gray-300 transition-colors"
          >
            Batal Edit
          </button>
        )}
        <button
          onClick={handleSaveBlog}
          disabled={isSaving}
          className="px-8 py-2.5 bg-gray-900 text-white text-sm font-bold rounded hover:bg-black transition-colors disabled:opacity-50"
        >
          {isSaving
            ? "Menyimpan..."
            : editId
              ? isEditingPending
                ? "Terbitkan Artikel (Approve)"
                : "Perbarui Artikel"
              : isAdminOrOwner
                ? "Terbitkan Artikel"
                : "Ajukan Artikel (Review)"}
        </button>
      </div>
    </>
  );
}