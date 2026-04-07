"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Minus, ShoppingCart } from "lucide-react"
import type { Product, WeightPrice } from "@/lib/types"
import { useCartStore } from "@/lib/cart-store"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedWeight, setSelectedWeight] = useState<WeightPrice | undefined>(
    product.weight_prices?.[0]
  )
  const [quantity, setQuantity] = useState(1)
  const { addItem, openCart } = useCartStore()

  const hasWeights = product.weight_prices && product.weight_prices.length > 0
  const currentPrice = hasWeights ? selectedWeight?.price : product.price
  const isAvailable = product.available

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedWeight)
    }
    setQuantity(1)
    openCart()
  }

  const categoryLabels: Record<string, string> = {
    fresco: "Fresco",
    confezionato: "Confezionato",
    surgelato: "Surgelato",
  }

  const originLabels: Record<string, string> = {
    indiano: "Indiano",
    africano: "Africano",
    italiano: "Italiano",
    internazionale: "Internazionale",
  }

  return (
    <div className={`product-card bg-white rounded-xl shadow-md overflow-hidden ${!isAvailable ? "opacity-60" : ""}`}>
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <span className="text-6xl">{product.emoji}</span>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className={`badge-${product.category} text-white text-xs px-2 py-1 rounded-full font-medium`}>
            {categoryLabels[product.category]}
          </span>
          <span className={`badge-${product.origin} text-white text-xs px-2 py-1 rounded-full font-medium`}>
            {originLabels[product.origin]}
          </span>
        </div>

        {product.is_top && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold">
            OFFERTA
          </div>
        )}

        {!isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
              Non Disponibile
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-1">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
        )}

        {/* Weight selector */}
        {hasWeights && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Seleziona peso:</p>
            <div className="flex flex-wrap gap-1">
              {product.weight_prices?.map((wp) => (
                <button
                  key={wp.label}
                  onClick={() => setSelectedWeight(wp)}
                  className={`text-xs px-2 py-1 rounded-full transition-colors ${
                    selectedWeight?.label === wp.label
                      ? "bg-[#ff6b35] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {wp.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price and add to cart */}
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-[#ff6b35]">
            {currentPrice ? `€${currentPrice.toFixed(2)}` : "N/A"}
          </div>

          {isAvailable && (
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-100 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors"
                  aria-label="Diminuisci quantita"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors"
                  aria-label="Aumenta quantita"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="p-2 bg-[#ff6b35] text-white rounded-lg hover:bg-[#e55a2b] transition-colors"
                aria-label="Aggiungi al carrello"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
