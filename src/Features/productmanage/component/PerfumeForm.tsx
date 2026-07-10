// @ts-nocheck
/* eslint-disable */
import React from "react";
import type { PerfumeFormData } from "../types/types"; // Mundur 1 folder ke types

interface PerfumeFormProps {
  formData: PerfumeFormData;
  isLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleAddProduct: (e: React.FormEvent) => void;
}

export default function PerfumeForm({
  formData,
  isLoading,
  handleChange,
  handleAddProduct,
}: PerfumeFormProps) {
  return (
    <div className="p-6 border-r border-gray-200 flex flex-col">
      <form onSubmit={handleAddProduct} className="flex flex-col h-full space-y-3">
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Nama Parfum</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Brand</label>
            <input type="text" name="brand" value={formData.brand} onChange={handleChange} required className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Harga (Rp)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Stock</label>
            <input type="text" name="stock" value={formData.stock} onChange={handleChange} placeholder="Contoh: 15" className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Type</label>
            <input type="text" name="type" value={formData.type} onChange={handleChange} placeholder="Niche / Design" className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Usage Time</label>
            <input type="text" name="usage_time" value={formData.usage_time} onChange={handleChange} placeholder="Day & Night" className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Sillage</label>
            <input type="text" name="sillage" value={formData.sillage} onChange={handleChange} className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Projection</label>
            <input type="text" name="projection" value={formData.projection} onChange={handleChange} className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Longevity</label>
            <input type="text" name="longevity" value={formData.longevity} onChange={handleChange} className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Notes</label>
          <input type="text" name="notes" value={formData.notes} onChange={handleChange} className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none" />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">URL Gambar</label>
          <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none" />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Deskripsi</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-gray-900 focus:outline-none resize-none"></textarea>
        </div>

        <div className="flex items-center gap-2 pb-2">
          <input type="checkbox" name="blind_buy_safe" id="blind_buy_safe" checked={formData.blind_buy_safe} onChange={handleChange} className="w-3.5 h-3.5 rounded border-gray-300 focus:ring-gray-900 cursor-pointer" />
          <label htmlFor="blind_buy_safe" className="text-xs text-gray-800 cursor-pointer">Blind Buy Safe</label>
        </div>

        <button type="submit" disabled={isLoading} className="mt-auto w-full bg-gray-900 text-white font-bold py-2.5 rounded hover:bg-black transition-colors disabled:opacity-50 text-sm">
          {isLoading ? "Menyimpan..." : "+ Simpan Parfum"}
        </button>
      </form>
    </div>
  );
}