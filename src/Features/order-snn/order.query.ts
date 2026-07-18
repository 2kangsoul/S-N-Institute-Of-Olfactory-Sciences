import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OrderService } from "./order.services";
import { CreateOrderPayload, OrderStatus } from "./order.type";

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => OrderService.createOrder(payload),
  });
};

export const useGetOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: OrderService.getOrders,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      OrderService.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => OrderService.deleteOrder(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });
};