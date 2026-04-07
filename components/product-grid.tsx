"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { ProductCard } from "./product-card"
import { ProductFilters } from "./product-filters"
import type { Product } from "@/lib/types"

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedOrigin, setSelectedOrigin] = useState("")
  const [showTopOnly, setShowTopOnly] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const q = searchParams.get("q") || ""
    const category = searchParams.get("category") || ""
    const origin = searchParams.get("origin") || ""

    setSearchQuery(q)
    setSelectedCategory(category === "tutti" ? "" : category)
    setSelectedOrigin(origin)
  }, [searchParams])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Category filter
      if (selectedCategory && product.category !== selectedCategory) {
        return false
      }

      // Origin filter
      if (selectedOrigin && product.origin !== selectedOrigin) {
        return false
      }

      // Top products filter
      if (showTopOnly && !product.is_top) {
        return false
      }

      return true
    })
  }, [products, searchQuery, selectedCategory, selectedOrigin, showTopOnly])

  return (
    <div>
      <ProductFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedOrigin={selectedOrigin}
        onOriginChange={setSelectedOrigin}
        showTopOnly={showTopOnly}
        onShowTopChange={setShowTopOnly}
      />

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nessun prodotto trovato</p>
          <p className="text-gray-400 text-sm mt-1">Prova a modificare i filtri di ricerca</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
