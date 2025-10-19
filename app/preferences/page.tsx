'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTripStore } from '@/lib/store/tripStore';
import { getDefaultVibes, VIBE_PACKS, AVAILABLE_THEMES } from '@/lib/utils/vibes';
import type { UserVibes, DaypartBias } from '@/lib/types/vibes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function PreferencesPage() {
  const router = useRouter();
  const userVibes = useTripStore((state) => state.userVibes);
  const setUserVibes = useTripStore((state) => state.setUserVibes);
  
  const [preferences, setPreferences] = useState<UserVibes>(() => userVibes || getDefaultVibes());

  useEffect(() => {
    if (userVibes) {
      setPreferences(userVibes);
    }
  }, [userVibes]);

  const handleSave = () => {
    setUserVibes({
      ...preferences,
      updated_at: new Date().toISOString(),
    });
    toast.success('Preferences saved! ✨');
    router.push('/demo');
  };

  const updatePreference = (section: keyof UserVibes, updates: any) => {
    setPreferences(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        ...updates,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/demo">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">Travel Preferences</h1>
            <p className="text-muted-foreground">
              Adjust your preferences to get personalized AI suggestions
            </p>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>

        <div className="space-y-6">
          {/* Comfort Preferences */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>⚡</span> Comfort & Pace
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Trip Pace (0 = Relaxed, 100 = Intense)
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={preferences.comfort.pace_score}
                    onChange={(e) => updatePreference('comfort', { pace_score: Number(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12 text-right">
                    {preferences.comfort.pace_score}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {preferences.comfort.pace_score <= 30 ? 'Relaxed & slow' :
                   preferences.comfort.pace_score <= 60 ? 'Moderate pace' : 'Active & intense'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Walking Distance (km per day)
                </label>
                <select
                  value={preferences.comfort.walking_km_per_day}
                  onChange={(e) => updatePreference('comfort', { walking_km_per_day: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value={3}>3km - Minimal walking</option>
                  <option value={5}>5km - Light strolls</option>
                  <option value={8}>8km - Moderate walking</option>
                  <option value={12}>12km - Active exploration</option>
                  <option value={18}>18km+ - All-day adventures</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Preferred Timing
                </label>
                <select
                  value={preferences.comfort.daypart_bias}
                  onChange={(e) => updatePreference('comfort', { daypart_bias: e.target.value as DaypartBias })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="early">🌅 Early Bird - Morning activities</option>
                  <option value="balanced">😌 Balanced - Flexible timing</option>
                  <option value="late">🌙 Night Owl - Late starts, evening focus</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Taste Preferences */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>🍽️</span> Food & Interests
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Food Adventurousness
                </label>
                <select
                  value={preferences.taste.food_adventurousness}
                  onChange={(e) => updatePreference('taste', { food_adventurousness: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value={1}>🥪 Familiar - Stick to what I know</option>
                  <option value={2}>🍝 Regional classics - Local favorites</option>
                  <option value={4}>🍣 Adventurous - Try authentic local cuisine</option>
                  <option value={5}>🧪 Experimental - The weirder the better!</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Dietary Constraints
                </label>
                <Input
                  value={preferences.taste.dietary_constraints.join(', ')}
                  onChange={(e) => updatePreference('taste', {
                    dietary_constraints: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="e.g., vegetarian, no shellfish, gluten-free"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Favorite Themes (select multiple)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {AVAILABLE_THEMES.map((theme) => {
                    const isSelected = preferences.taste.theme_weights[theme.id] === 1.0;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => {
                          const newWeights = { ...preferences.taste.theme_weights };
                          if (isSelected) {
                            delete newWeights[theme.id];
                          } else {
                            newWeights[theme.id] = 1.0;
                          }
                          updatePreference('taste', { theme_weights: newWeights });
                        }}
                        className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {theme.icon} {theme.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>

          {/* Logistics Preferences */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>🚇</span> Logistics & Budget
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Daily Budget (per person, excluding hotel)
                </label>
                <select
                  value={preferences.logistics.budget_ppd}
                  onChange={(e) => updatePreference('logistics', { budget_ppd: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value={40}>💸 €30-50 - Budget-conscious</option>
                  <option value={75}>💳 €50-100 - Moderate spending</option>
                  <option value={150}>💼 €100-200 - Comfortable budget</option>
                  <option value={250}>👑 €200+ - Luxury experience</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Crowd Tolerance
                </label>
                <select
                  value={preferences.logistics.crowd_tolerance}
                  onChange={(e) => updatePreference('logistics', { crowd_tolerance: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value={1}>😌 Avoid lines - Prefer off-peak times</option>
                  <option value={3}>🙂 Some crowds okay - Mix of popular and quiet</option>
                  <option value={5}>😎 Big sights are fine - Don't mind busy places</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Transit Comfort
                </label>
                <select
                  value={preferences.logistics.transit_modes_allowed.includes('ferry') ? 'all' : 
                         preferences.logistics.transit_modes_allowed.includes('bus') ? 'buses' :
                         preferences.logistics.transit_modes_allowed.includes('train') ? 'trains' :
                         preferences.logistics.transit_modes_allowed.includes('metro') ? 'metro' : 'rides'}
                  onChange={(e) => {
                    let modes: string[] = [];
                    if (e.target.value === 'rides') modes = ['rideshare', 'taxi'];
                    else if (e.target.value === 'metro') modes = ['metro', 'tram', 'rideshare'];
                    else if (e.target.value === 'trains') modes = ['metro', 'tram', 'train', 'rideshare'];
                    else if (e.target.value === 'buses') modes = ['metro', 'tram', 'train', 'bus', 'rideshare'];
                    else modes = ['metro', 'tram', 'train', 'bus', 'rideshare', 'taxi', 'ferry'];
                    updatePreference('logistics', { transit_modes_allowed: modes });
                  }}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="rides">🚖 Rideshares/taxis only</option>
                  <option value="metro">🚋 Metro & trams are fine</option>
                  <option value="trains">🚆 Intercity trains too</option>
                  <option value="buses">🚌 Buses are okay</option>
                  <option value="all">🗺️ All public transit - I love it!</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Surprise Factor
                </label>
                <select
                  value={preferences.logistics.surprise_level}
                  onChange={(e) => updatePreference('logistics', { surprise_level: Number(e.target.value) as 0 | 1 | 2 })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value={0}>📋 No surprises - I like to plan everything</option>
                  <option value={1}>🔎 A few twists - Mix of known and new</option>
                  <option value={2}>🎁 Surprise me daily - I love discovering!</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Vibe Packs */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> Vibe Packs
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Select up to 2 vibe packs that match your travel style
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(VIBE_PACKS).map(([name, pack]) => {
                const isSelected = preferences.vibe_packs.includes(name);
                const canSelect = preferences.vibe_packs.length < 2 || isSelected;
                
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setPreferences(prev => ({
                          ...prev,
                          vibe_packs: prev.vibe_packs.filter(p => p !== name),
                        }));
                      } else if (canSelect) {
                        setPreferences(prev => ({
                          ...prev,
                          vibe_packs: [...prev.vibe_packs, name],
                        }));
                      }
                    }}
                    disabled={!canSelect && !isSelected}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : canSelect
                        ? 'border-border hover:border-primary/50'
                        : 'border-border opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{pack.icon}</span>
                      <span className="font-semibold">{name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{pack.description}</p>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Accessibility */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>♿</span> Accessibility & Health
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="wheelchair"
                  checked={preferences.access.wheelchair}
                  onChange={(e) => updatePreference('access', { wheelchair: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="wheelchair" className="text-sm">
                  Wheelchair accessible routes required
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="low_steps"
                  checked={preferences.access.low_steps}
                  onChange={(e) => updatePreference('access', { low_steps: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="low_steps" className="text-sm">
                  Prefer minimal steps/stairs
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="motion_sickness"
                  checked={preferences.access.motion_sickness}
                  onChange={(e) => updatePreference('access', { motion_sickness: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="motion_sickness" className="text-sm">
                  Motion sickness (avoid winding roads)
                </label>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Medical Notes (Optional)
                </label>
                <Textarea
                  value={preferences.access.medical_notes || ''}
                  onChange={(e) => updatePreference('access', { medical_notes: e.target.value })}
                  placeholder="Any other health considerations..."
                  rows={2}
                />
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Link href="/demo">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
