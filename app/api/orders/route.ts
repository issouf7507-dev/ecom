import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/lib/api/orders";
import type { OrderFilters, OrderStatus, PaymentStatus } from "@/lib/api/orders";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") as OrderStatus | null;
    const paymentStatus = searchParams.get("paymentStatus") as PaymentStatus | null;
    const search = searchParams.get("search") ?? undefined;

    const filters: OrderFilters = {};
    if (status) filters.status = status;
    if (paymentStatus) filters.paymentStatus = paymentStatus;
    if (search) filters.search = search;

    const orders = await orderService.getOrders(filters);
    const stats = await orderService.getStats();

    return NextResponse.json({ orders, stats });
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des commandes" },
      { status: 500 }
    );
  }
}
