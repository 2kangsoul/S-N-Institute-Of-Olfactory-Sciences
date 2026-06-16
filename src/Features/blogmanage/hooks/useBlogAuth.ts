import { useAuthStore } from "../../../stores/useAuthStore";

export const useBlogAuth = () => {
  const { user } = useAuthStore();

  const userRole = user?.role || "user";
  const isAdminOrOwner = userRole === "owner" || userRole === "admin";

  return { userRole, isAdminOrOwner };
};