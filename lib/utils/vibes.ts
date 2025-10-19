import { UserVibes, VIBE_PACKS, VibePackName, AVAILABLE_THEMES } from '@/lib/types/vibes';

// Re-export for convenience
export { VIBE_PACKS, AVAILABLE_THEMES } from '@/lib/types/vibes';

/**
 * Get default vibes for new users
 */
export function getDefaultVibes(): UserVibes {
  return {
    profile: {
      language_prefs: ['EN'],
      carry_on_only: false,
    },
    comfort: {
      pace_score: 50,
      walking_km_per_day: 8,
      daypart_bias: 'balanced',
      rest_ratio: 0.25,
    },
    taste: {
      food_adventurousness: 3,
      dietary_constraints: [],
      theme_weights: {},
    },
    logistics: {
      transit_modes_allowed: ['metro', 'tram', 'train', 'rideshare'],
      crowd_tolerance: 3,
      budget_ppd: 100,
      surprise_level: 1,
    },
    access: {
      wheelchair: false,
      low_steps: false,
      seating_frequency: false,
      motion_sickness: false,
    },
    vibe_packs: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Convert vibes to JSON format for AI consumption
 */
export function vibesToJSON(vibes: UserVibes, tripId?: string): Record<string, any> {
  // Apply trip overrides if tripId provided
  const effectiveVibes = tripId && vibes.trip_overrides?.[tripId]
    ? mergeVibes(vibes, vibes.trip_overrides[tripId])
    : vibes;

  return {
    user_id: 'current', // Will be replaced with real user ID in Phase 6
    profile: effectiveVibes.profile,
    comfort: effectiveVibes.comfort,
    taste: effectiveVibes.taste,
    logistics: effectiveVibes.logistics,
    access: effectiveVibes.access,
    vibe_packs: effectiveVibes.vibe_packs,
    hard_constraints: effectiveVibes.hard_constraints,
  };
}

/**
 * Merge vibes with overrides (deep merge)
 */
function mergeVibes(base: UserVibes, overrides: Partial<UserVibes>): UserVibes {
  return {
    ...base,
    profile: { ...base.profile, ...overrides.profile },
    comfort: { ...base.comfort, ...overrides.comfort },
    taste: { ...base.taste, ...overrides.taste },
    logistics: { ...base.logistics, ...overrides.logistics },
    access: { ...base.access, ...overrides.access },
    vibe_packs: overrides.vibe_packs ?? base.vibe_packs,
    trip_overrides: base.trip_overrides,
    hard_constraints: { ...base.hard_constraints, ...overrides.hard_constraints },
  };
}

/**
 * Generate AI-friendly prompt from vibes
 */
export function vibesToPrompt(vibes: UserVibes, tripId?: string): string {
  const json = vibesToJSON(vibes, tripId);
  const { comfort, taste, logistics, vibe_packs } = json;

  const paceDesc = comfort.pace_score <= 30 ? 'relaxed/slow' 
    : comfort.pace_score <= 60 ? 'moderate' 
    : 'active/intense';

  const daypartDesc = comfort.daypart_bias === 'early' ? 'early morning starts'
    : comfort.daypart_bias === 'late' ? 'late starts, evening activities'
    : 'flexible timing';

  const foodDesc = taste.food_adventurousness <= 2 ? 'familiar, safe options'
    : taste.food_adventurousness <= 3 ? 'regional classics'
    : taste.food_adventurousness <= 4 ? 'adventurous local cuisine'
    : 'experimental and wild food experiences';

  const crowdDesc = logistics.crowd_tolerance <= 2 ? 'avoid lines and crowds'
    : logistics.crowd_tolerance <= 3 ? 'okay with some crowds'
    : 'fine with popular busy attractions';

  const topThemes = Object.entries(taste.theme_weights)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([theme, weight]) => `${theme} (${Math.round(weight * 100)}%)`)
    .join(', ');

  let prompt = `User Travel Preferences:
- Pace: ${paceDesc} (${comfort.pace_score}/100)
- Walking: ${comfort.walking_km_per_day}km per day
- Timing: ${daypartDesc}
- Budget: €${logistics.budget_ppd} per person per day (excl. hotel)
- Food style: ${foodDesc}
- Crowd tolerance: ${crowdDesc}
- Transit: ${logistics.transit_modes_allowed.join(', ')}
- Surprise level: ${logistics.surprise_level === 0 ? 'no surprises' : logistics.surprise_level === 1 ? 'few surprises' : 'surprise me daily'}`;

  if (topThemes) {
    prompt += `\n- Top themes: ${topThemes}`;
  }

  if (vibe_packs.length > 0) {
    prompt += `\n- Vibe packs: ${vibe_packs.join(', ')}`;
  }

  if (taste.dietary_constraints.length > 0) {
    prompt += `\n- Dietary: ${taste.dietary_constraints.join(', ')}`;
  }

  if (json.access.wheelchair || json.access.low_steps || json.access.motion_sickness) {
    const accessNeeds = [];
    if (json.access.wheelchair) accessNeeds.push('wheelchair accessible');
    if (json.access.low_steps) accessNeeds.push('minimal steps');
    if (json.access.motion_sickness) accessNeeds.push('motion sickness (avoid winding roads)');
    prompt += `\n- Accessibility: ${accessNeeds.join(', ')}`;
  }

  prompt += `\n\nRules:
- Honor pace and walking limits
- Respect daypart bias (start times)
- Stay within budget range
- ${logistics.crowd_tolerance <= 2 ? 'Prioritize off-peak times and lesser-known alternatives' : 'Include popular attractions'}
- ${logistics.surprise_level === 0 ? 'Only suggest well-known, predictable activities' : logistics.surprise_level === 1 ? 'Include 1 surprise/hidden gem per day' : 'Include 2+ surprises per day'}`;

  return prompt;
}

/**
 * Apply vibe pack to user vibes
 */
export function applyVibePack(vibes: UserVibes, packName: VibePackName): UserVibes {
  const pack = VIBE_PACKS[packName];
  if (!pack) return vibes;

  // Merge pack themes with existing themes
  const mergedThemes = { ...vibes.taste.theme_weights };
  Object.entries(pack.themes).forEach(([theme, weight]) => {
    mergedThemes[theme] = weight;
  });

  return {
    ...vibes,
    comfort: {
      ...vibes.comfort,
      pace_score: pack.pace,
      daypart_bias: pack.daypart,
    },
    taste: {
      ...vibes.taste,
      theme_weights: mergedThemes,
    },
    vibe_packs: [...vibes.vibe_packs, packName],
    updated_at: new Date().toISOString(),
  };
}

/**
 * Calculate theme weights from selected theme IDs
 */
export function calculateThemeWeights(selectedThemeIds: string[]): Record<string, number> {
  const weights: Record<string, number> = {};
  
  // Primary selected themes get weight 1.0
  selectedThemeIds.forEach(id => {
    weights[id] = 1.0;
  });
  
  // Related themes get lower weights (this is a simple implementation)
  // In a real app, you might have a theme relationship graph
  
  return weights;
}

/**
 * Get a human-readable summary of vibes
 */
export function getVibesSummary(vibes: UserVibes): string {
  const packs = vibes.vibe_packs.length > 0 
    ? vibes.vibe_packs.slice(0, 2).join(' + ')
    : 'Custom';
  
  const budget = vibes.logistics.budget_ppd;
  const budgetStr = budget <= 50 ? '€€' : budget <= 100 ? '€€€' : budget <= 200 ? '€€€€' : '€€€€€';
  
  const daypart = vibes.comfort.daypart_bias === 'early' ? '🌅 Early Bird'
    : vibes.comfort.daypart_bias === 'late' ? '🌙 Night Owl'
    : '😌 Balanced';
  
  return `${packs} • ${budgetStr} • ${daypart}`;
}

/**
 * Check if user has completed vibes quiz
 */
export function hasCompletedVibes(vibes: UserVibes | null): boolean {
  if (!vibes) return false;
  
  // Consider completed if they have at least one vibe pack or custom theme weights
  return vibes.vibe_packs.length > 0 || Object.keys(vibes.taste.theme_weights).length > 0;
}
