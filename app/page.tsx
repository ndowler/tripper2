import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { InteractiveGradient } from "@/components/ui/interactive-gradient"

export default async function Home() {
  // Check if user is authenticated
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Redirect authenticated users to their trips page
  if (user) {
    redirect('/trips')
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-background via-background to-background/95 retro-grid-bg">
      {/* Interactive Gradient Background */}
      <InteractiveGradient />

      {/* Retro-futuristic scan lines overlay */}
      <div className="scan-lines absolute inset-0 pointer-events-none opacity-20" />

      {/* Centered Content */}
      <div className="text-center space-y-12 z-10 px-4 max-w-4xl mx-auto">
        {/* Logo with neon glow */}
        <div className="flex justify-center animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta opacity-50 animate-glow-pulse" />
            <Image
              src="/tripper.png"
              alt="Triplio Logo"
              width={180}
              height={180}
              className="drop-shadow-2xl relative z-10 rounded-2xl"
              priority
            />
          </div>
        </div>

        {/* Brand Name with retro text gradient */}
        <h1 className="text-7xl sm:text-8xl lg:text-9xl font-bold tracking-tight drop-shadow-lg retro-text-gradient animate-slide-up">
          Triplio
        </h1>

        {/* Tagline */}
        <p className="text-2xl sm:text-3xl lg:text-4xl text-foreground/90 font-light max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
          Plan your dream trip in minutes, not hours
        </p>

        {/* CTA Buttons with glassmorphism */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <Link href="/signup">
            <Button
              variant="neon"
              size="xl"
              className="text-lg px-12 py-7 font-bold"
            >
              Get Started Now
            </Button>
          </Link>
          <Link href="/login">
            <Button
              variant="glass-primary"
              size="xl"
              className="text-lg px-12 py-7 font-semibold"
            >
              Login
            </Button>
          </Link>
        </div>

        {/* Retro-futuristic subtitle */}
        <p className="text-sm text-muted-foreground/70 font-mono uppercase tracking-widest animate-fade-in" style={{ animationDelay: '300ms' }}>
          Powered by AI • Built for Travelers
        </p>
      </div>
    </main>
  )
}
