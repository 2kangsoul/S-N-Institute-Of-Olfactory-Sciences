export interface BlogManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface BlogFormData {
  title: string;
  category: string;
  excerpt: string;
  author: string;
  imageUrl: string;
  imageUrl2: string;
  imageUrl3: string;
  referenceLink: string;
  content: string;
}

export interface BlogItem {
  id: string; // <-- UPDATE: objectId diubah menjadi id
  title: string;
  category: string;
  excerpt: string;
  author: string;
  imageUrl: string;
  imageUrl2: string;
  imageUrl3: string;
  content: string;
  publishDate?: string;
  approval?: boolean;
  [key: string]: any; // Untuk menangkap properti lain dari Backendless
}