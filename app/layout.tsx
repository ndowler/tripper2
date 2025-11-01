import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { CookieConsent } from "@/components/analytics/CookieConsent"
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Tripper - Lightning-Fast Trip Planner",
    template: "%s | Tripper",
  },
  description: "Plan your dream trips in minutes with our lightning-fast, offline-first trip planner. Drag & drop organization, AI-powered suggestions, and beautiful design.",
  keywords: ["trip planner", "travel planner", "itinerary", "vacation planner", "travel organizer", "trip planning app", "AI travel suggestions"],
  authors: [{ name: "Tripper Team" }],
  creator: "Tripper",
  publisher: "Tripper",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Tripper - Lightning-Fast Trip Planner",
    description: "Plan your dream trips in minutes. Offline-first, drag & drop, AI-powered suggestions.",
    url: "/",
    siteName: "Tripper",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png", // You'll need to create this
        width: 1200,
        height: 630,
        alt: "Tripper - Trip Planning Made Simple",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tripper - Lightning-Fast Trip Planner",
    description: "Plan your dream trips in minutes. Offline-first, drag & drop, AI-powered suggestions.",
    images: ["/og-image.png"],
    creator: "@tripperapp", // Update with your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AnalyticsProvider>
            {children}
            <Toaster position="top-center" richColors />
            <CookieConsent />
          </AnalyticsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
