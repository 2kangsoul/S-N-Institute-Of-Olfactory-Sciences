export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: UserRole;
  no_handphone: string | null;
  address: string | null;
  profilePic: string | null;
  createdAt: string;
}
