"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Search, Package, Truck, CheckCircle, XCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Cart } from "@/components/cart"
import type { Order } from "@/lib/types"

function OrderTrackingContent() {
  const searchParams = useSearchParams()
  const initialId = searchParams.get("id") || ""
  
  const [orderId, setOrderId] = useState(initialId)
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (initialId) {
      handleSearch(initialId)
    }
  }, [initialId])

  const handleSearch = async (id?: string) => {
    const searchId = id || orderId
    if (!searchId.trim()) return

    setIsLoading(true)
    setError("")
    setOrder(null)

    try {
      const res = await fetch(`/api/orders/${searchId.trim()}`)
      if (res.ok) {
        const data = await res.json()
        setOrder(data)
      } else {
        setError("Ordine non trovato. Controlla il codice e riprova.")
      }
    } catch {
      setError("Errore di connessione. Riprova.")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusStep = (status: string) => {
    switch (status) {
      case "preparazione": return 1
      case "spedito": return 2
      case "consegnato": return 3
      case "annullato": return -1
      default: return 0
    }
  }

  const statusStep = order ? getStatusStep(order.status) : 0

  return (
    <main className="flex-1 max-w-3xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#ff6b35] mb-6">
        <ArrowLeft className="w-5 h-5" />
        Torna allo shop
      </Link>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Traccia il tuo ordine</h1>

      {/* Search form */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSearch()
          }}
          className="flex gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Inserisci il codice ordine (es. ORD-XXXXXXXX)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-[#ff6b35] text-white font-bold rounded-lg hover:bg-[#e55a2b] transition-colors disabled:opacity-50"
          >
            {isLoading ? "..." : "Cerca"}
          </button>
        </form>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Order details */}
      {order && (
        <div className="bg-white rounded-xl shadow-md p-6">
          {/* Order header */}
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-6 border-b">
            <div>
              <p className="text-sm text-gray-500">Codice ordine</p>
              <p className="text-xl font-bold text-[#ff6b35]">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Data ordine</p>
              <p className="font-medium">{new Date(order.created_at).toLocaleDateString("it-IT")}</p>
            </div>
          </div>

          {/* Status tracker */}
          {order.status !== "annullato" ? (
            <div className="mb-8">
              <div className="flex justify-between items-center relative">
                {/* Progress line */}
                <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                  <div
                    className="h-full bg-[#ff6b35] transition-all duration-500"
                    style={{ width: `${(statusStep - 1) * 50}%` }}
                  />
                </div>

                {/* Steps */}
                {[
                  { step: 1, label: "In preparazione", icon: Package },
                  { step: 2, label: "Spedito", icon: Truck },
                  { step: 3, label: "Consegnato", icon: CheckCircle },
                ].map(({ step, label, icon: Icon }) => (
                  <div key={step} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        statusStep >= step
                          ? "bg-[#ff6b35] text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className={`mt-2 text-xs text-center ${statusStep >= step ? "text-gray-800 font-medium" : "text-gray-400"}`}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-8 flex items-center justify-center gap-3 py-4 bg-red-50 rounded-lg">
              <XCircle className="w-6 h-6 text-red-500" />
              <span className="font-medium text-red-600">Ordine annullato</span>
            </div>
          )}

          {/* Order info */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Cliente</h3>
              <p className="text-gray-600">{order.customer_name} {order.customer_surname}</p>
              <p className="text-gray-600">{order.customer_phone}</p>
              {order.customer_email && <p className="text-gray-600">{order.customer_email}</p>}
            </div>
            <div>
              <h3 className="font-semibold mb-2">Consegna</h3>
              {order.delivery_type === "domicilio" ? (
                <>
                  <p className="text-gray-600">{order.address}</p>
                  <p className="text-gray-600">{order.cap} {order.city}</p>
                </>
              ) : (
                <p className="text-gray-600">Ritiro in negozio</p>
              )}
            </div>
          </div>

          {/* Order items */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-3">Prodotti ordinati</h3>
            <div className="space-y-2">
              {(order.items as { productName: string; quantity: number; price: number; weight?: string }[]).map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.productName} {item.weight && `(${item.weight})`} x{item.quantity}
                  </span>
                  <span>€{((item.price || 0) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between font-bold">
              <span>Totale</span>
              <span className="text-[#ff6b35]">€{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default function OrderTrackingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <Cart />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center">Caricamento...</div>}>
        <OrderTrackingContent />
      </Suspense>
    </div>
  )
}
