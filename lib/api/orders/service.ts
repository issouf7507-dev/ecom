import { orderRepository } from "./repository";
import type {
  OrderList,
  OrderFilters,
  OrderItemDisplay,
  OrderStatus,
  PaymentStatus,
} from "./types";

function formatAddress(address: { address1: string; city: string; postalCode: string; country: string } | null): string {
  if (!address) return "-";
  return [address.address1, address.city, address.postalCode, address.country]
    .filter(Boolean)
    .join(", ");
}

export class OrderService {
  async getOrders(filters?: OrderFilters): Promise<OrderList[]> {
    const orders = await orderRepository.findAll(filters);
    return orders.map((o) => {
      const customer = o.user?.name ?? (o.whatsappNumber ? `WhatsApp ${o.whatsappNumber}` : "Client invité");
      const email = o.user?.email ?? "-";
      const products: OrderItemDisplay[] = o.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
      }));
      const shippingAddress = o.shippingAddress
        ? formatAddress(o.shippingAddress)
        : "-";

      return {
        id: o.id,
        orderNumber: o.orderNumber,
        customer,
        email,
        products,
        total: o.total,
        status: o.status as OrderList["status"],
        paymentStatus: o.paymentStatus as OrderList["paymentStatus"],
        shippingAddress,
        whatsappNumber: o.whatsappNumber,
        createdAt: o.createdAt.toISOString(),
        shippedAt: o.shippedAt?.toISOString() ?? null,
        deliveredAt: o.deliveredAt?.toISOString() ?? null,
        cancelledAt: o.cancelledAt?.toISOString() ?? null,
      } satisfies OrderList;
    });
  }

  async getOrderById(id: string) {
    return orderRepository.findById(id);
  }

  async getStats() {
    return orderRepository.getStats();
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    const existing = await orderRepository.findById(id);
    if (!existing) {
      throw new Error("Commande non trouvée");
    }
    return orderRepository.updateStatus(id, status);
  }

  async updateOrderPaymentStatus(id: string, paymentStatus: PaymentStatus) {
    const existing = await orderRepository.findById(id);
    if (!existing) {
      throw new Error("Commande non trouvée");
    }
    return orderRepository.updatePaymentStatus(id, paymentStatus);
  }
}

export const orderService = new OrderService();
