import { NextRequest, NextResponse } from "next/server";
import { checkoutService } from "@/lib/api/checkout";
import type { CheckoutInput } from "@/lib/api/checkout";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, whatsappNumber } = body as CheckoutInput;

    const result = await checkoutService.processCheckout({ items, whatsappNumber });

    return NextResponse.json({
      orderId: result.orderId,
      orderNumber: result.orderNumber,
      total: result.total,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur lors de la création de la commande";

    if (message.includes("Numéro WhatsApp") || message.includes("panier est vide")) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    if (message.includes("Produit introuvable")) {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    if (message.includes("Stock insuffisant")) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la commande" },
      { status: 500 }
    );
  }
}
