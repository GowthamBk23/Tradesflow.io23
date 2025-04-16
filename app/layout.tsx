import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/contexts/user-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TradesFlow - All-in-One Platform for Trades Teams",
  description:
    "Streamline your trade business with project management, scheduling, invoicing, and client management in one powerful platform designed for tradespeople.",
  keywords:
    "tradespeople, contractors, project management, job scheduling, invoices, construction software, trade business, field service management",
  openGraph: {
    title: "TradesFlow - All-in-One Platform for Trades Teams",
    description:
      "Streamline your trade business with project management, scheduling, invoicing, and client management in one powerful platform designed for tradespeople.",
    url: "https://tradesflow.com",
    siteName: "TradesFlow",
    images: [
      {
        url: "/images/tradesflow-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TradesFlow platform dashboard showing project management for trades businesses",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TradesFlow - All-in-One Platform for Trades Teams",
    description:
      "Streamline your trade business with project management, scheduling, invoicing, and client management in one powerful platform designed for tradespeople.",
    images: ["/images/tradesflow-og-image.jpg"],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "TradesFlow",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "299",
                priceCurrency: "GBP",
              },
              description:
                "All-in-one management platform for trade businesses including project management, scheduling, invoicing, and client management.",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "127",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <UserProvider>{children}</UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'