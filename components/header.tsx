"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ShoppingCart, Menu, X, User, LogOut, Search } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const { openCart, getItemCount } = useCartStore()
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const itemCount = getItemCount()

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) checkAdmin()
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      if (session?.user) checkAdmin()
      else setIsAdmin(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    setSearchInput(searchParams.get("q") || "")
  }, [searchParams])

  const checkAdmin = async () => {
    const res = await fetch("/api/admin/check")
    const data = await res.json()
    setIsAdmin(data.isAdmin)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
    setIsMenuOpen(false)
  }

  const applySearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (searchInput.trim()) params.set("q", searchInput.trim())
    else params.delete("q")
    router.push(`/?${params.toString()}`)
    setIsMenuOpen(false)
  }

  const isHome = pathname === "/"

  return (
    <header className="sticky top-0 z-50 bg-[#fafaf8] border-b-2 border-[#e5e3dc] shadow-[0_2px_16px_rgba(0,0,0,0.07)]">
      <div className="h-[5px] bg-[linear-gradient(90deg,#FF6B00_33.3%,#fff_33.3%,#fff_66.6%,#138808_66.6%)]" />
      <div className="bg-[#138808] text-white text-center text-xs md:text-sm font-medium py-1.5 px-3">
        🚚 Consegna disponibile · Via Don Pasquino Borgo 8, Poviglio (RE) · 📞 353 397 4563
      </div>

      <div className="px-4 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3">
          <button onClick={() => setIsMenuOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-[#fff3e8]" aria-label="Apri menu">
            <Menu className="w-6 h-6 text-[#1a1a1a]" />
          </button>

          <Link href="/" className="flex items-center gap-3 min-w-fit">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#ff6b00] via-[#ff8c2a] to-[#138808] flex items-center justify-center text-xl shadow-[0_2px_10px_rgba(255,107,0,0.35)]">🛒</div>
            <div className="hidden sm:block">
              <h1 className="font-black text-base lg:text-lg leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b00] to-[#138808]">Palia Punjabi Market</h1>
              <p className="text-[11px] text-[#1a1a1a] uppercase tracking-wide">Alimentari Internazionale</p>
            </div>
          </Link>

          <div className="hidden md:flex flex-1 max-w-[440px] items-center bg-[#f0efec] rounded-full px-4 border-2 border-transparent focus-within:border-[#ff6b00]">
            <Search className="w-4 h-4 text-[#1a1a1a]" />
            <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && applySearch()} placeholder="Cerca prodotti..." className="w-full bg-transparent outline-none text-sm px-2 py-2.5" />
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/?category=tutti" className="px-3 py-2 rounded-lg text-sm hover:bg-[#fff3e8] hover:text-[#ff6b00]">Categorie</Link>
            <Link href="/traccia-ordine" className="px-3 py-2 rounded-lg text-sm hover:bg-[#fff3e8] hover:text-[#ff6b00]">📦 Tracciamento</Link>
            <a href={isHome ? "#about" : "/#about"} className="px-3 py-2 rounded-lg text-sm hover:bg-[#fff3e8] hover:text-[#ff6b00]">Chi siamo</a>
            <a href={isHome ? "#footer" : "/#footer"} className="px-3 py-2 rounded-lg text-sm hover:bg-[#fff3e8] hover:text-[#ff6b00]">Contatti</a>
          </nav>

          <div className="flex items-center gap-3">
            {isAdmin && <Link href="/admin" className="hidden md:inline-flex px-3 py-2 rounded-lg text-sm font-bold bg-[#1e1e2e] text-[#cba6f7] hover:bg-[#313244] hover:text-white">⚙️ Admin</Link>}
            <button onClick={openCart} className="relative bg-[#ff6b00] hover:bg-[#ff8c2a] text-white w-11 h-11 rounded-xl flex items-center justify-center transition-colors" aria-label="Apri carrello">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && <span className="absolute -top-1 -right-1 bg-[#138808] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">{itemCount}</span>}
            </button>
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-[#138808] font-semibold">{user.email?.split("@")[0]}</span>
                <button onClick={handleLogout} className="p-2 hover:bg-[#fff3e8] rounded-lg transition-colors" aria-label="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-[#fff3e8] text-[#ff6b00] hover:bg-[#ff6b00] hover:text-white transition-colors">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Accedi</span>
              </Link>
            )}
          </div>
        </div>

        <div className="md:hidden mt-3 flex items-center bg-[#f0efec] rounded-full px-4 border border-[#e5e3dc]">
          <Search className="w-4 h-4 text-[#1a1a1a]" />
          <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && applySearch()} placeholder="Cerca prodotti..." className="w-full bg-transparent outline-none text-sm px-2 py-2.5" />
        </div>
      </div>

      <div className="hidden md:flex items-center gap-1 overflow-x-auto px-4 lg:px-8 border-t border-[#e5e3dc]">
        <Link href="/?category=tutti" className="cat-pill">🌍 Tutti</Link>
        <Link href="/?category=fresco" className="cat-pill">🥦 Fresco</Link>
        <Link href="/?category=confezionato" className="cat-pill">📦 Confezionato</Link>
        <Link href="/?category=surgelato" className="cat-pill">❄️ Surgelato</Link>
        <Link href="/?origin=indiano" className="cat-pill">🇮🇳 Indiano</Link>
        <Link href="/?origin=africano" className="cat-pill">🌍 Africano</Link>
        <Link href="/?origin=italiano" className="cat-pill">🇮🇹 Italiano</Link>
        <Link href="/?origin=internazionale" className="cat-pill">✈️ Internazionale</Link>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[70] bg-black/50 md:hidden" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-[290px] bg-[#fafaf8] shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-[#ff6b00] to-[#138808] px-5 py-5 flex items-center gap-3 text-white">
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-xl">🛒</div>
              <div className="flex-1">
                <p className="font-black">Palia Punjabi Market</p>
                <p className="text-xs opacity-90">Alimentari Internazionale</p>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="p-1.5 bg-white/20 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-1 overflow-y-auto h-[calc(100%-88px)]">
              <p className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a]/70 px-2 pt-1">Categorie</p>
              <Link onClick={() => setIsMenuOpen(false)} href="/?category=tutti" className="drawer-link">🌍 Tutti i prodotti</Link>
              <Link onClick={() => setIsMenuOpen(false)} href="/?category=fresco" className="drawer-link">🥦 Fresco</Link>
              <Link onClick={() => setIsMenuOpen(false)} href="/?category=confezionato" className="drawer-link">📦 Confezionato</Link>
              <Link onClick={() => setIsMenuOpen(false)} href="/?category=surgelato" className="drawer-link">❄️ Surgelato</Link>
              <p className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a]/70 px-2 pt-3">Pagine</p>
              <Link onClick={() => setIsMenuOpen(false)} href="/traccia-ordine" className="drawer-link">📦 Tracciamento ordine</Link>
              {isAdmin && <Link onClick={() => setIsMenuOpen(false)} href="/admin" className="drawer-link">⚙️ Admin panel</Link>}
              {!user && <Link onClick={() => setIsMenuOpen(false)} href="/auth/login" className="drawer-link">👤 Accedi</Link>}
              {user && <button onClick={handleLogout} className="drawer-link w-full text-left">🚪 Logout</button>}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
