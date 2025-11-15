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
    default: "Trailblazer - Plan Your Dream Trip",
    template: "%s | Trailblazer",
  },
  description: "Plan your dream trip in minutes, not hours. Lightning-fast, intuitive trip planner with AI-powered suggestions and beautiful design.",
  keywords: ["trip planner", "travel planner", "itinerary", "vacation planner", "travel organizer", "trip planning app", "AI travel suggestions"],
  authors: [{ name: "Trailblazer Team" }],
  creator: "Trailblazer",
  publisher: "Trailblazer",
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
    title: "Trailblazer - Plan Your Dream Trip",
    description: "Plan your dream trip in minutes, not hours. Lightning-fast trip planner with AI-powered suggestions.",
    url: "/",
    siteName: "Trailblazer",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/Trailblazer.png",
        width: 512,
        height: 512,
        alt: "Trailblazer - Plan Your Dream Trip",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trailblazer - Plan Your Dream Trip",
    description: "Plan your dream trip in minutes, not hours. Lightning-fast trip planner with AI-powered suggestions.",
    images: ["/Trailblazer.png"],
    creator: "@trailblazerapp",
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
    icon: "/Trailblazer.png",
    shortcut: "/Trailblazer.png",
    apple: "/Trailblazer.png",
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
