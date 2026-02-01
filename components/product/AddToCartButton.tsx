// Bouton pour ajouter au panier

"use client";

import { Product } from "@/types";
import { useCartContext } from "@/contexts/CartContext";
import { useState } from "react";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
}

export function AddToCartButton({ product, quantity = 1 }: AddToCartButtonProps) {
  const { addToCart } = useCartContext();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity);
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || product.stock === 0}
      className="w-full px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {isAdding ? "Ajout en cours..." : "Ajouter au panier"}
    </button>
  );
}

