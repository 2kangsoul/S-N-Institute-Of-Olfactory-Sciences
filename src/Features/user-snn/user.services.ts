import { api } from "@/src/lib/axios";
import { AdminUser, UserRole } from "./user.type";
export class UserService {
  static async getUsers() {
    const response = await api.get<{ data: AdminUser[] }>("/users");
    return response.data.data;
  }

  static async updateRole(id: string, role: UserRole) {
    const response = await api.put<{ message: string; user: AdminUser }>(
      `/users/${id}`,
      { role },
    );
    return response.data.user;
  }

  static async deleteUser(id: string) {
    const response = await api.delete<{ message: string }>(`/users/${id}`);
    return response.data;
  }
}
