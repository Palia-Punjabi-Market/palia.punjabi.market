"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Package, ShoppingCart, LogOut, Home, Menu, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    const res = await fetch("/api/admin/check")
    const data = await res.json()
    
    if (!data.isAdmin) {
      router.push("/auth/login")
    } else {
      setIsAdmin(true)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ff6b35] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifica accesso...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform lg:transform-none ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛒</span>
              <div>
                <h1 className="font-bold">Admin Panel</h1>
                <p className="text-xs text-gray-400">Palia Punjabi Market</p>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 hover:bg-gray-800 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <Package className="w-5 h-5" />
            <span>Prodotti</span>
          </Link>
          <Link
            href="/admin/ordini"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Ordini</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
          >
            <Home className="w-5 h-5" />
            <span>Vai allo shop</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors w-full text-red-400"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden bg-white shadow-sm p-4 flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-lg">Admin Panel</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
