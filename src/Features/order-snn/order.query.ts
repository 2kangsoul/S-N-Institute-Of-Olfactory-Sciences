import { useMutation } from "@tanstack/react-query";
import { OrderService } from "./order.services";
import { CreateOrderPayload } from "./order.type";

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) =>
      OrderService.createOrder(payload),
  });
};