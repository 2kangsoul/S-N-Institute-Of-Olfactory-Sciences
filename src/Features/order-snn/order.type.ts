export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "DELIVERED"
  | "PAID"
  | "REJECTED"
  | "REFUNDED";

export interface OrderProductSnapshot {
  id: string;
  name: string;
  brand: string;
  type: string;
  imageUrl: string;
  price: number;
  stock: number;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: OrderProductSnapshot;
}

export interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: OrderStatus;
  note: string | null;
  createdAt: string;
  items: OrderItem[];
}

export interface CreateOrderPayload {
  productId: string;
  quantity: number;
  note?: string;
}