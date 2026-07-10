// File: src/types/product.tsx

// Kita tetap menggunakan export interface agar bisa diakses oleh file lain
export interface ProductType {
  id: string; // <-- UPDATE: Mengubah objectId menjadi id menyesuaikan skema Prisma
  name: string;
  brand: string;
  price: number;
  stock: number;
  imageUrl: string;
  sillage: string;
  projection: string;
  longevity: string;
  notes: string;
  description: string;
  type: string;
}

// Karena ini file .tsx, kita bisa menambahkan komponen kecil atau 
// konstanta UI terkait tipe produk di sini jika suatu saat dibutuhkan,
// namun untuk saat ini, ini berfungsi sebagai definisi tipe murni.
const ProductTypeDefinitions = () => null;
export default ProductTypeDefinitions;