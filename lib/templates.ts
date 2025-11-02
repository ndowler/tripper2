/**
 * Card templates for quick creation
 */
import { type CardType, type Card } from '@/lib/types'
import { 
  Utensils, 
  Plane, 
  Hotel, 
  MapPin, 
  StickyNote, 
  Train,
  ShoppingBag,
  Ticket
} from 'lucide-react'

export interface CardTemplate {
  id: string
  type: CardType
  title: string
  description: string
  icon: typeof MapPin
  defaultDuration?: number // in minutes
  suggestedTags?: string[]
  placeholder: {
    title: string
    location?: string
    notes?: string
  }
}

export const CARD_TEMPLATES: CardTemplate[] = [
  // Activities
  {
    id: 'activity-museum',
    type: 'activity',
    title: 'Museum Visit',
    description: 'Visit a museum or gallery',
    icon: MapPin,
    defaultDuration: 120,
    suggestedTags: ['culture', 'indoor'],
    placeholder: {
      title: 'Museum of Modern Art',
      location: 'Museum address',
      notes: 'Check for special exhibitions',
    },
  },
  {
    id: 'activity-landmark',
    type: 'activity',
    title: 'Landmark',
    description: 'Visit a famous landmark',
    icon: MapPin,
    defaultDuration: 90,
    suggestedTags: ['sightseeing', 'outdoor'],
    placeholder: {
      title: 'Eiffel Tower',
      location: 'Landmark location',
      notes: 'Arrive early to avoid crowds',
    },
  },
  {
    id: 'activity-tour',
    type: 'activity',
    title: 'Guided Tour',
    description: 'Join a guided tour',
    icon: MapPin,
    defaultDuration: 180,
    suggestedTags: ['tour', 'guided'],
    placeholder: {
      title: 'Walking Tour of Old Town',
      location: 'Meeting point',
      notes: 'Book tickets in advance',
    },
  },
  {
    id: 'activity-hike',
    type: 'activity',
    title: 'Hiking / Nature',
    description: 'Outdoor adventure',
    icon: MapPin,
    defaultDuration: 240,
    suggestedTags: ['outdoor', 'nature', 'active'],
    placeholder: {
      title: 'Mountain Trail Hike',
      location: 'Trailhead address',
      notes: 'Bring water and snacks',
    },
  },
  
  // Restaurants
  {
    id: 'restaurant-dinner',
    type: 'restaurant',
    title: 'Dinner Reservation',
    description: 'Fine dining or special restaurant',
    icon: Utensils,
    defaultDuration: 120,
    suggestedTags: ['dining', 'reservation'],
    placeholder: {
      title: 'Restaurant Name',
      location: 'Restaurant address',
      notes: 'Reservation confirmation number',
    },
  },
  {
    id: 'restaurant-lunch',
    type: 'restaurant',
    title: 'Lunch Spot',
    description: 'Casual lunch location',
    icon: Utensils,
    defaultDuration: 60,
    suggestedTags: ['lunch', 'casual'],
    placeholder: {
      title: 'Local Cafe',
      location: 'Restaurant address',
      notes: 'Try the local specialty',
    },
  },
  {
    id: 'meal-breakfast',
    type: 'meal',
    title: 'Breakfast',
    description: 'Morning meal',
    icon: Utensils,
    defaultDuration: 45,
    suggestedTags: ['breakfast'],
    placeholder: {
      title: 'Hotel Breakfast',
      location: 'Location',
      notes: 'Continental breakfast included',
    },
  },
  {
    id: 'meal-snack',
    type: 'meal',
    title: 'Coffee / Snack',
    description: 'Quick refreshment break',
    icon: Utensils,
    defaultDuration: 30,
    suggestedTags: ['coffee', 'break'],
    placeholder: {
      title: 'Coffee Break',
      location: 'Cafe name',
      notes: '',
    },
  },
  
  // Hotels
  {
    id: 'hotel-checkin',
    type: 'hotel',
    title: 'Hotel Check-in',
    description: 'Arrive at accommodation',
    icon: Hotel,
    defaultDuration: 30,
    suggestedTags: ['accommodation', 'check-in'],
    placeholder: {
      title: 'Hotel Check-in',
      location: 'Hotel name and address',
      notes: 'Confirmation number, check-in time',
    },
  },
  {
    id: 'hotel-checkout',
    type: 'hotel',
    title: 'Hotel Check-out',
    description: 'Leave accommodation',
    icon: Hotel,
    defaultDuration: 30,
    suggestedTags: ['accommodation', 'check-out'],
    placeholder: {
      title: 'Hotel Check-out',
      location: 'Hotel name',
      notes: 'Check-out time, luggage storage',
    },
  },
  
  // Flights
  {
    id: 'flight-departure',
    type: 'flight',
    title: 'Flight Departure',
    description: 'Outbound flight',
    icon: Plane,
    defaultDuration: 180,
    suggestedTags: ['flight', 'departure'],
    placeholder: {
      title: 'Flight ABC123',
      location: 'Airport name',
      notes: 'Flight number, gate, confirmation',
    },
  },
  {
    id: 'flight-arrival',
    type: 'flight',
    title: 'Flight Arrival',
    description: 'Incoming flight',
    icon: Plane,
    defaultDuration: 180,
    suggestedTags: ['flight', 'arrival'],
    placeholder: {
      title: 'Flight XYZ456',
      location: 'Airport name',
      notes: 'Flight number, terminal, baggage claim',
    },
  },
  
  // Transit
  {
    id: 'transit-train',
    type: 'transit',
    title: 'Train Journey',
    description: 'Train or rail travel',
    icon: Train,
    defaultDuration: 120,
    suggestedTags: ['train', 'transit'],
    placeholder: {
      title: 'Train to [Destination]',
      location: 'Departure station',
      notes: 'Platform, seat number, ticket details',
    },
  },
  {
    id: 'transit-transfer',
    type: 'transit',
    title: 'Airport Transfer',
    description: 'Travel to/from airport',
    icon: Train,
    defaultDuration: 60,
    suggestedTags: ['airport', 'transfer'],
    placeholder: {
      title: 'Airport Transfer',
      location: 'Pickup location',
      notes: 'Taxi/shuttle details, meet driver instructions',
    },
  },
  {
    id: 'transit-local',
    type: 'transit',
    title: 'Local Transit',
    description: 'Metro, bus, or local transport',
    icon: Train,
    defaultDuration: 30,
    suggestedTags: ['metro', 'bus'],
    placeholder: {
      title: 'Metro to [Location]',
      location: 'Starting point',
      notes: 'Line, direction, stops',
    },
  },
  
  // Entertainment
  {
    id: 'entertainment-show',
    type: 'entertainment',
    title: 'Show / Concert',
    description: 'Theater, concert, or performance',
    icon: Ticket,
    defaultDuration: 150,
    suggestedTags: ['entertainment', 'show'],
    placeholder: {
      title: 'Theater Show',
      location: 'Venue name and address',
      notes: 'Showtime, seat numbers, dress code',
    },
  },
  {
    id: 'entertainment-nightlife',
    type: 'entertainment',
    title: 'Nightlife',
    description: 'Bar, club, or evening activity',
    icon: Ticket,
    defaultDuration: 180,
    suggestedTags: ['nightlife', 'evening'],
    placeholder: {
      title: 'Rooftop Bar',
      location: 'Venue address',
      notes: 'Reservations, dress code',
    },
  },
  
  // Shopping
  {
    id: 'shopping-market',
    type: 'shopping',
    title: 'Market / Shopping',
    description: 'Shopping district or market',
    icon: ShoppingBag,
    defaultDuration: 90,
    suggestedTags: ['shopping', 'market'],
    placeholder: {
      title: 'Local Market',
      location: 'Market location',
      notes: 'Things to look for, bargaining tips',
    },
  },
  
  // Notes
  {
    id: 'note-reminder',
    type: 'note',
    title: 'Reminder / Note',
    description: 'General reminder or note',
    icon: StickyNote,
    suggestedTags: ['reminder'],
    placeholder: {
      title: 'Remember to...',
      notes: 'Important information or reminders',
    },
  },
]

