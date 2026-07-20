import { useAuthStore } from "../../../stores/useAuthStore";

export const useBlogAuth = () => {
  const { user } = useAuthStore();

  const userRole = user?.role || "user";
  const isAdminOrOwner = ["ADMIN", "SUPER_ADMIN", "owner", "admin"].includes(userRole);

  return { userRole, isAdminOrOwner };
};