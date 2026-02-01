import { prisma } from "@/lib/prisma";
import type { CheckoutInput, CheckoutResult } from "./types";

export class CheckoutRepository {
  async createOrderAndUpdateStock(input: CheckoutInput): Promise<CheckoutResult> {
    const { items, whatsappNumber } = input;
    const cleanWhatsApp = whatsappNumber.replace(/\D/g, "").trim();

    return prisma.$transaction(async (tx) => {
      const productIds = items.map((i) => i.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
        select: {
          id: true,
          name: true,
          price: true,
          stockQuantity: true,
          variants: { select: { sku: true }, take: 1 },
        },
      });

      const productMap = new Map(products.map((p) => [p.id, p]));
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

      let subtotal = 0;
      const orderItemsInput = items.map((item) => {
        const product = productMap.get(item.productId)!;
        const price = product.price;
        const qty = item.quantity;
        const lineTotal = price * qty;
        subtotal += lineTotal;
        const sku = product.variants?.[0]?.sku ?? product.id;
        return {
          productId: product.id,
          name: product.name,
          sku,
          price,
          quantity: qty,
          subtotal: lineTotal,
        };
      });

      const orderData = {
        orderNumber,
        status: "PENDING" as const,
        paymentStatus: "PENDING" as const,
        paymentMethod: "whatsapp",
        subtotal,
        tax: 0,
        shipping: 0,
        discount: 0,
        total: subtotal,
        whatsappNumber: cleanWhatsApp,
        currency: "FCFA" as const,
      };

      const created = await tx.order.create({
        data: { ...orderData, items: { create: orderItemsInput } },
        include: { items: true },
      });

      for (const item of items) {
        const product = productMap.get(item.productId)!;
        await tx.product.update({
          where: { id: product.id },
          data: { stockQuantity: { decrement: item.quantity } },
        });
        await tx.inventory.create({
          data: {
            productId: product.id,
            type: "SALE",
            quantity: -item.quantity,
            reason: `Commande ${orderNumber}`,
            referenceId: created.id,
          },
        });
      }

      return {
        orderId: created.id,
        orderNumber: created.orderNumber,
        total: created.total,
      };
    });
  }

  async getProductsForCheckout(productIds: string[]) {
    return prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        price: true,
        stockQuantity: true,
        variants: { select: { sku: true }, take: 1 },
      },
    });
  }
}

export const checkoutRepository = new CheckoutRepository();
