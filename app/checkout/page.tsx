"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Truck, Store, CheckCircle } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { Header } from "@/components/header"
import { Cart } from "@/components/cart"
import { createClient } from "@/lib/supabase/client"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    deliveryType: "ritiro" as "ritiro" | "domicilio",
    address: "",
    city: "",
    cap: "",
  })

  const deliveryPrice = formData.deliveryType === "domicilio" ? 5 : 0
  const subtotal = getTotal()
  const total = subtotal + deliveryPrice

  useEffect(() => {
    const preloadProfile = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const res = await fetch("/api/profile")
      if (!res.ok) return

      const data = await res.json()
      if (!data.profile) return

      setFormData((prev) => ({
        ...prev,
        name: data.profile.name || prev.name,
        surname: data.profile.surname || prev.surname,
        email: user.email || prev.email,
        phone: data.profile.phone || prev.phone,
        address: data.profile.address || prev.address,
        city: data.profile.city || prev.city,
        cap: data.profile.cap || prev.cap,
      }))
    }

    preloadProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_surname: formData.surname,
          customer_email: formData.email,
          customer_phone: formData.phone,
          delivery_type: formData.deliveryType,
          delivery_price: deliveryPrice,
          address: formData.address,
          city: formData.city,
          cap: formData.cap,
          items: items.map(item => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.selectedWeight?.price ?? item.product.price,
            weight: item.selectedWeight?.label,
          })),
          total,
        }),
      })

      const data = await res.json()
      
      if (res.ok) {
        setOrderSuccess(data.id)
        clearCart()
      } else {
        alert("Errore durante l'invio dell'ordine: " + data.error)
      }
    } catch {
      alert("Errore di connessione. Riprova.")
    } finally {
      setIsLoading(false)
    }
  }

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderSuccess) {
      router.push("/")
    }
  }, [items.length, orderSuccess, router])

  if (orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <Cart />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Ordine Confermato!</h1>
            <p className="text-gray-600 mb-4">
              Il tuo ordine e stato ricevuto con successo.
            </p>
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500">Codice ordine:</p>
              <p className="text-xl font-bold text-[#ff6b35]">{orderSuccess}</p>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Salva questo codice per tracciare il tuo ordine.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href={`/traccia-ordine?id=${orderSuccess}`}
                className="w-full py-3 bg-[#ff6b35] text-white font-bold rounded-lg hover:bg-[#e55a2b] transition-colors"
              >
                Traccia Ordine
              </Link>
              <Link
                href="/"
                className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Torna allo Shop
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <Cart />
      
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#ff6b35] mb-6">
          <ArrowLeft className="w-5 h-5" />
          Continua lo shopping
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Personal info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Dati personali</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cognome *</label>
                  <input
                    type="text"
                    required
                    value={formData.surname}
                    onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefono *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                  />
                </div>
              </div>
            </div>

            {/* Delivery type */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Tipo di consegna</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, deliveryType: "ritiro" })}
                  className={`p-4 rounded-lg border-2 transition-colors text-left ${
                    formData.deliveryType === "ritiro"
                      ? "border-[#ff6b35] bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Store className={`w-6 h-6 mb-2 ${formData.deliveryType === "ritiro" ? "text-[#ff6b35]" : "text-gray-400"}`} />
                  <p className="font-medium">Ritiro in negozio</p>
                  <p className="text-sm text-gray-500">Gratuito</p>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, deliveryType: "domicilio" })}
                  className={`p-4 rounded-lg border-2 transition-colors text-left ${
                    formData.deliveryType === "domicilio"
                      ? "border-[#ff6b35] bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Truck className={`w-6 h-6 mb-2 ${formData.deliveryType === "domicilio" ? "text-[#ff6b35]" : "text-gray-400"}`} />
                  <p className="font-medium">Consegna a domicilio</p>
                  <p className="text-sm text-gray-500">+5.00 euro</p>
                </button>
              </div>

              {/* Address fields */}
              {formData.deliveryType === "domicilio" && (
                <div className="mt-4 pt-4 border-t space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Indirizzo *</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Citta *</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CAP *</label>
                      <input
                        type="text"
                        required
                        value={formData.cap}
                        onChange={(e) => setFormData({ ...formData, cap: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit button (mobile) */}
            <button
              type="submit"
              disabled={isLoading}
              className="lg:hidden w-full py-4 bg-[#ff6b35] text-white font-bold rounded-lg hover:bg-[#e55a2b] transition-colors disabled:opacity-50"
            >
              {isLoading ? "Invio in corso..." : `Conferma ordine - €${total.toFixed(2)}`}
            </button>
          </form>

          {/* Order summary */}
          <div className="lg:sticky lg:top-4 h-fit">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Riepilogo ordine</h2>
              
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {items.map((item) => {
                  const price = item.selectedWeight?.price ?? item.product.price ?? 0
                  const key = `${item.product.id}-${item.selectedWeight?.label || "default"}`
                  
                  return (
                    <div key={key} className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                        {item.product.image_url ? (
                          <Image
                            src={item.product.image_url}
                            alt={item.product.name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-xl">{item.product.emoji}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.selectedWeight?.label && `${item.selectedWeight.label} - `}
                          x{item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-sm">€{(price * item.quantity).toFixed(2)}</p>
                    </div>
                  )
                })}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotale</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Consegna</span>
                  <span>{deliveryPrice > 0 ? `€${deliveryPrice.toFixed(2)}` : "Gratuita"}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Totale</span>
                  <span className="text-[#ff6b35]">€{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit button (desktop) */}
              <button
                type="submit"
                form="checkout-form"
                disabled={isLoading}
                className="hidden lg:block w-full mt-6 py-4 bg-[#ff6b35] text-white font-bold rounded-lg hover:bg-[#e55a2b] transition-colors disabled:opacity-50"
              >
                {isLoading ? "Invio in corso..." : "Conferma ordine"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
