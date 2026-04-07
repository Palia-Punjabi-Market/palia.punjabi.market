"use client"

import { Search, Filter } from "lucide-react"

interface ProductFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  selectedOrigin: string
  onOriginChange: (origin: string) => void
  showTopOnly: boolean
  onShowTopChange: (show: boolean) => void
}

export function ProductFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedOrigin,
  onOriginChange,
  showTopOnly,
  onShowTopChange,
}: ProductFiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca prodotti..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 text-gray-500">
            <Filter className="w-5 h-5" />
            <span className="text-sm font-medium">Filtra:</span>
          </div>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] text-sm"
          >
            <option value="">Tutte le categorie</option>
            <option value="fresco">Fresco</option>
            <option value="confezionato">Confezionato</option>
            <option value="surgelato">Surgelato</option>
          </select>

          {/* Origin */}
          <select
            value={selectedOrigin}
            onChange={(e) => onOriginChange(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] text-sm"
          >
            <option value="">Tutte le origini</option>
            <option value="indiano">Indiano</option>
            <option value="africano">Africano</option>
            <option value="italiano">Italiano</option>
            <option value="internazionale">Internazionale</option>
          </select>

          {/* Offer products */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showTopOnly}
              onChange={(e) => onShowTopChange(e.target.checked)}
              className="w-4 h-4 text-[#ff6b35] rounded focus:ring-[#ff6b35]"
            />
            <span className="text-sm">Solo offerte</span>
          </label>
        </div>
      </div>
    </div>
  )
}
