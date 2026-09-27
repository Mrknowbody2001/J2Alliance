import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  productId: string;
  productName: string;
  price: number;
  image: string;
}

interface WishlistStore {
  items: WishlistItem[];

  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      // Add product to wishlist
      addToWishlist: (item) => {
        set((state) => {
          // Prevent duplicate products
          const alreadyExists = state.items.some(
            (wishlistItem) => wishlistItem.productId === item.productId
          );

          if (alreadyExists) {
            return state;
          }

          return {
            items: [...state.items, item],
          };
        });
      },

      // Remove product from wishlist
      removeFromWishlist: (productId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => item.productId !== productId
          ),
        }));
      },

      // Add or remove product
      toggleWishlist: (item) => {
        const exists = get().items.some(
          (wishlistItem) => wishlistItem.productId === item.productId
        );

        if (exists) {
          set((state) => ({
            items: state.items.filter(
              (wishlistItem) =>
                wishlistItem.productId !== item.productId
            ),
          }));
        } else {
          set((state) => ({
            items: [...state.items, item],
          }));
        }
      },

      // Check if product is already in wishlist
      isInWishlist: (productId) => {
        return get().items.some(
          (item) => item.productId === productId
        );
      },

      // Remove everything
      clearWishlist: () => {
        set({
          items: [],
        });
      },
    }),
    {
      name: "j2-wishlist",
    }
  )
);