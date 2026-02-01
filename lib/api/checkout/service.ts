import { checkoutRepository } from "./repository";
import type { CheckoutInput, CheckoutResult } from "./types";

export class CheckoutService {
  async processCheckout(input: CheckoutInput): Promise<CheckoutResult> {
    const cleanWhatsApp = input.whatsappNumber?.replace(/\D/g, "").trim();
    if (!cleanWhatsApp || cleanWhatsApp.length < 10) {
      throw new Error("Numéro WhatsApp invalide ou manquant");
    }

    if (!input.items?.length) {
      throw new Error("Le panier est vide");
    }

    const products = await checkoutRepository.getProductsForCheckout(
      input.items.map((i) => i.productId)
    );
    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of input.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new Error(`Produit introuvable: ${item.productId}`);
      }
      if (product.stockQuantity < item.quantity) {
        throw new Error(
          `Stock insuffisant pour "${product.name}". Disponible: ${product.stockQuantity}, demandé: ${item.quantity}`
        );
      }
    }

    return checkoutRepository.createOrderAndUpdateStock({
      ...input,
      whatsappNumber: cleanWhatsApp,
    });
  }
}

export const checkoutService = new CheckoutService();
