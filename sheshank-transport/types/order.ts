export type OrderStatus = 'Pending' | 'Confirmed' | 'Dispatched' | 'In Transit' | 'Delivered';

export type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  pickup_location: string;
  destination: string;
  material_name: string;
  vehicle_type: string;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  material_id: string;
  material_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  unit: string;
  created_at: string;
};

export type CartOrderItemInput = {
  material_id: string;
  material_name: string;
  quantity: number;
  unit_price: number;
  unit: string;
};

export type CreateOrderInput = {
  customer_name: string;
  customer_phone: string;
  pickup_location: string;
  destination: string;
  material_name: string;
  vehicle_type: string;
  total_amount: number;
  items: CartOrderItemInput[];
};
