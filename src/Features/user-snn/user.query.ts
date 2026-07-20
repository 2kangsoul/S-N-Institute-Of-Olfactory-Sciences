import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserService } from "./user.services";
import { UserRole } from "./user.type";

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: UserService.getUsers,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      UserService.updateRole(id, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => UserService.deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};
