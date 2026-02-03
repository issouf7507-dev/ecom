import { prisma } from "@/lib/prisma";
import type { OrderFilters, OrderStatus, PaymentStatus } from "./types";

export class OrderRepository {
  async findAll(filters?: OrderFilters) {
    const where: Record<string, unknown> = {};

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.paymentStatus) {
      where.paymentStatus = filters.paymentStatus;
    }
    if (filters?.search?.trim()) {
      const search = filters.search.trim();
      where.OR = [
        { orderNumber: { contains: search } },
        { whatsappNumber: { contains: search } },
      ];
    }

    return prisma.order.findMany({
      where,
      include: {
        items: true,
        user: {
          select: { name: true, email: true },
        },
        shippingAddress: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        user: true,
        shippingAddress: true,
        billingAddress: true,
        payment: true,
      },
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    const now = new Date();
    const data: Record<string, unknown> = { status };

    if (status === "SHIPPED") {
      data.shippedAt = now;
    } else if (status === "DELIVERED") {
      data.deliveredAt = now;
    } else if (status === "CANCELLED") {
      data.cancelledAt = now;
    }

    return prisma.order.update({
      where: { id },
      data,
      include: {
        items: true,
        user: { select: { name: true, email: true } },
        shippingAddress: true,
      },
    });
  }

  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus) {
    return prisma.order.update({
      where: { id },
      data: { paymentStatus },
      include: {
        items: true,
        user: { select: { name: true, email: true } },
        shippingAddress: true,
      },
    });
  }

  async getStats() {
    const [total, pending, processing, shipped, delivered, cancelled, totalRevenue] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { status: "PENDING" } }),
        prisma.order.count({ where: { status: "PROCESSING" } }),
        prisma.order.count({ where: { status: "SHIPPED" } }),
        prisma.order.count({ where: { status: "DELIVERED" } }),
        prisma.order.count({ where: { status: "CANCELLED" } }),
        prisma.order.aggregate({
          where: { status: { not: "CANCELLED" } },
          _sum: { total: true },
        }),
      ]);

    return {
      total,
      pending,
      processing,
      shipped,
      delivered,
      cancelled,
      totalRevenue: totalRevenue._sum.total ?? 0,
    };
  }
}

export const orderRepository = new OrderRepository();
