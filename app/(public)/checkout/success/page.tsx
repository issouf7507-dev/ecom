"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import {
  getOrderSuccess,
  buildWhatsAppOrderMessage,
  type OrderSuccessData,
} from "@/lib/utils/orderSuccess";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderSuccessData | null>(null);

  useEffect(() => {
    const data = getOrderSuccess();
    if (!data) {
      router.replace("/");
      return;
    }
    setOrderData(data);
  }, [router]);

  const handleRenvoyerWhatsApp = () => {
    if (!orderData || !WHATSAPP_NUMBER) return;
    const text = buildWhatsAppOrderMessage(orderData.items, orderData.total);
    const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (!orderData) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-16">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle2 className="size-16 text-green-600" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Commande confirmée
          </h1>
          <p className="text-muted-foreground">
            Merci pour votre commande. Nous avons bien reçu votre demande.
          </p>
        </div>

        <div className="rounded-lg border bg-muted/30 p-6 text-left space-y-4">
          <div className="flex justify-between items-center pb-3 border-b">
            <span className="font-medium text-muted-foreground">
              N° de commande
            </span>
            <span className="font-bold">{orderData.orderNumber}</span>
          </div>
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {orderData.items.map((item, i) => (
              <li
                key={i}
                className="flex justify-between text-sm"
              >
                <span className="line-clamp-1">
                  {item.name} x {item.quantity}
                </span>
                <span className="font-medium whitespace-nowrap">
                  £{(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between text-base font-bold pt-3 border-t">
            <span>Total</span>
            <span>£{orderData.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            onClick={handleRenvoyerWhatsApp}
            className="gap-2"
          >
            <MessageCircle className="size-5" />
            Renvoyer la commande sur WhatsApp
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/">Retour à l&apos;accueil</Link>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Cliquez sur le bouton ci-dessus si vous souhaitez renvoyer le détail
          de votre commande sur WhatsApp.
        </p>
      </div>
    </div>
  );
}
