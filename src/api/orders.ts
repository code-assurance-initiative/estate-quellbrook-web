import { request } from './http';
import type { Order, OrderPage } from './types';

export async function listOrders(page: number, signal?: AbortSignal): Promise<OrderPage> {
  const result = await request<OrderPage>(
    `/orders?page=${page}&pageSize=25`,
    signal ? { signal } : {},
  );
  return result ?? { items: [], page, pageSize: 25, totalCount: 0 };
}

export async function getOrder(orderId: string, signal?: AbortSignal): Promise<Order | undefined> {
  return request<Order>(`/orders/${encodeURIComponent(orderId)}`, signal ? { signal } : {});
}
