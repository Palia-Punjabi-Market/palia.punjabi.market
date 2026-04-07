"use client"

import { useState, useEffect } from "react"
import { Eye, Package, Truck, CheckCircle, XCircle, X } from "lucide-react"
import type { Order } from "@/lib/types"

type OrderItemRow = {
  productName: string
  quantity: number
  price: number
  weight?: string
}

type SnapshotOrderItem = {
  productName: string
  quantity: number
  price: number
  weight?: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filterStatus, setFilterStatus] = useState("")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const res = await fetch("/api/orders")
    const data = await res.json()
    setOrders(data)
    setIsLoading(false)
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        fetchOrders()
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus as Order["status"] })
        }
      } else {
        const data = await res.json()
        alert("Errore aggiornamento stato: " + (data.error || "richiesta non valida"))
      }
    } catch {
      alert("Errore durante l'aggiornamento")
    }
  }

  const filteredOrders = filterStatus
    ? orders.filter((o) => o.status === filterStatus)
    : orders

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "preparazione":
        return <Package className="w-4 h-4" />
      case "spedito":
        return <Truck className="w-4 h-4" />
      case "consegnato":
        return <CheckCircle className="w-4 h-4" />
      case "annullato":
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "preparazione":
        return "bg-yellow-100 text-yellow-700"
      case "spedito":
        return "bg-blue-100 text-blue-700"
      case "consegnato":
        return "bg-green-100 text-green-700"
      case "annullato":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const isSnapshotOrderItem = (item: unknown): item is SnapshotOrderItem => {
    if (!item || typeof item !== "object") return false
    const row = item as Record<string, unknown>
    return typeof row.productName === "string" && typeof row.quantity === "number"
  }

  const normalizeOrderItems = (items: Order["items"]): OrderItemRow[] => {
    return items.map((item) => {
      if (isSnapshotOrderItem(item)) {
        return {
          productName: item.productName,
          quantity: item.quantity,
          price: item.price ?? 0,
          weight: item.weight,
        }
      }

      return {
        productName: item.product.name,
        quantity: item.quantity,
        price: item.selectedWeight?.price ?? item.product.price ?? 0,
        weight: item.selectedWeight?.label,
      }
    })
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
        <h1 className="text-2xl font-bold text-gray-800">Gestione Ordini</h1>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
        >
          <option value="">Tutti gli stati</option>
          <option value="preparazione">In preparazione</option>
          <option value="spedito">Spedito</option>
          <option value="consegnato">Consegnato</option>
          <option value="annullato">Annullato</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { status: "preparazione", label: "In preparazione", color: "bg-yellow-500" },
          { status: "spedito", label: "Spediti", color: "bg-blue-500" },
          { status: "consegnato", label: "Consegnati", color: "bg-green-500" },
          { status: "annullato", label: "Annullati", color: "bg-red-500" },
        ].map(({ status, label, color }) => (
          <div key={status} className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${color}`} />
              <span className="text-sm text-gray-600">{label}</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {orders.filter((o) => o.status === status).length}
            </p>
          </div>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Ordine</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Cliente</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Consegna</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Totale</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Stato</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Nessun ordine trovato
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#ff6b35]">{order.id}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString("it-IT")}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{order.customer_name} {order.customer_surname}</p>
                      <p className="text-sm text-gray-500">{order.customer_phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.delivery_type === "domicilio"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {order.delivery_type === "domicilio" ? "Domicilio" : "Ritiro"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold">€{order.total.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full w-fit ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="text-xs px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                        >
                          <option value="preparazione">preparazione</option>
                          <option value="spedito">spedito</option>
                          <option value="consegnato">consegnato</option>
                          <option value="annullato">annullato</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Dettagli"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#ff6b35]">{selectedOrder.id}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(selectedOrder.created_at).toLocaleString("it-IT")}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status update */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aggiorna stato
                </label>
                <div className="flex flex-wrap gap-2">
                  {["preparazione", "spedito", "consegnato", "annullato"].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder.id, status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedOrder.status === status
                          ? "bg-[#ff6b35] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Cliente</h3>
                  <p className="text-gray-600">{selectedOrder.customer_name} {selectedOrder.customer_surname}</p>
                  <p className="text-gray-600">{selectedOrder.customer_phone}</p>
                  {selectedOrder.customer_email && (
                    <p className="text-gray-600">{selectedOrder.customer_email}</p>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Consegna</h3>
                  {selectedOrder.delivery_type === "domicilio" ? (
                    <>
                      <p className="text-gray-600">{selectedOrder.address}</p>
                      <p className="text-gray-600">{selectedOrder.cap} {selectedOrder.city}</p>
                    </>
                  ) : (
                    <p className="text-gray-600">Ritiro in negozio</p>
                  )}
                </div>
              </div>

              {/* Order items */}
              <div>
                <h3 className="font-semibold mb-3">Prodotti ordinati</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {normalizeOrderItems(selectedOrder.items).map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.productName} {item.weight && `(${item.weight})`} x{item.quantity}
                      </span>
                      <span className="font-medium">€{((item.price || 0) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  {selectedOrder.delivery_price > 0 && (
                    <div className="flex justify-between text-sm pt-2 border-t">
                      <span className="text-gray-600">Consegna</span>
                      <span className="font-medium">€{selectedOrder.delivery_price.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Totale</span>
                    <span className="text-[#ff6b35]">€{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
