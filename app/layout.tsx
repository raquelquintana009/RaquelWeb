import React from "react"
import type { Metadata, Viewport } from 'next'

import { Analytics } from '@vercel/analytics/next'
import './globals.css'

import { Inter, Fira_Sans_Condensed as V0_Font_Fira_Sans_Condensed, Geist_Mono as V0_Font_Geist_Mono } from 'next/font/google'

// Initialize fonts
const _firaSansCondensed = V0_Font_Fira_Sans_Condensed({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })

const _inter = Inter({ subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: 'Raquel Quintana',
  description: 'Portfolio of Raquel Quintana',
  generator: 'v0.app',
  icons: {
    icon: '/Icon.jpg',
    apple: '/Icon.jpg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
