import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "./auth.services";
import { AuthUser } from "./auth.types";
export const AUTH_ME_KEY = ["auth", "me"];
export const useMe = () => {
  return useQuery<AuthUser>({
    queryKey: AUTH_ME_KEY,
    queryFn: authService.me,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};
export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_ME_KEY, user);
    },
  });
};
export const useRegister = () => {
  return useMutation({
    mutationFn: authService.register,
  });
};
export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.setQueryData(AUTH_ME_KEY, null);
    },
  });
};

