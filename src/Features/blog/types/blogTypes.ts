export interface BlogPost {
  id: string | number; // <-- Ubah baris ini agar kebal error
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  content: string;
  likes?: number;
  imageUrl2?: string; // Tambahkan ini (opsional)
  imageUrl3?: string; // Tambahkan ini (opsional)
  approval?: boolean; // <-- TAMBAHAN WAJIB: Agar layar tidak putih crash!
}