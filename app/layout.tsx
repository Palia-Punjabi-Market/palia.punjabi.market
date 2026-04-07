import type { Metadata, Viewport } from "next"
import { DM_Sans, Playfair_Display } from "next/font/google"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Palia Punjabi Market - Specialita Indiane e Africane",
  description: "Il tuo negozio di fiducia per prodotti indiani, africani e internazionali. Spezie, riso basmati, prodotti freschi e surgelati.",
  keywords: "negozio indiano, prodotti africani, spezie, riso basmati, cibo etnico, alimentari",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff6b35",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body className={`${dmSans.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
