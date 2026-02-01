export interface CheckoutItemInput {
  productId: string;
  quantity: number;
}

export interface CheckoutInput {
  items: CheckoutItemInput[];
  whatsappNumber: string;
}

export interface CheckoutResult {
  orderId: string;
  orderNumber: string;
  total: number;
}
