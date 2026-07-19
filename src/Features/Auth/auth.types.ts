export interface AuthUser {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  no_handphone: string;
  address: string | null;
  profilePic: string | null;
  country: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface RegisterPayload {
  email: string;
  username: string;
  fullName: string;
  password: string;
  contact: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
