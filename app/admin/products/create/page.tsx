"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateProduct } from "@/src/Features/product-snn/product.query";
import { useAuthStore } from "@/src/stores/useAuthStore";

export default function CreateProductPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createProduct, isPending } = useCreateProduct();

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/products");
    }
  }, [isAdmin, router]);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Nama produk wajib diisi";
    if (!brand.trim()) newErrors.brand = "Brand wajib diisi";
    if (!type.trim()) newErrors.type = "Tipe produk wajib diisi";
    if (!description.trim()) newErrors.description = "Deskripsi wajib diisi";
    if (!price || Number(price) <= 0) newErrors.price = "Harga harus lebih dari 0";
    if (stock === "" || Number(stock) < 0) newErrors.stock = "Stok tidak boleh negatif";
    if (!file) newErrors.file = "Gambar produk wajib diupload";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("brand", brand.trim());
    formData.append("type", type.trim());
    formData.append("description", description.trim());
    formData.append("price", price);
    formData.append("stock", stock);
    if (file) formData.append("image", file);

    createProduct(formData, {
      onSuccess: () => {
        toast.success("Produk berhasil dibuat");
        router.push("/products");
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Gagal membuat produk");
      },
    });
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-8">Create Product</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Nama Produk</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-700 bg-neutral-950 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-gray-500"
              placeholder="Acqua di Gio Profondo"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Brand</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full border border-gray-700 bg-neutral-950 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-gray-500"
                placeholder="Giorgio Armani"
              />
              {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Tipe</label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-gray-700 bg-neutral-950 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-gray-500"
                placeholder="Parfum"
              />
              {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border border-gray-700 bg-neutral-950 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-gray-500 resize-none"
              placeholder="Deskripsi produk..."
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Harga (Rp)</label>
              <input
                type="number"
                min={1}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-700 bg-neutral-950 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-gray-500"
                placeholder="2450000"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Stok</label>
              <input
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full border border-gray-700 bg-neutral-950 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-gray-500"
                placeholder="10"
              />
              {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Gambar Produk</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white file:text-black file:text-sm file:font-semibold hover:file:bg-gray-200 file:cursor-pointer cursor-pointer"
            />
            {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
            {preview && (
              <div className="mt-3 w-40 aspect-square rounded-lg overflow-hidden border border-gray-800">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="bg-white text-black px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {isPending ? "Menyimpan..." : "Simpan Produk"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="border border-gray-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:border-gray-500 transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}