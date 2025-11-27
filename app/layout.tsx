import type React from "react"
import type { Metadata } from "next"
import { Geist_Mono, Inconsolata } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "./providers"
import "./globals.css"

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono",
})
const inconsolata = Inconsolata({ 
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inconsolata",
})

export const metadata: Metadata = {
  title: "scenedex",
  description: "Decentralized Music Catalog",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${inconsolata.variable} ${geistMono.variable}`}>
      <body
        className={`${inconsolata.className} antialiased min-h-screen selection:bg-white/20 selection:text-black`}
        style={{
          backgroundColor: '#000000',
        }}
      >
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
