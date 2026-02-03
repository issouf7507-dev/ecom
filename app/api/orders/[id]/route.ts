import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/lib/api/orders";
import type { OrderStatus, PaymentStatus } from "@/lib/api/orders";

const VALID_ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

const VALID_PAYMENT_STATUSES: PaymentStatus[] = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, paymentStatus } = body as {
      status?: OrderStatus;
      paymentStatus?: PaymentStatus;
    };

    if (!status && !paymentStatus) {
      return NextResponse.json(
        { error: "Le statut ou le statut de paiement est requis" },
        { status: 400 }
      );
    }

    if (status && !VALID_ORDER_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Statut invalide" },
        { status: 400 }
      );
    }

    if (paymentStatus && !VALID_PAYMENT_STATUSES.includes(paymentStatus)) {
      return NextResponse.json(
        { error: "Statut de paiement invalide" },
        { status: 400 }
      );
    }

    let order;
    if (status) {
      order = await orderService.updateOrderStatus(id, status);
    }
    if (paymentStatus) {
      order = await orderService.updateOrderPaymentStatus(id, paymentStatus);
    }

    return NextResponse.json({
      id: order!.id,
      orderNumber: order!.orderNumber,
      status: order!.status,
      paymentStatus: order!.paymentStatus,
      shippedAt: order!.shippedAt?.toISOString() ?? null,
      deliveredAt: order!.deliveredAt?.toISOString() ?? null,
      cancelledAt: order!.cancelledAt?.toISOString() ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    if (message.includes("non trouvée")) {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    console.error("Order update error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la commande" },
      { status: 500 }
    );
  }
}
