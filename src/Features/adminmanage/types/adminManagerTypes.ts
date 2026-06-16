export interface AdminManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface AdminUser {
  id: string; // UPDATE: objectId diubah menjadi id
  name: string;
  email: string;
  role: string;
}