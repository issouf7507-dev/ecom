// Composant Header pour la navigation

"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartContext } from "@/contexts/CartContext";
import { useCheckout } from "@/hooks/useCheckout";
import type { CheckoutInput } from "@/lib/api/checkout";
import React, { useState } from "react";
import {
  Menu,
  X,
  User,
  Package,
  ChevronDown,
  Check,
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

function buildWhatsAppOrderMessage(
  cartItems: { product: { name: string; price: number }; quantity: number }[],
  total: number
): string {
  const lines = [
    "🛒 *Nouvelle commande - Kik Game*",
    "",
    ...cartItems.map(
      (item) =>
        `• ${item.product.name} x ${item.quantity} - £${(item.product.price * item.quantity).toFixed(2)}`
    ),
    "",
    `*Total : £${total.toFixed(2)}*`,
  ];
  return lines.join("\n");
}

export function Header() {
  const {
    items: cartItems,
    itemCount,
    total,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCartContext();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const checkoutMutation = useCheckout();
  const isSubmitting = checkoutMutation.isPending;
  const marqueeItems = [
    { label: "Guaranteed Authenticity", href: "/collections/accessories" },
    { label: "Next Day Shipping On Select Sizes", href: "/collections" },
    { label: "Orders £300+ Ship Free", href: "/collections" },
    { label: "Shop Now. Pay it in 4 | Clearpay", href: "/collections" },
  ];

  const navLinks = [
    {
      id: "home",
      name: "Accueil",
      href: "/",
    },
    {
      id: "products",
      name: "Produits",
      href: "/products",
    },
    {
      id: "new-arrivals",
      name: "Nouveautés",
      href: "/collections/new-arrivals",
    },


    {
      id: "pre-orders",
      name: "Précommandes",
      href: "/collections/produits-a-venir",
    },
    {
      id: "accessories",
      name: "Accessoires",
      href: "/accessories",
    },

  ];

  const utilityLinks = [
    {
      name: "Log in",
      href: "https://www.kickgame.co.uk/customer_authentication/redirect?locale=en&region_country=GB",
      icon: User,
    },
    {
      name: "Track your order",
      href: "/pages/track-your-order",
      icon: Package,
    },
  ];

  // Simplified list for the dropdown example
  const countryOptions = [
    {
      code: "GB",
      name: "GBP",
      currency: "£",
      isCurrent: true,
      flagUrl: "//cdn.shopify.com/static/images/flags/gb.svg?width=32",
    },
    {
      code: "AD",
      name: "EUR",
      currency: "€",
      isCurrent: false,
      flagUrl: "//cdn.shopify.com/static/images/flags/ad.svg?width=32",
    },
    {
      code: "AU",
      name: "AUD",
      currency: "$",
      isCurrent: false,
      flagUrl: "//cdn.shopify.com/static/images/flags/au.svg?width=32",
    },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const currentCountry =
    countryOptions.find((c) => c.isCurrent) || countryOptions[0];
  return (
    <div>
      <div className="w-full sticky top-0 z-50 bg-black text-white py-2 border-b overflow-hidden orbitron">
        <div className="relative flex overflow-hidden">
          {/* Track */}
          <div className="flex whitespace-nowrap animate-marquee hover:paused">
            {[...Array(4)].map((_, i) => (
              <React.Fragment key={i}>
                {marqueeItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center text-sm lg:text-base mx-6"
                  >
                    <a
                      href={item.href}
                      className="hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.label}
                    </a>
                    <span className="mx-6">•</span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <header className="header relative max-xl:gap-x-4 header--top-center header--mobile-center header--has-menu text-gray-900 px-4 py-4 orbitron">
        {/* desktop menu */}
        <div>
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3">
              <div className=" ">
                <div className="cursor-pointer">
                  <User className="size-7" />
                </div>
              </div>
              <div className=" md:text-center">
                <div>Kik Game</div>
              </div>
              <div className="place-items-end">
                <div className="flex items-center gap-2">

                  <div
                    className="relative cursor-pointer"
                    onClick={() => setIsCartOpen(true)}
                  >
                    <ShoppingCart className="size-7" />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <nav className="hidden md:block">
              <ul className="flex gap-4">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      className="text-md font-semibold py-4 uppercase hover:text-gray-600 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* cart drawer */}
        {isCartOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
              onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div className="fixed top-0 right-0 h-full w-[40%] bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold">Panier</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Fermer le panier"
                >
                  <X className="size-6" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingCart className="size-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg mb-2">
                      Votre panier est vide
                    </p>
                    <p className="text-gray-400 text-sm">
                      Ajoutez des produits pour commencer
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex flex-col md:flex-row gap-4 pb-4 border-b last:border-b-0"
                      >
                        {/* Product Image */}
                        <div className=" bg-gray-100 rounded-md">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            width={200}
                            height={200}
                            className="object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-4 line-clamp-2 mb10">
                            {item.product.name}
                          </h3>
                          <p className="text-gray-600 text-lg mb-6">
                            {item.product.price.toFixed(2)} FCFA
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <div className="border border-gray-300 rounded-lg p-3 inline-block">
                              <div className="flex items-center gap-10 ">
                                <button
                                  onClick={() => {
                                    if (item.quantity > 1) {
                                      updateQuantity(
                                        item.product.id,
                                        item.quantity - 1
                                      );
                                    } else {
                                      removeFromCart(item.product.id);
                                    }
                                  }}
                                  className="p-1 hover:bg-gray-100 rounded transition-colors orbitron"
                                  aria-label="Diminuer la quantité"
                                >
                                  <Minus className="size-4" />
                                </button>
                                <span className="w-8 text-center text-lg font-medium orbitron">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => {
                                    if (item.quantity < item.product.stock) {
                                      updateQuantity(
                                        item.product.id,
                                        item.quantity + 1
                                      );
                                    }
                                  }}
                                  disabled={item.quantity >= item.product.stock}
                                  className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  aria-label="Augmenter la quantité"
                                >
                                  <Plus className="size-4" />
                                </button>
                              </div>
                            </div>
                            <div>
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="ml-auto p-1"
                                aria-label="Supprimer l'article"
                              >
                                <Trash2 className="size-9" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="border-t p-6 space-y-4">
                  {/* Total */}
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>£{total.toFixed(2)}</span>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button
                      variant="default"
                      size="lg"
                      className="w-full"
                      onClick={() => setIsCheckoutModalOpen(true)}
                    >
                      Passer la commande
                    </Button>
                    <Button
                      variant="outline"
                      size="default"
                      className="w-full"
                      onClick={clearCart}
                    >
                      Vider le panier
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Modal confirmation commande → WhatsApp */}
        <Dialog
          open={isCheckoutModalOpen}
          onOpenChange={(open) => {
            setIsCheckoutModalOpen(open);
            if (!open) {
              setWhatsappNumber("");
              setCheckoutError(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmer la commande</DialogTitle>
              <DialogDescription>
                Entrez votre numéro WhatsApp. La commande sera enregistrée et
                vous pourrez envoyer le détail sur WhatsApp.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp-number">
                  Numéro WhatsApp <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="whatsapp-number"
                  type="tel"
                  placeholder="+33 6 12 34 56 78"
                  value={whatsappNumber}
                  onChange={(e) => {
                    setWhatsappNumber(e.target.value);
                    setCheckoutError(null);
                  }}
                  className="w-full"
                  disabled={isSubmitting}
                />
              </div>
              <div className="rounded-lg border bg-muted/50 p-4 space-y-2 max-h-48 overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between text-sm"
                  >
                    <span className="line-clamp-1">
                      {item.product.name} x {item.quantity}
                    </span>
                    <span className="font-medium whitespace-nowrap">
                      £
                      {(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-base font-bold border-t pt-3">
                <span>Total</span>
                <span>£{total.toFixed(2)}</span>
              </div>
              {checkoutError && (
                <p className="text-sm text-destructive">{checkoutError}</p>
              )}
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setIsCheckoutModalOpen(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                disabled={
                  isSubmitting ||
                  !whatsappNumber.trim() ||
                  whatsappNumber.replace(/\D/g, "").length < 10
                }
                onClick={async () => {
                  const raw = whatsappNumber.replace(/\D/g, "").trim();
                  if (!raw || raw.length < 10) {
                    setCheckoutError("Veuillez entrer un numéro WhatsApp valide.");
                    return;
                  }
                  if (!WHATSAPP_NUMBER) {
                    setCheckoutError(
                      "Numéro boutique non configuré. Contactez le support."
                    );
                    return;
                  }
                  setCheckoutError(null);
                  const input: CheckoutInput = {
                    items: cartItems.map((item) => ({
                      productId: item.product.id,
                      quantity: item.quantity,
                    })),
                    whatsappNumber: raw,
                  };
                  try {
                    await checkoutMutation.mutateAsync(input);
                    const text = buildWhatsAppOrderMessage(cartItems, total);
                    const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
                    window.open(url, "_blank", "noopener,noreferrer");
                    clearCart();
                    setIsCheckoutModalOpen(false);
                    setIsCartOpen(false);
                  } catch (err) {
                    setCheckoutError(
                      err instanceof Error ? err.message : "Erreur lors de la création de la commande."
                    );
                  }
                }}
              >
                {isSubmitting
                  ? "Enregistrement..."
                  : "Valider et envoyer sur WhatsApp"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>
    </div>
  );
}