// Group templates by type
export const TEMPLATES_BY_TYPE = CARD_TEMPLATES.reduce((acc, template) => {
  if (!acc[template.type]) {
    acc[template.type] = []
  }
  acc[template.type].push(template)
  return acc
}, {} as Record<CardType, CardTemplate[]>)

// Helper to create a card from a template
export function createCardFromTemplate(
  template: CardTemplate,
  overrides?: Partial<Card>
): Omit<Card, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    type: template.type,
    title: template.placeholder.title,
    duration: template.defaultDuration,
    location: template.placeholder.location ? {
      name: template.placeholder.location,
    } : undefined,
    notes: template.placeholder.notes,
    tags: template.suggestedTags || [],
    links: [],
    status: 'todo',
    ...overrides,
  }
}

// AI Suggestion categories
export const AI_SUGGESTION_CATEGORIES = [
  {
    id: 'activities',
    name: 'Activities',
    description: 'Things to do and see',
    prompts: [
      'popular attractions',
      'museums and galleries',
      'outdoor activities',
      'historical sites',
      'local experiences',
      'hidden gems',
    ],
  },
  {
    id: 'food',
    name: 'Food & Dining',
    description: 'Restaurants and local cuisine',
    prompts: [
      'best restaurants',
      'local cuisine',
      'street food',
      'cafes and coffee shops',
      'fine dining',
      'budget eats',
    ],
  },
  {
    id: 'hotels',
    name: 'Accommodation',
    description: 'Places to stay',
    prompts: [
      'hotels in downtown',
      'boutique hotels',
      'budget accommodation',
      'luxury resorts',
      'best neighborhoods to stay',
    ],
  },
  {
    id: 'transportation',
    name: 'Transportation',
    description: 'Getting around',
    prompts: [
      'airport transfers',
      'public transportation',
      'day trips',
      'car rentals',
      'train routes',
    ],
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    description: 'Shows, nightlife, and events',
    prompts: [
      'evening activities',
      'nightlife spots',
      'live music venues',
      'theater shows',
      'local events',
    ],
  },
]
