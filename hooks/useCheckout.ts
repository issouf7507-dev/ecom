import { useMutation } from "@tanstack/react-query";
import type { CheckoutInput, CheckoutResult } from "@/lib/api/checkout";

const API_BASE = "/api/orders/checkout";

export function useCheckout() {
  return useMutation({
    mutationFn: async (data: CheckoutInput): Promise<CheckoutResult> => {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "Erreur lors de la création de la commande");
      }

      return result as CheckoutResult;
    },
  });
}
