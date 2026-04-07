"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product, CartItem, WeightPrice } from "./types"

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, selectedWeight?: WeightPrice) => void
  removeItem: (productId: number, weightLabel?: string) => void
  updateQuantity: (productId: number, quantity: number, weightLabel?: string) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (product, selectedWeight) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => 
              item.product.id === product.id && 
              item.selectedWeight?.label === selectedWeight?.label
          )
          
          if (existingIndex >= 0) {
            const newItems = [...state.items]
            newItems[existingIndex].quantity += 1
            return { items: newItems }
          }
          
          return {
            items: [...state.items, { product, quantity: 1, selectedWeight }],
          }
        })
      },
      
      removeItem: (productId, weightLabel) => {
        set((state) => ({
          items: state.items.filter(
            (item) => 
              !(item.product.id === productId && 
                item.selectedWeight?.label === weightLabel)
          ),
        }))
      },
      
      updateQuantity: (productId, quantity, weightLabel) => {
        if (quantity <= 0) {
          get().removeItem(productId, weightLabel)
          return
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId && 
            item.selectedWeight?.label === weightLabel
              ? { ...item, quantity }
              : item
          ),
        }))
      },
      
      clearCart: () => set({ items: [] }),
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      
      getTotal: () => {
        const state = get()
        return state.items.reduce((total, item) => {
          const price = item.selectedWeight?.price ?? item.product.price ?? 0
          return total + price * item.quantity
        }, 0)
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: "palia-cart",
    }
  )
)
