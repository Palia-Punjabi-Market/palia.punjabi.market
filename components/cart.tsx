"use client"

import { useEffect } from "react"
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import Link from "next/link"
import Image from "next/image"

export function Cart() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotal, clearCart } = useCartStore()

  // Close cart on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart()
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [closeCart])

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  const total = getTotal()

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeCart}
      />

      {/* Cart panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl animate-slide-in flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-[#ff6b35]" />
            <h2 className="text-xl font-bold">Il tuo carrello</h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Chiudi carrello"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">Il carrello e vuoto</p>
              <p className="text-sm">Aggiungi qualche prodotto!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => {
                const price = item.selectedWeight?.price ?? item.product.price ?? 0
                const key = `${item.product.id}-${item.selectedWeight?.label || "default"}`
                
                return (
                  <div key={key} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    {/* Product image */}
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                      {item.product.image_url ? (
                        <Image
                          src={item.product.image_url}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-3xl">{item.product.emoji}</span>
                      )}
                    </div>

                    {/* Product info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 truncate">
                        {item.product.name}
                      </h3>
                      {item.selectedWeight && (
                        <p className="text-sm text-gray-500">{item.selectedWeight.label}</p>
                      )}
                      <p className="text-[#ff6b35] font-bold">€{price.toFixed(2)}</p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedWeight?.label)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          aria-label="Diminuisci"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedWeight?.label)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          aria-label="Aumenta"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeItem(item.product.id, item.selectedWeight?.label)}
                          className="p-1 hover:bg-red-100 text-red-500 rounded transition-colors ml-auto"
                          aria-label="Rimuovi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Totale:</span>
              <span className="text-2xl font-bold text-[#ff6b35]">€{total.toFixed(2)}</span>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full py-3 bg-[#ff6b35] text-white text-center font-bold rounded-lg hover:bg-[#e55a2b] transition-colors"
              >
                Procedi al checkout
              </Link>
              <button
                onClick={clearCart}
                className="w-full py-2 text-gray-500 hover:text-red-500 transition-colors text-sm"
              >
                Svuota carrello
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
