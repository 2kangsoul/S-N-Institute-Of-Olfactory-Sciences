import { api } from "@/src/lib/axios";
import { CreateOrderPayload, Order, OrderStatus } from "./order.type";

// export class OrderService {
//   static async createOrder(payload: CreateOrderPayload) {
//     const { data } = await api.post<{ data: Order }>(
//       "/order/create",
//       payload,
//     );
//     return data.data;
//   }
// }

export class OrderService {
  static async createOrder(payload: CreateOrderPayload) {
    const response = await api.post<{ data: Order }>("/order/create", payload);
    return response.data.data;
  }

  static async getOrders() {
    const response = await api.get<{ data: Order[] }>("/order/get");
    return response.data.data;
  }

  static async updateStatus(id: string, status: OrderStatus) {
    const response = await api.patch<{ data: Order }>(`/order/update/${id}`, { status });
    return response.data.data;
  }

  static async deleteOrder(id: string) {
    const response = await api.delete<{ data: Order }>(`/order/delete/${id}`);
    return response.data.data;
  }
}