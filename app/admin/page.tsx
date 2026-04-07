"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, X, Upload, ImageIcon } from "lucide-react"
import Image from "next/image"
import type { Product, WeightPrice } from "@/lib/types"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    emoji: "📦",
    image_url: "",
    price: "",
    category: "confezionato" as "fresco" | "confezionato" | "surgelato",
    origin: "indiano" as "indiano" | "africano" | "italiano" | "internazionale",
    description: "",
    is_top: false,
    available: true,
    weight_prices: [] as WeightPrice[],
  })

  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const res = await fetch("/api/products")
    const data = await res.json()
    setProducts(data)
    setIsLoading(false)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      emoji: "📦",
      image_url: "",
      price: "",
      category: "confezionato",
      origin: "indiano",
      description: "",
      is_top: false,
      available: true,
      weight_prices: [],
    })
    setEditingProduct(null)
  }

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        emoji: product.emoji,
        image_url: product.image_url || "",
        price: product.price?.toString() || "",
        category: product.category,
        origin: product.origin,
        description: product.description || "",
        is_top: product.is_top,
        available: product.available,
        weight_prices: product.weight_prices || [],
      })
    } else {
      resetForm()
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    resetForm()
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    const uploadFormData = new FormData()
    uploadFormData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      const data = await res.json()
      if (res.ok) {
        setFormData({ ...formData, image_url: data.url })
      } else {
        alert("Errore durante il caricamento: " + data.error)
      }
    } catch {
      alert("Errore di connessione durante il caricamento")
    } finally {
      setIsUploading(false)
    }
  }

  const addWeightPrice = () => {
    setFormData({
      ...formData,
      weight_prices: [...formData.weight_prices, { label: "", price: 0 }],
    })
  }

  const updateWeightPrice = (index: number, field: "label" | "price", value: string | number) => {
    const updated = [...formData.weight_prices]
    if (field === "price") {
      updated[index].price = typeof value === "string" ? parseFloat(value) || 0 : value
    } else {
      updated[index].label = value as string
    }
    setFormData({ ...formData, weight_prices: updated })
  }

  const removeWeightPrice = (index: number) => {
    setFormData({
      ...formData,
      weight_prices: formData.weight_prices.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload = {
      name: formData.name,
      emoji: formData.emoji,
      image_url: formData.image_url || null,
      price: formData.weight_prices.length > 0 ? null : parseFloat(formData.price) || null,
      category: formData.category,
      origin: formData.origin,
      description: formData.description || null,
      is_top: formData.is_top,
      available: formData.available,
      weight_prices: formData.weight_prices.length > 0 ? formData.weight_prices : null,
    }

    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : "/api/products"
      const method = editingProduct ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        fetchProducts()
        closeModal()
      } else {
        const data = await res.json()
        alert("Errore: " + data.error)
      }
    } catch {
      alert("Errore di connessione")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (product: Product) => {
    if (!confirm(`Sei sicuro di voler eliminare "${product.name}"?`)) return

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        fetchProducts()
      } else {
        const data = await res.json()
        alert("Errore: " + data.error)
      }
    } catch {
      alert("Errore di connessione")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-[#ff6b35] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestione Prodotti</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[#ff6b35] text-white rounded-lg hover:bg-[#e55a2b] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuovo Prodotto
        </button>
      </div>

      {/* Products table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Prodotto</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Categoria</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Origine</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Prezzo</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Stato</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-2xl">{product.emoji}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{product.name}</p>
                        {product.is_top && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">OFFERTA</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge-${product.category} text-white text-xs px-2 py-1 rounded-full`}>
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge-${product.origin} text-white text-xs px-2 py-1 rounded-full`}>
                      {product.origin}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {product.weight_prices && product.weight_prices.length > 0 ? (
                      <span className="text-sm text-gray-600">Variabile</span>
                    ) : (
                      <span className="font-medium">
                        {product.price ? `€${product.price.toFixed(2)}` : "N/A"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        product.available
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.available ? "Disponibile" : "Non disponibile"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal(product)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Modifica"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Elimina"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingProduct ? "Modifica Prodotto" : "Nuovo Prodotto"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Immagine prodotto
                </label>
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                    {formData.image_url ? (
                      <Image
                        src={formData.image_url}
                        alt="Preview"
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-4xl">{formData.emoji}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#ff6b35] cursor-pointer transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      {isUploading ? (
                        <span className="text-gray-500">Caricamento...</span>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-600">Carica immagine</span>
                        </>
                      )}
                    </label>
                    {formData.image_url && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image_url: "" })}
                        className="mt-2 text-sm text-red-500 hover:underline"
                      >
                        Rimuovi immagine
                      </button>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Oppure usa un emoji come icona
                    </p>
                  </div>
                </div>
              </div>

              {/* Name and Emoji */}
              <div className="grid sm:grid-cols-4 gap-4">
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emoji</label>
                  <input
                    type="text"
                    value={formData.emoji}
                    onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] text-center text-2xl"
                  />
                </div>
              </div>

              {/* Category and Origin */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Product["category"] })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                  >
                    <option value="fresco">Fresco</option>
                    <option value="confezionato">Confezionato</option>
                    <option value="surgelato">Surgelato</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Origine *</label>
                  <select
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value as Product["origin"] })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                  >
                    <option value="indiano">Indiano</option>
                    <option value="africano">Africano</option>
                    <option value="italiano">Italiano</option>
                    <option value="internazionale">Internazionale</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>

              {/* Price or Weight prices */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    {formData.weight_prices.length > 0 ? "Prezzi per peso" : "Prezzo fisso"}
                  </label>
                  {formData.weight_prices.length === 0 ? (
                    <button
                      type="button"
                      onClick={addWeightPrice}
                      className="text-sm text-[#ff6b35] hover:underline"
                    >
                      Usa prezzi variabili
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, weight_prices: [] })}
                      className="text-sm text-gray-500 hover:underline"
                    >
                      Usa prezzo fisso
                    </button>
                  )}
                </div>

                {formData.weight_prices.length === 0 ? (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {formData.weight_prices.map((wp, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={wp.label}
                          onChange={(e) => updateWeightPrice(index, "label", e.target.value)}
                          placeholder="es. 500g"
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                        />
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                          <input
                            type="number"
                            step="0.01"
                            value={wp.price}
                            onChange={(e) => updateWeightPrice(index, "price", e.target.value)}
                            placeholder="0.00"
                            className="w-24 pl-8 pr-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeWeightPrice(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addWeightPrice}
                      className="text-sm text-[#ff6b35] hover:underline"
                    >
                      + Aggiungi peso
                    </button>
                  </div>
                )}
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="w-4 h-4 text-[#ff6b35] rounded focus:ring-[#ff6b35]"
                  />
                  <span className="text-sm text-gray-700">Disponibile</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_top}
                    onChange={(e) => setFormData({ ...formData, is_top: e.target.checked })}
                    className="w-4 h-4 text-[#ff6b35] rounded focus:ring-[#ff6b35]"
                  />
                  <span className="text-sm text-gray-700">Prodotto in offerta</span>
                </label>
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[#ff6b35] text-white font-medium rounded-lg hover:bg-[#e55a2b] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Salvataggio..." : editingProduct ? "Salva modifiche" : "Crea prodotto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
