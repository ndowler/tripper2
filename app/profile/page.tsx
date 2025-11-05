'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTripStore } from '@/lib/store/tripStore'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ArrowLeft, LogOut, Trash2 } from 'lucide-react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ProfileInformation } from '@/components/profile/ProfileInformation'
import { PreferencesSummary } from '@/components/profile/PreferencesSummary'
import { SecuritySettings } from '@/components/profile/SecuritySettings'
import { OnboardingSettings } from '@/components/profile/OnboardingSettings'

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const userVibes = useTripStore((state) => state.userVibes)
  const loadPreferences = useTripStore((state) => state.loadPreferences)

  useEffect(() => {
    loadProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadProfile = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      // Load user profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      const userProfile: UserProfile = {
        id: user.id,
        email: user.email!,
        full_name: profileData?.full_name || user.user_metadata?.full_name || null,
        avatar_url: profileData?.avatar_url || null,
        created_at: user.created_at,
      }

      setProfile(userProfile)

      // Load travel preferences
      await loadPreferences(user.id)
    } catch (error: any) {
      console.error('Error loading profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
    } catch (error: any) {
      toast.error('Failed to log out')
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)

    try {
      const supabase = createClient()
      
      // Delete user account (this will cascade delete all user data via RLS)
      const { error } = await supabase.rpc('delete_user')

      if (error) {
        // Fallback: just sign out
        await supabase.auth.signOut()
      }

      toast.success('Account deleted successfully')
      router.push('/')
      router.refresh()
    } catch (error: any) {
      console.error('Error deleting account:', error)
      toast.error('Failed to delete account')
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </main>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/trips"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to trips
          </Link>
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid gap-6">
          {/* Profile Information */}
          <ProfileInformation profile={profile} onUpdate={loadProfile} />

          {/* Travel Preferences */}
          <PreferencesSummary vibes={userVibes} />

          {/* Security Settings */}
          <SecuritySettings email={profile.email} />

          {/* Onboarding Tutorial */}
          <OnboardingSettings userId={profile.id} />

          {/* Account Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
                Danger Zone
              </h2>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. All your trips and data will be permanently deleted.
            </p>

            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you absolutely sure you want to delete your account? This action cannot be undone.
              All your trips, cards, and data will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}

