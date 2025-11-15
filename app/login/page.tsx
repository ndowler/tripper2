'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { identifyUser, track } from '@/lib/analytics'
import { InteractiveGradient } from '@/components/ui/interactive-gradient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (data.user) {
        // Track successful login
        identifyUser(data.user.id, {
          email: data.user.email,
          created_at: data.user.created_at,
        })
        track('User Logged In', {
          method: 'email',
        })
        
        toast.success('Welcome back!')
        router.push('/trips')
        router.refresh()
      }
    } catch (error: any) {
      // Track login failure
      track('Login Failed', {
        method: 'email',
        error: error.message,
      })
      toast.error(error.message || 'Failed to log in')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden bg-gradient-to-br from-background via-background to-background/95 retro-grid-bg">
      {/* Interactive Gradient Background */}
      <InteractiveGradient />

      {/* Retro scan lines */}
      <div className="scan-lines absolute inset-0 pointer-events-none opacity-20" />

      <div className="w-full max-w-md z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta opacity-40 animate-glow-pulse" />
              <Image
                src="/Trailblazer.png"
                alt="Trailblazer Logo"
                width={80}
                height={80}
                className="drop-shadow-2xl relative z-10 rounded-xl"
              />
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-3 drop-shadow-lg retro-text-gradient">
            Trailblazer
          </h1>
          <p className="text-xl text-foreground/90">Welcome back!</p>
        </div>

        {/* Glass-morphism Card */}
        <div className="bg-glass backdrop-blur-strong rounded-2xl shadow-glass border border-white/20 p-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-11"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-11"
              />
            </div>

            <div className="flex items-center justify-end text-sm">
              <Link
                href="/forgot-password"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="neon"
              size="lg"
              className="w-full text-base font-bold"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link
              href="/signup"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold"
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-white/80 hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}

