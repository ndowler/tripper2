'use client'

import { UserVibes, VIBE_PACKS } from '@/lib/types/vibes'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface PreferencesSummaryProps {
  vibes: UserVibes | null
}

export function PreferencesSummary({ vibes }: PreferencesSummaryProps) {
  if (!vibes) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h2 className="text-xl font-semibold">Travel Preferences</h2>
        </div>
        
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            You haven't set up your travel preferences yet
          </p>
          <Link href="/preferences">
            <Button>
              <Sparkles className="w-4 h-4 mr-2" />
              Set Up Preferences
            </Button>
          </Link>
        </div>
      </Card>
    )
  }

  const paceLabel =
    vibes.comfort.pace_score <= 30
      ? '🧘 Relaxed & slow'
      : vibes.comfort.pace_score <= 60
      ? '😌 Moderate pace'
      : '⚡ Active & intense'

  const budgetLabel =
    vibes.logistics.budget_ppd <= 50
      ? '💸 Budget-conscious'
      : vibes.logistics.budget_ppd <= 100
      ? '💳 Moderate spending'
      : vibes.logistics.budget_ppd <= 200
      ? '💼 Comfortable'
      : '👑 Luxury'

  const daypartLabels = {
    early: '🌅 Early Bird',
    balanced: '😌 Balanced',
    late: '🌙 Night Owl',
  }

  const selectedThemes = Object.entries(vibes.taste.theme_weights)
    .filter(([_, weight]) => weight >= 0.8)
    .map(([theme]) => theme)

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h2 className="text-xl font-semibold">Travel Preferences</h2>
        </div>
        <Link href="/preferences">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Comfort & Pace */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Travel Style</h3>
          <div className="space-y-1">
            <p className="text-sm">{paceLabel}</p>
            <p className="text-sm">{daypartLabels[vibes.comfort.daypart_bias]}</p>
            <p className="text-sm">🚶 {vibes.comfort.walking_km_per_day}km walking/day</p>
          </div>
        </div>

        {/* Budget & Crowds */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Budget & Crowds</h3>
          <div className="space-y-1">
            <p className="text-sm">{budgetLabel}</p>
            <p className="text-sm">
              {vibes.logistics.crowd_tolerance === 1
                ? '😌 Avoid lines'
                : vibes.logistics.crowd_tolerance === 3
                ? '🙂 Some crowds okay'
                : '😎 Big sights fine'}
            </p>
          </div>
        </div>

        {/* Food Preferences */}
        {(vibes.taste.food_adventurousness > 1 || vibes.taste.dietary_constraints.length > 0) && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Food Preferences</h3>
            <div className="space-y-1">
              <p className="text-sm">
                {vibes.taste.food_adventurousness === 1
                  ? '🥪 Familiar foods'
                  : vibes.taste.food_adventurousness === 2
                  ? '🍝 Regional classics'
                  : vibes.taste.food_adventurousness === 4
                  ? '🍣 Adventurous eater'
                  : '🧪 Experimental'}
              </p>
              {vibes.taste.dietary_constraints.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {vibes.taste.dietary_constraints.join(', ')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Themes */}
        {selectedThemes.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Favorite Themes</h3>
            <div className="flex flex-wrap gap-1">
              {selectedThemes.slice(0, 4).map((theme) => (
                <Badge key={theme} variant="secondary" className="text-xs">
                  {theme}
                </Badge>
              ))}
              {selectedThemes.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{selectedThemes.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Vibe Packs */}
      {vibes.vibe_packs.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Active Vibe Packs</h3>
          <div className="flex flex-wrap gap-2">
            {vibes.vibe_packs.map((packName) => {
              const pack = VIBE_PACKS[packName as keyof typeof VIBE_PACKS]
              return pack ? (
                <div
                  key={packName}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20"
                >
                  <span>{pack.icon}</span>
                  <span className="text-sm font-medium">{packName}</span>
                </div>
              ) : null
            })}
          </div>
        </div>
      )}
    </Card>
  )
}

