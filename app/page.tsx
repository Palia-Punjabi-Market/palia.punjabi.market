import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Cart } from "@/components/cart"
import { ProductGrid } from "@/components/product-grid"
import type { Product } from "@/lib/types"

export const revalidate = 60

export default async function HomePage() {
  const supabase = await createClient()
  
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("available", true)
    .order("is_top", { ascending: false })
    .order("name", { ascending: true })

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf8]">
      <Header />
      <Cart />
      
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 lg:px-8 py-10 grid lg:grid-cols-2 gap-10 items-center bg-[linear-gradient(135deg,#FFF7F0,#F0F9EE_50%,#FFF3E8)] rounded-2xl mt-4">
          <div>
            <h1 className="text-4xl lg:text-6xl font-black leading-tight">
              Il sapore del <span className="text-[#ff6b00]">mondo</span>,<br />a casa tua
            </h1>
            <p className="mt-4 text-[#1a1a1a]/80 text-lg max-w-xl">
              Prodotti freschi, confezionati e surgelati da India, Africa, Italia e molto altro.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              <span className="px-3 py-2 rounded-full bg-[#ebf7e8] border border-[#138808] text-[#138808] font-semibold">🌿 Freschezza garantita</span>
              <span className="px-3 py-2 rounded-full bg-[#fff3e8] border border-[#ff6b00] text-[#ff6b00] font-semibold">🌍 +20 paesi di origine</span>
              <span className="px-3 py-2 rounded-full bg-white border border-[#e5e3dc] font-semibold">🚚 Consegna rapida</span>
            </div>
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-3">
            <div className="col-span-2 rounded-2xl bg-gradient-to-br from-[#fff0e0] to-[#ffd9b0] h-44 flex items-center justify-center text-7xl shadow-md">🥭</div>
            <div className="rounded-2xl bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] h-36 flex items-center justify-center text-6xl shadow-md">🌿</div>
            <div className="rounded-2xl bg-gradient-to-br from-[#e3f2fd] to-[#bbdefb] h-36 flex items-center justify-center text-6xl shadow-md">🍚</div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          <h2 className="text-3xl font-bold mb-6">Categorie <span className="text-[#ff6b00]">principali</span></h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <a href="/?category=fresco" className="rounded-2xl border-2 border-[#e5e3dc] bg-gradient-to-br from-white to-[#EBF7E8] p-6 hover:border-[#ff6b00] transition-colors">
              <p className="text-4xl">🥦</p><p className="font-bold mt-2">Fresco</p><p className="text-sm text-[#1a1a1a]/70">Frutta, verdura e prodotti freschi.</p>
            </a>
            <a href="/?category=confezionato" className="rounded-2xl border-2 border-[#e5e3dc] bg-gradient-to-br from-white to-[#FFF3E8] p-6 hover:border-[#ff6b00] transition-colors">
              <p className="text-4xl">📦</p><p className="font-bold mt-2">Confezionato</p><p className="text-sm text-[#1a1a1a]/70">Riso, farine, spezie e conserve.</p>
            </a>
            <a href="/?category=surgelato" className="rounded-2xl border-2 border-[#e5e3dc] bg-gradient-to-br from-white to-[#E8F4FF] p-6 hover:border-[#ff6b00] transition-colors">
              <p className="text-4xl">❄️</p><p className="font-bold mt-2">Surgelato</p><p className="text-sm text-[#1a1a1a]/70">Carne, pesce e piatti pronti.</p>
            </a>
          </div>
        </section>

        <section id="catalogo" className="max-w-7xl mx-auto px-4 lg:px-8 py-2">
          <ProductGrid products={(products as Product[]) || []} />
        </section>

        <section className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          <div className="rounded-2xl bg-gradient-to-br from-[#138808] to-[#1aad0a] text-white p-8 grid md:grid-cols-3 gap-6">
            <div><p className="text-3xl">🚚</p><p className="font-bold mt-2">Consegna veloce</p><p className="text-sm opacity-90">Consegna disponibile in zona.</p></div>
            <div><p className="text-3xl">🛍️</p><p className="font-bold mt-2">Ritiro in negozio</p><p className="text-sm opacity-90">Ordina online e ritira quando vuoi.</p></div>
            <div><p className="text-3xl">💳</p><p className="font-bold mt-2">Ordine semplice</p><p className="text-sm opacity-90">Checkout rapido e tracking ordine.</p></div>
          </div>
        </section>

        <section id="about" className="bg-[linear-gradient(135deg,#FFF7F0,#F0F9EE)] py-12 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
            <div className="grid grid-cols-4 gap-3">
              {["🇮🇳","🌍","🇮🇹","✈️","🌿","🫙","👨‍👩‍👧‍👦","❤️"].map((icon) => (
                <div key={icon} className="bg-white border border-[#e5e3dc] rounded-xl p-4 text-center text-2xl shadow-sm">{icon}</div>
              ))}
            </div>
            <div>
              <h2 className="text-4xl font-black">Chi siamo <span className="text-[#ff6b00]">noi</span></h2>
              <p className="mt-4 text-[#1a1a1a]/80 leading-relaxed">
                Palia Punjabi Market nasce per portare sapori autentici da India, Africa, Italia e dal resto del mondo
                direttamente nella tua cucina, con attenzione alla qualita e al servizio.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
