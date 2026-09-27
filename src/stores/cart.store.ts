import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];

  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;

  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;

  clearCart: () => void;

  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // Add product to cart
      addToCart: (item) => {
        set((state) => {
          const existingItem = state.items.find(
            (cartItem) => cartItem.productId === item.productId
          );

          // If product already exists, increase quantity
          if (existingItem) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.productId === item.productId
                  ? {
                      ...cartItem,
                      quantity: cartItem.quantity + item.quantity,
                    }
                  : cartItem
              ),
            };
          }

          // Otherwise add new product
          return {
            items: [...state.items, item],
          };
        });
      },

      // Remove product completely
      removeFromCart: (productId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => item.productId !== productId
          ),
        }));
      },

      // Increase quantity
      increaseQuantity: (productId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item
          ),
        }));
      },

      // Decrease quantity
      decreaseQuantity: (productId) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.productId === productId
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                  }
                : item
            )
            // Remove item if quantity reaches 0
            .filter((item) => item.quantity > 0),
        }));
      },

      // Clear entire cart
      clearCart: () => {
        set({
          items: [],
        });
      },

      // Calculate total price
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      // Calculate total quantity
      getItemCount: () => {
        return get().items.reduce(
          (total, item) => total + item.quantity,
          0
        );
      },
    }),
    {
      name: "j2-cart",
    }
  )
);