import { api } from "@/src/lib/axios";
import { AuthUser, LoginPayload, RegisterPayload } from "./auth.types";
import { ApiResponse } from "@/src/types/api-response.type";
export const authService = {
  register: async (payload: RegisterPayload): Promise<AuthUser> => {
    const { data } = await api.post<ApiResponse<{ safeRegister: AuthUser }>>(
      "/auth/register",
      payload,
    );
    return data.data.safeRegister; // register nested, harus di-unwrap
  },

  login: async (payload: LoginPayload): Promise<AuthUser> => {
    const { data } = await api.post<
      ApiResponse<{ safeLogin: AuthUser; signToken: string }>
    >("/auth/login", payload);
    return data.data.safeLogin; // login gak nested, langsung ambil
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  me: async (): Promise<AuthUser> => {
    const { data } = await api.get<ApiResponse<AuthUser>>("/auth/me");
    return data.data;
  },
};
