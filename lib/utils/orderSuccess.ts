export interface OrderSuccessItem {
  name: string;
  price: number;
  quantity: number;
}

export interface OrderSuccessData {
  orderNumber: string;
  total: number;
  items: OrderSuccessItem[];
  createdAt: number;
}

const STORAGE_KEY = "orderSuccess";

export function storeOrderSuccess(data: Omit<OrderSuccessData, "createdAt">): void {
  if (typeof window === "undefined") return;
  const payload: OrderSuccessData = {
    ...data,
    createdAt: Date.now(),
  };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function getOrderSuccess(): OrderSuccessData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as OrderSuccessData;
    return data;
  } catch {
    return null;
  }
}

export function buildWhatsAppOrderMessage(
  items: OrderSuccessItem[],
  total: number
): string {
  const lines = [
    "🛒 *Nouvelle commande - Kik Game*",
    "",
    ...items.map(
      (item) =>
        `• ${item.name} x ${item.quantity} - £${(item.price * item.quantity).toFixed(2)}`
    ),
    "",
    `*Total : £${total.toFixed(2)}*`,
  ];
  return lines.join("\n");
}
