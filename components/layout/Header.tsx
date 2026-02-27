// Composant Header pour la navigation - VERSION RESPONSIVE

"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartContext } from "@/contexts/CartContext";
import { useCheckout } from "@/hooks/useCheckout";
import type { CheckoutInput } from "@/lib/api/checkout";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  Menu,
  X,
  User,
  Package,
  ChevronDown,

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
import { useRouter } from "next/navigation";
import {
  storeOrderSuccess,
  buildWhatsAppOrderMessage,
} from "@/lib/utils/orderSuccess";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

const formatFCFA = (amount: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

export function Header() {
  const router = useRouter();
  const {
    items: cartItems,
    itemCount,
    total,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCartContext();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    {
      id: "salon-beaute",
      name: "Salon de beauté",
      href: "/salon-de-beaute",
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

  const handleValidateOrder = async () => {
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
      const result = await checkoutMutation.mutateAsync(input);
      const orderItems = cartItems.map((item) => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      }));
      storeOrderSuccess({
        orderNumber: result.orderNumber,
        total: result.total,
        items: orderItems,
      });
      const text = buildWhatsAppOrderMessage(orderItems, result.total);
      const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank", "noopener,noreferrer");
      clearCart();
      setIsCheckoutModalOpen(false);
      setIsCartOpen(false);
      toast.success("Commande validée");
      router.push("/checkout/success");
    } catch (err) {
      setCheckoutError(
        err instanceof Error ? err.message : "Erreur lors de la création de la commande."
      );
    }
  };

  return (
    <div>
      {/* Marquee Banner */}
      <div className="w-full sticky top-0 z-50 bg-black text-white py-1.5 sm:py-2 border-b overflow-hidden orbitron">
        <div className="relative flex overflow-hidden">
          {/* Track */}
          <div className="flex whitespace-nowrap animate-marquee hover:paused">
            {[...Array(4)].map((_, i) => (
              <React.Fragment key={i}>
                {marqueeItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center text-xs sm:text-sm lg:text-base mx-3 sm:mx-6"
                  >
                    <a
                      href={item.href}
                      className="hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.label}
                    </a>
                    <span className="mx-3 sm:mx-6">•</span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="header relative max-xl:gap-x-4 header--top-center header--mobile-center header--has-menu text-gray-900 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 orbitron">
        {/* Top Bar with Logo and Icons */}
        <div>
          <div className="grid grid-cols-3 items-center gap-2 sm:gap-4">
            {/* Left: Menu Icon (Mobile) / User Icon (Desktop) */}
            <div className="flex items-center">
              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden cursor-pointer p-1"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Ouvrir le menu"
              >
                <Menu className="size-6 sm:size-7" />
              </button>

              {/* Desktop User Icon */}
              <div className="hidden md:block cursor-pointer">
                <User className="size-6 lg:size-7" />
              </div>
            </div>

            {/* Center: Logo */}
            <div className="text-center">
              <Link href="/" className="text-base sm:text-lg lg:text-xl font-bold">
                Kik Game
              </Link>
            </div>

            {/* Right: Cart Icon */}
            <div className="flex items-center justify-end gap-2 sm:gap-3">
              <div
                className="relative cursor-pointer p-1"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="size-6 sm:size-7" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-orange-500 text-white text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center justify-center mt-3 sm:mt-4">
            <nav className="hidden md:block">
              <ul className="flex gap-3 lg:gap-4 xl:gap-6">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      className="text-xs lg:text-sm xl:text-base font-semibold py-2 uppercase hover:text-gray-600 transition-colors whitespace-nowrap"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <div className="fixed top-0 left-0 h-full w-[80%] max-w-sm bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out md:hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-bold">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Fermer le menu"
                >
                  <X className="size-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-1">
                  {navLinks.map((link) => (
                    <li key={link.id}>
                      <a
                        href={link.href}
                        className="block px-4 py-3 text-base font-semibold uppercase hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Footer with User Actions */}
              <div className="border-t p-4 space-y-2">
                {utilityLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={index}
                      href={link.href}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Icon className="size-5" />
                      <span className="text-sm font-medium">{link.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Cart Drawer */}
        {isCartOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
              onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer - Responsive Width */}
            <div className="fixed top-0 right-0 h-full w-full sm:w-[85%] md:w-[60%] lg:w-[45%] xl:w-[40%] max-w-2xl bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out">
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b">
                <h2 className="text-xl sm:text-2xl font-bold">Panier</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Fermer le panier"
                >
                  <X className="size-5 sm:size-6" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingCart className="size-12 sm:size-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-base sm:text-lg mb-2">
                      Votre panier est vide
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Ajoutez des produits pour commencer
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex gap-3 sm:gap-4 pb-4 border-b last:border-b-0"
                      >
                        {/* Product Image */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            width={200}
                            height={200}
                            className="object-cover w-full h-full"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0 flex flex-col">
                          <h3 className="font-semibold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 line-clamp-2">
                            {item.product.name}
                          </h3>
                          <p className="text-gray-600 text-sm sm:text-base mb-2 sm:mb-3">
                            {formatFCFA(item.product.price)} FCFA
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 sm:gap-3 mt-auto">
                            <div className="border border-gray-300 rounded-lg p-1.5 sm:p-2 inline-flex">
                              <div className="flex items-center gap-3 sm:gap-6">
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
                                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                                  aria-label="Diminuer la quantité"
                                >
                                  <Minus className="size-3 sm:size-4" />
                                </button>
                                <span className="w-6 sm:w-8 text-center text-sm sm:text-base font-medium">
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
                                  <Plus className="size-3 sm:size-4" />
                                </button>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="p-1.5 sm:p-2 hover:bg-red-50 rounded transition-colors"
                              aria-label="Supprimer l'article"
                            >
                              <Trash2 className="size-5 sm:size-6 text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="border-t p-4 sm:p-6 space-y-3 sm:space-y-4">
                  {/* Total */}
                  <div className="flex items-center justify-between text-base sm:text-lg font-bold">
                    <span>Total</span>
                    <span>{formatFCFA(total)} FCFA</span>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button
                      variant="default"
                      size="lg"
                      className="w-full text-sm sm:text-base"
                      onClick={() => setIsCheckoutModalOpen(true)}
                    >
                      Passer la commande
                    </Button>
                    <Button
                      variant="outline"
                      size="default"
                      className="w-full text-sm sm:text-base"
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
          <DialogContent className="sm:max-w-md w-[95%] sm:w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Confirmer la commande</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                Entrez votre numéro WhatsApp. La commande sera enregistrée et
                vous pourrez envoyer le détail sur WhatsApp.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp-number" className="text-sm sm:text-base">
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
                  className="w-full text-sm sm:text-base"
                  disabled={isSubmitting}
                />
              </div>
              <div className="rounded-lg border bg-muted/50 p-3 sm:p-4 space-y-2 max-h-40 sm:max-h-48 overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between text-xs sm:text-sm gap-2"
                  >
                    <span className="line-clamp-1">
                      {item.product.name} x {item.quantity}
                    </span>
                    <span className="font-medium whitespace-nowrap">
                      £{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm sm:text-base font-bold border-t pt-2 sm:pt-3">
                <span>Total</span>
                <span>{formatFCFA(total)} FCFA</span>
              </div>
              {checkoutError && (
                <p className="text-xs sm:text-sm text-destructive">{checkoutError}</p>
              )}
            </div>
            <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row">
              <Button
                variant="outline"
                onClick={() => setIsCheckoutModalOpen(false)}
                disabled={isSubmitting}
                className="w-full sm:w-auto text-sm sm:text-base"
              >
                Annuler
              </Button>
              <Button
                disabled={
                  isSubmitting ||
                  !whatsappNumber.trim() ||
                  whatsappNumber.replace(/\D/g, "").length < 10
                }
                onClick={handleValidateOrder}
                className="w-full sm:w-auto text-sm sm:text-base"
              >
                {isSubmitting
                  ? "Enregistrement..."
                  : "Valider et envoyer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>
    </div>
  );
}