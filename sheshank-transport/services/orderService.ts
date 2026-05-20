import { supabase } from '@/lib/supabase';
import { CreateOrderInput, Order } from '@/types/order';

export async function createOrder(input: CreateOrderInput) {
  const orderPayload = {
    customer_name: input.customer_name.trim(),
    customer_phone: input.customer_phone.trim(),
    pickup_location: input.pickup_location.trim(),
    destination: input.destination.trim(),
    material_name: input.material_name.trim(),
    vehicle_type: input.vehicle_type.trim(),
    total_amount: input.total_amount,
    status: 'Pending',
    created_at: new Date().toISOString(),
  };

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert(orderPayload)
    .select('*')
    .single<Order>();

  if (orderError) {
    throw orderError;
  }

  const orderItemsPayload = input.items.map((item) => ({
    order_id: order.id,
    material_id: item.material_id,
    material_name: item.material_name,
    quantity: item.quantity,
    unit_price: item.unit_price,
    line_total: item.unit_price * item.quantity,
    unit: item.unit,
    created_at: new Date().toISOString(),
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItemsPayload);

  if (itemsError) {
    throw itemsError;
  }

  return order;
}
