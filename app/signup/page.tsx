'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { identifyUser, track } from '@/lib/analytics'
import { InteractiveGradient } from '@/components/ui/interactive-gradient'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validatePassword = (pass: string) => {
    if (pass.length < 8) {
      return 'Password must be at least 8 characters'
    }
    if (!/[A-Z]/.test(pass)) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!/[a-z]/.test(pass)) {
      return 'Password must contain at least one lowercase letter'
    }
    if (!/[0-9]/.test(pass)) {
      return 'Password must contain at least one number'
    }
    return null
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!acceptTerms) {
      toast.error('Please accept the Terms of Service and Privacy Policy')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      toast.error(passwordError)
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }

      if (data.user) {
        // Track successful signup
        identifyUser(data.user.id, {
          email: data.user.email,
          full_name: fullName,
          created_at: data.user.created_at,
        })
        track('User Signed Up', {
          method: 'email',
          has_full_name: !!fullName,
        })
        
        toast.success('Account created! Please check your email to verify your account.')
        router.push('/login')
      }
    } catch (error: any) {
      // Track signup failure
      track('Signup Failed', {
        method: 'email',
        error: error.message,
      })
      toast.error(error.message || 'Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: '', color: '' }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' }
    if (strength <= 3) return { strength, label: 'Fair', color: 'bg-yellow-500' }
    if (strength <= 4) return { strength, label: 'Good', color: 'bg-green-500' }
    return { strength, label: 'Strong', color: 'bg-green-600' }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Interactive Gradient Background */}
      <InteractiveGradient />
      
      <div className="w-full max-w-md z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image 
              src="/Trailblazer.png" 
              alt="Trailblazer Logo" 
              width={80} 
              height={80}
              className="drop-shadow-2xl"
            />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-3 drop-shadow-lg">
            Trailblazer
          </h1>
          <p className="text-xl text-white/90">Start planning your dream trip</p>
        </div>

        {/* Glass-morphism Card */}
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isLoading}
                className="h-11"
              />
            </div>

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
              {password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all`}
                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{passwordStrength.label}</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-11"
              />
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                disabled={isLoading}
              />
              <label htmlFor="terms" className="text-sm leading-tight text-muted-foreground">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:scale-105 transition-transform font-semibold"
              disabled={isLoading || !acceptTerms}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold"
            >
              Log in
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

