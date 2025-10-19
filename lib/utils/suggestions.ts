import { SuggestionCard, SuggestionCategory } from '@/lib/types/suggestions';
import { Card, CardType, CardStatus } from '@/lib/types';
import { nanoid } from 'nanoid';

/**
 * Map suggestion category to card type
 */
const CATEGORY_TO_TYPE_MAP: Record<SuggestionCategory, CardType> = {
  food: 'restaurant',
  culture: 'activity',
  nature: 'activity',
  shopping: 'shopping',
  wellness: 'activity',
  nightlife: 'entertainment',
  tour: 'activity',
  coffee: 'meal',
  kids: 'activity',
  other: 'activity',
};

/**
 * Map price tier to estimated cost
 */
const PRICE_TIER_TO_COST = [
  null,                                 // 0 = free
  { amount: 15, currency: 'EUR' },      // 1 = budget
  { amount: 50, currency: 'EUR' },      // 2 = mid
  { amount: 120, currency: 'EUR' },     // 3 = premium
] as const;

/**
 * Convert SuggestionCard to Trip Card for saving
 */
export function suggestionToCard(suggestion: SuggestionCard): Omit<Card, 'createdAt' | 'updatedAt'> {
  return {
    id: nanoid(),
    type: CATEGORY_TO_TYPE_MAP[suggestion.category] || 'activity',
    title: suggestion.title,
    duration: suggestion.est_duration_min,
    location: suggestion.area ? { name: suggestion.area } : undefined,
    notes: suggestion.description + (suggestion.reasons ? `\n\nWhy: ${suggestion.reasons.join(', ')}` : ''),
    tags: suggestion.tags,
    cost: PRICE_TIER_TO_COST[suggestion.price_tier] || undefined,
    links: suggestion.booking?.url ? [suggestion.booking.url] : [],
    status: suggestion.booking?.requires?.includes('ticket') ? 'tentative' : 'todo',
    thumbnail: undefined,
  };
}

/**
 * Batch convert and add to unassigned cards
 */
export function saveSuggestionsToTrip(
  suggestions: SuggestionCard[],
  tripId: string,
  addCard: (tripId: string, dayId: string, card: Omit<Card, 'createdAt' | 'updatedAt'>) => void
): void {
  suggestions.forEach(suggestion => {
    const card = suggestionToCard(suggestion);
    addCard(tripId, 'unassigned', card);
  });
}

/**
 * Get emoji for category
 */
export function getCategoryEmoji(category: SuggestionCategory): string {
  const emojiMap: Record<SuggestionCategory, string> = {
    food: '🍽️',
    culture: '🏛️',
    nature: '🌿',
    shopping: '🛍️',
    wellness: '🧘',
    nightlife: '🌙',
    tour: '🗺️',
    coffee: '☕',
    kids: '👨‍👩‍👧‍👦',
    other: '✨',
  };
  return emojiMap[category];
}

/**
 * Get category color for 4px border
 */
export function getCategoryColor(category: SuggestionCategory): string {
  const colorMap: Record<SuggestionCategory, string> = {
    food: 'border-l-orange-500',
    culture: 'border-l-purple-500',
    nature: 'border-l-green-500',
    shopping: 'border-l-pink-500',
    wellness: 'border-l-teal-500',
    nightlife: 'border-l-indigo-500',
    tour: 'border-l-blue-500',
    coffee: 'border-l-amber-600',
    kids: 'border-l-yellow-500',
    other: 'border-l-gray-500',
  };
  return colorMap[category];
}

/**
 * Format duration for display
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Format price tier for display
 */
export function formatPriceTier(tier: number): string {
  if (tier === 0) return 'Free';
  return '€'.repeat(tier);
}

/**
 * Get daypart display info
 */
export function getDaypartInfo(daypart: string): { emoji: string; label: string } {
  const daypartMap: Record<string, { emoji: string; label: string }> = {
    morning: { emoji: '🌅', label: 'Morning' },
    afternoon: { emoji: '☀️', label: 'Afternoon' },
    evening: { emoji: '🌆', label: 'Evening' },
    night: { emoji: '🌙', label: 'Night' },
    any: { emoji: '🕐', label: 'Anytime' },
  };
  return daypartMap[daypart] || daypartMap.any;
}

/**
 * Generate Google search URL for a suggestion
 */
export function getGoogleSearchUrl(suggestion: SuggestionCard): string {
  const parts = [suggestion.title];
  
  if (suggestion.area) {
    parts.push(suggestion.area);
  }
  
  if (suggestion.subtitle) {
    parts.push(suggestion.subtitle);
  }
  
  const query = parts.join(' ');
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

