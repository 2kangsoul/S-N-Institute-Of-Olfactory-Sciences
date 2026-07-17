"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useGetProductById, useUpdateProduct } from "@/src/Features/product-snn/product.query";
import { useAuthStore } from "@/src/stores/useAuthStore";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const { data: product, isLoading: isLoadingProduct, isError } = useGetProductById(id);
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/products");
    }
  }, [isAdmin, router]);

  useEffect(() => {
    if (product && !hydrated) {
      setName(product.name);
      setBrand(product.brand);
      setType(product.type);
      setDescription(product.description);
      setPrice(String(product.price));
      setStock(String(product.stock));
      setPreview(product.imageUrl);
      setHydrated(true);
    }
  }, [product, hydrated]);

  useEffect(() => {
    if (!file) return;
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

    updateProduct(
      { id, formData },
      {
        onSuccess: () => {
          toast.success("Produk berhasil diperbarui");
          router.push("/products");
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Gagal memperbarui produk");
        },
      }
    );
  };

  if (!isAdmin) return null;

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-500">Memuat data produk...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Produk tidak ditemukan.</p>
        <button
          onClick={() => router.push("/products")}
          className="border border-gray-700 px-4 py-2 rounded-lg text-sm hover:border-gray-500"
        >
          Kembali ke Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-8">Edit Product</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Nama Produk</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-700 bg-neutral-950 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-gray-500"
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
              />
              {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              Gambar Produk <span className="text-gray-600">(kosongkan jika tidak ingin ganti)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white file:text-black file:text-sm file:font-semibold hover:file:bg-gray-200 file:cursor-pointer cursor-pointer"
            />
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
              {isPending ? "Menyimpan..." : "Simpan Perubahan"}
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