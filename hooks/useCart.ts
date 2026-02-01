// Hook pour gérer le panier

import { useState, useEffect } from "react";
import { CartItem, Product } from "@/types";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Charger le panier depuis le localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      
      let newItems: CartItem[];
      if (existingItem) {
        newItems = prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...prevItems, { product, quantity }];
      }

      localStorage.setItem("cart", JSON.stringify(newItems));
      return newItems;
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.product.id !== productId);
      localStorage.setItem("cart", JSON.stringify(newItems));
      return newItems;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      localStorage.setItem("cart", JSON.stringify(newItems));
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("cart");
  };

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    itemCount,
  };
}

