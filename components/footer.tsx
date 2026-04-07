import Link from "next/link"

export function Footer() {
  return (
    <footer id="footer" className="bg-[#1a1a1a] text-white/80 px-4 lg:px-8 py-12 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-white/10">
          <div className="lg:col-span-1">
            <h3 className="font-black text-xl text-[#ff6b00]">Palia Punjabi Market</h3>
            <p className="text-xs uppercase tracking-wider text-white/50 mt-1">Alimentari Internazionale</p>
            <p className="text-sm text-white/60 mt-4 leading-relaxed">
              Il tuo negozio di fiducia per prodotti alimentari da India, Africa, Italia e dal mondo.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3">Shop</h4>
            <Link href="/?category=fresco" className="block py-1 text-sm hover:text-[#ff6b00]">Fresco</Link>
            <Link href="/?category=confezionato" className="block py-1 text-sm hover:text-[#ff6b00]">Confezionato</Link>
            <Link href="/?category=surgelato" className="block py-1 text-sm hover:text-[#ff6b00]">Surgelato</Link>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3">Info</h4>
            <Link href="/traccia-ordine" className="block py-1 text-sm hover:text-[#ff6b00]">Tracciamento ordine</Link>
            <a href="/#about" className="block py-1 text-sm hover:text-[#ff6b00]">Chi siamo</a>
            <a href="/#footer" className="block py-1 text-sm hover:text-[#ff6b00]">Contatti</a>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3">Contatti</h4>
            <p className="text-sm py-1">📞 +39 353 397 4563</p>
            <p className="text-sm py-1">📍 Via Don Pasquino Borgo 8, Poviglio (RE)</p>
            <p className="text-sm py-1">⏰ Lun-Sab: 09:00 - 20:00</p>
          </div>
        </div>

        <div className="mt-6 text-sm text-white/50 flex flex-col md:flex-row gap-2 md:justify-between">
          <p>&copy; {new Date().getFullYear()} Palia Punjabi Market</p>
          <p>Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  )
}
