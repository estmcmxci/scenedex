import type React from "react"
import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "./providers"
import "./globals.css"

const geistMono = Geist_Mono({ subsets: ["latin"] })

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
    <html lang="en" className="dark">
      <body
        className={`${geistMono.className} font-mono antialiased bg-black text-white min-h-screen selection:bg-white selection:text-black`}
      >
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
