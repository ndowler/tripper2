'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Mail, Calendar, Upload } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at?: string
}

interface ProfileInformationProps {
  profile: UserProfile
  onUpdate: () => void
}

export function ProfileInformation({ profile, onUpdate }: ProfileInformationProps) {
  const [fullName, setFullName] = useState(profile.full_name || '')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const supabase = createClient()

      // Update profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          full_name: fullName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)

      if (profileError) throw profileError

      // Update auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
        },
      })

      if (authError) throw authError

      toast.success('Profile updated successfully')
      onUpdate()
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="w-5 h-5 text-blue-500" />
        <h2 className="text-xl font-semibold">Profile Information</h2>
      </div>

      {/* Avatar Section */}
      <div className="flex items-start gap-6 mb-6">
        <div className="flex-shrink-0">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name || 'User avatar'}
              className="w-20 h-20 rounded-full object-cover border-2 border-border"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-semibold">
              {getInitials(profile.full_name)}
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">
            Profile picture coming soon
          </p>
          <Button variant="outline" size="sm" disabled>
            <Upload className="w-4 h-4 mr-2" />
            Upload Photo
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-2">
            Full Name
          </label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            disabled={isSaving}
          />
        </div>

        {/* Email (Read-only) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={profile.email}
              disabled
              className="pl-10 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            You can change your email in the Security Settings section
          </p>
        </div>

        {/* Member Since */}
        {profile.created_at && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Member Since
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                value={formatDate(profile.created_at)}
                disabled
                className="pl-10 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
              />
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={isSaving || fullName === profile.full_name}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Card>
  )
}

