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
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Interactive Gradient Background */}
      <InteractiveGradient />
      
      {/* Centered Content */}
      <div className="text-center space-y-12 z-10 px-4 max-w-4xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center">
          <Image 
            src="/Trailblazer.png" 
            alt="Trailblazer Logo" 
            width={180} 
            height={180}
            className="drop-shadow-2xl"
            priority
          />
        </div>
        
        {/* Brand Name */}
        <h1 className="text-7xl sm:text-8xl lg:text-9xl font-bold text-white tracking-tight drop-shadow-lg">
          Trailblazer
        </h1>
        
        {/* Tagline */}
        <p className="text-2xl sm:text-3xl lg:text-4xl text-white/90 font-light max-w-3xl mx-auto">
          Plan your dream trip in minutes, not hours
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Link href="/signup">
            <Button 
              size="lg" 
              className="text-lg px-10 py-7 bg-white text-blue-600 hover:bg-white/90 shadow-2xl hover:scale-105 transition-transform font-semibold"
            >
              Get Started Now
            </Button>
          </Link>
          <Link href="/login">
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-10 py-7 bg-transparent text-white border-2 border-white hover:bg-white/10 shadow-lg hover:scale-105 transition-transform font-semibold"
            >
              Login
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
