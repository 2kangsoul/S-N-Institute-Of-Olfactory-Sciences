import { api } from "@/src/lib/axios";
import { CreateOrderPayload, Order } from "./order.type";

export class OrderService {
  static async createOrder(payload: CreateOrderPayload) {
    const { data } = await api.post<{ data: Order }>(
      "/order/create",
      payload,
    );
    return data.data;
  }
}