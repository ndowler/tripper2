# System Patterns

**Project:** Tripper  
**Framework:** Next.js 15 (App Router)  
**Language:** TypeScript 5  
**Last Updated:** November 1, 2025

---

## 🏗 Architecture Overview

### High-Level Architecture
```
┌─────────────────────────────────────────────┐
│           Next.js App Router                │
│  (app/) - Pages with file-based routing     │
└────────────────┬────────────────────────────┘
                 │
┌────────────────┴────────────────────────────┐
│         React Components Layer              │
│  (components/) - UI building blocks         │
│   ├── board/    - Trip board components     │
│   ├── cards/    - Card display & modals     │
│   ├── trips/    - Trip management           │
│   ├── vibes/    - Preferences & discovery   │
│   └── ui/       - Reusable primitives       │
└────────────────┬────────────────────────────┘
                 │
┌────────────────┴────────────────────────────┐
│         State Management Layer              │
│  (lib/store/) - Zustand + Immer + Zundo     │
│   - tripStore.ts   - Global trip state      │
│   - temporal       - Undo/redo middleware   │
└────────────────┬────────────────────────────┘
                 │
┌────────────────┴────────────────────────────┐
│         Services Layer (NEW)                │
│  (lib/services/) - Data access abstraction  │
│   - trips-service.ts   - Trip CRUD          │
│   - cards-service.ts   - Card CRUD          │
│   - days-service.ts    - Day CRUD           │
│   - preferences-service.ts - User prefs     │
└────────────────┬────────────────────────────┘
                 │
┌────────────────┴────────────────────────────┐
│         Data Persistence Layer (HYBRID)     │
│  localStorage + Supabase                    │
│   - localStorage: Instant, offline-first    │
│   - Supabase: Cloud sync, multi-device      │
│   - Auto-save with 500ms debounce           │
└────────────────┬────────────────────────────┘
                 │
┌────────────────┴────────────────────────────┐
│           External Services                 │
│   - Supabase (auth, database, realtime)     │
│   - OpenAI GPT-4o-mini (AI features)        │
│   - Future: Affiliate APIs (bookings)       │
└─────────────────────────────────────────────┘
```

---

## 📁 Directory Structure

### Complete File Tree
```
tripper/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── ai-day-plan/          # Generate full day plan
│   │   ├── ai-regenerate-card/   # Regenerate single card
│   │   ├── ai-suggestions/       # Get AI card suggestions
│   │   ├── ai-swap-card/         # Swap card with AI
│   │   ├── slingshot-trip/       # NEW: Complete trip generation
│   │   └── vibe-suggestions/     # Personalized travel suggestions
│   ├── about/                    # About page (NEW)
│   │   └── page.tsx
│   ├── auth/                     # Auth callbacks (NEW)
│   │   └── callback/
│   │       └── route.ts
│   ├── demo/                     # Demo trip page
│   │   └── page.tsx
│   ├── discover/                 # AI discovery page
│   │   └── page.tsx
│   ├── forgot-password/          # Password reset (NEW)
│   │   └── page.tsx
│   ├── login/                    # Authentication (NEW)
│   │   └── page.tsx
│   ├── preferences/              # User settings
│   │   └── page.tsx
│   ├── privacy/                  # Privacy policy (NEW)
│   │   └── page.tsx
│   ├── profile/                  # User profile (NEW)
│   │   └── page.tsx
│   ├── reset-password/           # Password reset (NEW)
│   │   └── page.tsx
│   ├── signup/                   # Registration (NEW)
│   │   └── page.tsx
│   ├── terms/                    # Terms of service (NEW)
│   │   └── page.tsx
│   ├── trip/                     # Individual trip routes
│   │   └── [id]/                 # Dynamic trip ID
│   │       └── page.tsx
│   ├── trips/                    # Trips overview
│   │   └── page.tsx
│   ├── vibes/                    # Vibes quiz
│   │   └── page.tsx
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── sitemap.ts                # Sitemap generator (NEW)
│
├── components/                   # React components
│   ├── board/                    # Trip board components
│   │   ├── AddDayButton.tsx
│   │   ├── AiDayPlanner.tsx
│   │   ├── Board.tsx
│   │   ├── DayColumn.tsx
│   │   ├── DayEditModal.tsx
│   │   ├── EditableHeader.tsx
│   │   ├── ThingsToDoColumn.tsx
│   │   └── ThingsToDoDrawer.tsx
│   ├── cards/                    # Card components
│   │   ├── AiCardSuggestion.tsx
│   │   ├── CardComposer.tsx
│   │   ├── CardDetailModal.tsx
│   │   ├── SortableCard.tsx
│   │   ├── StatusDot.tsx
│   │   ├── SuggestionCard.tsx
│   │   ├── SuggestionDetailModal.tsx
│   │   └── TripCard.tsx
│   ├── command-palette/          # Command palette
│   │   └── CommandPalette.tsx
│   ├── trips/                    # Trip management
│   │   ├── DeleteTripDialog.tsx
│   │   ├── EditTripModal.tsx
│   │   ├── EmptyTripsState.tsx
│   │   ├── NewTripModal.tsx
│   │   ├── NewTripCard.tsx
│   │   ├── SlingshotQuestionnaire.tsx  # NEW: Slingshot questionnaire
│   │   ├── SlingshotLoadingOverlay.tsx # NEW: Loading with progress
│   │   ├── SlingshotExplainOverlay.tsx # NEW: One-time vibe explanation
│   │   ├── TripCard.tsx
│   │   ├── TripCardSkeleton.tsx
│   │   ├── TripGrid.tsx
│   │   ├── TripStats.tsx
│   │   └── ViewControls.tsx
│   ├── ui/                       # shadcn/ui primitives
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   └── toaster.tsx
│   ├── vibes/                    # Vibes & discovery
│   │   ├── EmojiSelector.tsx
│   │   ├── SliderInput.tsx
│   │   ├── SuggestionGrid.tsx
│   │   ├── ThemePicker.tsx
│   │   ├── VibePackSelector.tsx
│   │   └── VibesCard.tsx
│   ├── profile/                  # Profile management (NEW)
│   │   ├── ProfileInformation.tsx
│   │   ├── PreferencesSummary.tsx
│   │   └── SecuritySettings.tsx
│   └── migration/                # Data migration (NEW)
│       └── MigrationDialog.tsx
│
├── lib/                          # Core logic & utilities
│   ├── hooks/                    # Custom React hooks
│   │   ├── useKeyboardShortcuts.ts
│   │   └── useUndoRedo.ts
│   ├── schemas/                  # Zod validation schemas
│   │   ├── index.ts              # Card & Trip schemas
│   │   ├── suggestions.ts        # SuggestionCard + Slingshot schemas
│   │   └── vibes.ts              # UserVibes schema
│   ├── services/                 # Data access layer (NEW)
│   │   ├── trips-service.ts      # Trip CRUD operations
│   │   ├── cards-service.ts      # Card CRUD operations
│   │   ├── days-service.ts       # Day CRUD operations
│   │   └── preferences-service.ts # User preferences
│   ├── store/                    # State management
│   │   └── tripStore.ts          # Zustand store with persistence
│   ├── supabase/                 # Supabase integration (NEW)
│   │   ├── client.ts             # Client-side instance
│   │   ├── server.ts             # Server-side instance
│   │   ├── middleware.ts         # Auth middleware helpers
│   │   └── database.sql          # Schema & RLS policies
│   ├── types/                    # TypeScript types
│   │   ├── index.ts              # Core types (Trip, Card, Day)
│   │   ├── suggestions.ts        # SuggestionCard types
│   │   ├── vibes.ts              # UserVibes types
│   │   └── slingshot.ts          # NEW: Slingshot types
│   ├── utils/                    # Utility functions
│   │   ├── dnd.ts                # Drag & drop helpers
│   │   ├── migration.ts          # Data migration (NEW)
│   │   ├── suggestions.ts        # Suggestion conversion
│   │   ├── time.ts               # Time formatting
│   │   ├── trips.ts              # Trip utilities (NEW)
│   │   └── vibes.ts              # Vibes utilities
│   ├── constants.ts              # App constants
│   ├── seed-data.ts              # Demo trip data
│   ├── templates.ts              # Card templates
│   └── utils.ts                  # General utilities (cn)
│
├── memory-bank/                  # Project documentation
│   ├── activeContext.md          # Current state & focus
│   ├── productContext.md         # Product vision & features
│   ├── systemPatterns.md         # This file
│   ├── progress.md               # Completed phases
│   └── techStack.md              # Technologies & rationale
│
├── .cursor/rules/                # AI assistant rules
│   ├── core.mdc                  # Core operating modes
│   ├── memory-bank.mdc           # Memory bank system
│   └── tripper-project.mdc       # Project intelligence
├── components.json               # shadcn/ui config
├── middleware.ts                 # Auth middleware (NEW)
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies
├── postcss.config.js             # PostCSS config
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json                 # TypeScript config
└── .env.local                    # Environment variables (gitignored)
```

---

## 🎨 Design Patterns

### 1. Component Patterns

#### Modal State Pattern
Use nullable state for modals to track both open/closed and data:
```typescript
const [editingTrip, setEditingTrip] = useState<Trip | null>(null)

// Open modal with data
<Button onClick={() => setEditingTrip(trip)}>Edit</Button>

// Modal component
<Dialog open={!!editingTrip} onOpenChange={(open) => !open && setEditingTrip(null)}>
  {editingTrip && <EditForm trip={editingTrip} />}
</Dialog>
```

#### Action Handler Pattern
Pass action handlers down to child components:
```typescript
<TripCard
  trip={trip}
  onEdit={(trip) => setEditingTrip(trip)}
  onDuplicate={(trip) => handleDuplicate(trip)}
  onDelete={(trip) => setDeletingTrip(trip)}
/>
```

#### Sortable Component Pattern
Use dnd-kit's `useSortable` hook for draggable items:
```typescript
function SortableCard({ card }: { card: Card }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ 
    id: card.id 
  })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TripCard card={card} />
    </div>
  )
}
```

### 2. State Management Patterns

#### Store Pattern (Zustand)
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { temporal } from 'zundo'
import { produce } from 'immer'

interface TripStore {
  // State
  trips: Record<string, Trip>
  currentTripId: string | null
  
  // Actions
  addTrip: (trip: Trip) => void
  updateTrip: (id: string, updates: Partial<Trip>) => void
  deleteTrip: (id: string) => void
  
  // Getters
  getCurrentTrip: () => Trip | null
  getAllTrips: () => Trip[]
}

export const useTripStore = create<TripStore>()(
  temporal(
    persist(
      (set, get) => ({
        // State
        trips: {},
        currentTripId: null,
        
        // Actions
        addTrip: (trip) => set(produce((state) => {
          state.trips[trip.id] = trip
          state.currentTripId = trip.id
        })),
        
        // Getters
        getCurrentTrip: () => {
          const { trips, currentTripId } = get()
          return currentTripId ? trips[currentTripId] : null
        },
      }),
      {
        name: 'tripper-store',
        partialize: (state) => ({ trips: state.trips, currentTripId: state.currentTripId }),
      }
    ),
    { limit: 50 }
  )
)
```

#### Immutable Updates with Immer
Always use `produce` for nested updates:
```typescript
updateCard: (cardId, updates) => set(produce((state) => {
  const trip = state.trips[state.currentTripId!]
  const day = trip.days.find(d => d.cards.some(c => c.id === cardId))
  const card = day?.cards.find(c => c.id === cardId)
  if (card) Object.assign(card, updates)
}))
```

### 3. Data Flow Patterns

#### Top-Down Data Flow
```
Store (source of truth)
  ↓
Page Component (fetches from store)
  ↓
Container Component (manages state)
  ↓
Presentational Component (displays data)
```

#### Event Bubbling Pattern
```
User Action
  ↓
Component Event Handler
  ↓
Store Action
  ↓
Immer Update
  ↓
Persist Middleware (auto-save)
  ↓
Re-render
```

### 4. API Route Patterns

#### Standard API Route Structure
```typescript
// app/api/vibe-suggestions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { SuggestionCardSchema } from '@/lib/schemas/suggestions'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    // 1. Parse and validate input
    const body = await req.json()
    const { destination, vibes } = body
    
    // 2. Call external API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    })
    
    // 3. Parse and validate output
    const suggestions = JSON.parse(response.choices[0].message.content!)
    const validated = suggestions
      .map(s => SuggestionCardSchema.safeParse(s))
      .filter(r => r.success)
      .map(r => r.data)
    
    // 4. Return JSON response
    return NextResponse.json({ suggestions: validated })
    
  } catch (error) {
    // 5. Handle errors
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    )
  }
}
```

### 5. Services Layer Pattern (NEW)

#### Service Module Structure
Services abstract data access from UI components:
```typescript
// lib/services/trips-service.ts
import { createClient } from '@/lib/supabase/client'
import type { Trip } from '@/lib/types'

export async function getTrips(userId: string): Promise<Trip[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('trips')
    .select('*, days(*, cards(*))')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
  
  if (error) throw error
  return data as Trip[]
}

export async function createTrip(trip: Omit<Trip, 'id'>): Promise<Trip> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('trips')
    .insert([trip])
    .select()
    .single()
  
  if (error) throw error
  return data as Trip
}

export async function updateTrip(id: string, updates: Partial<Trip>): Promise<Trip> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('trips')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as Trip
}

export async function deleteTrip(id: string): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('trips')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}
```

#### Component Usage
```typescript
// Components use services, not direct Supabase calls
import { getTrips, createTrip } from '@/lib/services/trips-service'

function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  
  useEffect(() => {
    async function loadTrips() {
      const user = await getCurrentUser()
      if (user) {
        const data = await getTrips(user.id)
        setTrips(data)
      }
    }
    loadTrips()
  }, [])
  
  return <TripGrid trips={trips} />
}
```

### 6. Supabase Patterns (NEW)

#### Client-Side Supabase
```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

#### Server-Side Supabase
```typescript
// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}
```

#### Auth Middleware
```typescript
// middleware.ts
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

#### Row-Level Security (RLS)
```sql
-- lib/supabase/database.sql

-- Enable RLS
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Users can only see their own trips
CREATE POLICY "Users can view own trips"
  ON trips FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only create trips for themselves
CREATE POLICY "Users can create own trips"
  ON trips FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own trips
CREATE POLICY "Users can update own trips"
  ON trips FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own trips
CREATE POLICY "Users can delete own trips"
  ON trips FOR DELETE
  USING (auth.uid() = user_id);
```

#### Authentication Flow
```typescript
// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
})

// Signup
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { full_name }
  }
})

// Password Reset
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/reset-password`,
})

// Logout
await supabase.auth.signOut()
```

### 7. Data Migration Pattern (NEW)

#### Migration Utilities
```typescript
// lib/utils/migration.ts
import { createClient } from '@/lib/supabase/client'
import type { Trip } from '@/lib/types'

export async function migrateLocalStorageToSupabase(userId: string) {
  // 1. Load from localStorage
  const storedData = localStorage.getItem('tripper-store')
  if (!storedData) return
  
  const { trips } = JSON.parse(storedData)
  
  // 2. Migrate each trip
  const supabase = createClient()
  for (const trip of Object.values(trips)) {
    await migrateTrip(supabase, trip as Trip, userId)
  }
  
  // 3. Clear localStorage after successful migration
  localStorage.removeItem('tripper-store')
}

async function migrateTrip(supabase: any, trip: Trip, userId: string) {
  // Insert trip
  const { data: tripData } = await supabase
    .from('trips')
    .insert([{ ...trip, user_id: userId }])
    .select()
    .single()
  
  // Insert days and cards
  for (const day of trip.days) {
    const { data: dayData } = await supabase
      .from('days')
      .insert([{ ...day, trip_id: tripData.id }])
      .select()
      .single()
    
    for (const card of day.cards) {
      await supabase
        .from('cards')
        .insert([{ ...card, day_id: dayData.id }])
    }
  }
}
```

### 9. Validation Patterns

#### Schema-First Approach
Define Zod schemas, then infer TypeScript types:
```typescript
// lib/schemas/index.ts
import { z } from 'zod'

export const CardSchema = z.object({
  id: z.string(),
  type: z.enum(['activity', 'meal', 'restaurant', 'transit', 'flight', 'hotel', 'shopping', 'entertainment', 'note']),
  title: z.string().min(1),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  location: z.object({
    name: z.string(),
    address: z.string().optional(),
  }).optional(),
  cost: z.object({
    amount: z.number().positive(),
    currency: z.string(),
  }).optional(),
  status: z.enum(['todo', 'tentative', 'confirmed']),
  tags: z.array(z.string()),
  links: z.array(z.string().url()),
  notes: z.string().optional(),
})

export type Card = z.infer<typeof CardSchema>
```

#### Runtime Validation
```typescript
// Validate user input
const result = CardSchema.safeParse(userInput)
if (!result.success) {
  console.error('Validation error:', result.error)
  return
}
const card: Card = result.data
```

#### Salvage Logic for AI Outputs
```typescript
// Accept partial valid results
const validSuggestions = suggestions
  .map(s => SuggestionCardSchema.safeParse(s))
  .filter(r => r.success)
  .map(r => r.data)

if (validSuggestions.length < 10) {
  throw new Error('Not enough valid suggestions')
}
```

---

## 🎯 Naming Conventions

### Files & Directories
- **Pages:** `page.tsx` (Next.js convention)
- **Components:** PascalCase, e.g., `TripCard.tsx`
- **Utilities:** camelCase, e.g., `storage.ts`
- **Types:** PascalCase, e.g., `Card`, `Trip`
- **Constants:** SCREAMING_SNAKE_CASE, e.g., `CARD_TYPES`

### Variables & Functions
- **State:** camelCase, e.g., `currentTrip`, `isLoading`
- **Props:** camelCase, e.g., `onEdit`, `cardId`
- **Functions:** camelCase, verbs, e.g., `addCard`, `handleDelete`
- **Hooks:** `use` prefix, e.g., `useKeyboardShortcuts`
- **Components:** PascalCase, e.g., `TripCard`, `Board`

### Store Actions
- **Create:** `add*`, e.g., `addTrip`, `addCard`
- **Read:** `get*`, e.g., `getCurrentTrip`, `getAllTrips`
- **Update:** `update*`, e.g., `updateTrip`, `updateCard`
- **Delete:** `delete*` or `remove*`, e.g., `deleteTrip`, `removeCard`
- **Complex:** verb + noun, e.g., `duplicateTrip`, `moveCard`

---

## 🔧 Code Style

### TypeScript Best Practices

#### Always Use Types
```typescript
// ✅ Good
function formatDuration(minutes: number): string {
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
}

// ❌ Bad
function formatDuration(minutes) {
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
}
```

#### Use Type Inference When Obvious
```typescript
// ✅ Good
const trips = getAllTrips() // Type inferred as Trip[]

// ❌ Overly explicit
const trips: Trip[] = getAllTrips()
```

#### Interface vs Type
- Use `interface` for objects that may be extended
- Use `type` for unions, intersections, utilities

```typescript
// ✅ Good
interface Trip {
  id: string
  title: string
}

type CardType = 'activity' | 'meal' | 'restaurant' | 'transit'

// ❌ Bad
type Trip = {  // Could be interface
  id: string
  title: string
}
```

### React Best Practices

#### Client vs Server Components
- Default to Server Components (no 'use client')
- Add 'use client' only when needed (state, effects, event handlers)

```typescript
// Server Component (default)
export default function TripsPage() {
  return <TripGrid />
}

// Client Component (uses state)
'use client'
export function TripCard({ trip }: { trip: Trip }) {
  const [isHovered, setIsHovered] = useState(false)
  return <div onMouseEnter={() => setIsHovered(true)}>...</div>
}
```

#### Prop Destructuring
```typescript
// ✅ Good
function TripCard({ trip, onEdit, onDelete }: TripCardProps) {
  return <div>{trip.title}</div>
}

// ❌ Bad
function TripCard(props: TripCardProps) {
  return <div>{props.trip.title}</div>
}
```

#### Avoid Prop Drilling
Use Zustand store instead of passing props > 2 levels deep:
```typescript
// ✅ Good
function DeepComponent() {
  const currentTrip = useTripStore((state) => state.getCurrentTrip())
  return <div>{currentTrip?.title}</div>
}

// ❌ Bad
<Parent trip={trip}>
  <Child trip={trip}>
    <GrandChild trip={trip} />  // Prop drilling
  </Child>
</Parent>
```

### CSS Best Practices

#### Use Tailwind Utilities
```typescript
// ✅ Good
<div className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow-sm">

// ❌ Bad - custom CSS
<div className="custom-card">
// With custom CSS in separate file
```

#### Use cn() for Conditional Classes
```typescript
import { cn } from '@/lib/utils'

// ✅ Good
<div className={cn(
  'rounded-lg border p-4',
  isActive && 'bg-blue-50 border-blue-500',
  isError && 'bg-red-50 border-red-500'
)}>

// ❌ Bad - string concatenation
<div className={`rounded-lg border p-4 ${isActive ? 'bg-blue-50' : ''}`}>
```

---

## 🧪 Testing Patterns

### Component Testing (Future)
```typescript
import { render, screen } from '@testing-library/react'
import { TripCard } from '@/components/trips/TripCard'

test('displays trip title', () => {
  const trip = { id: '1', title: 'Rome Trip', /* ... */ }
  render(<TripCard trip={trip} />)
  expect(screen.getByText('Rome Trip')).toBeInTheDocument()
})
```

### Store Testing (Future)
```typescript
import { useTripStore } from '@/lib/store/tripStore'

test('adds trip to store', () => {
  const { addTrip, getAllTrips } = useTripStore.getState()
  const trip = { id: '1', title: 'Test Trip', /* ... */ }
  addTrip(trip)
  expect(getAllTrips()).toHaveLength(1)
  expect(getAllTrips()[0].title).toBe('Test Trip')
})
```

---

## 🚀 Performance Patterns

### Code Splitting
```typescript
// Lazy load heavy components
import dynamic from 'next/dynamic'

const CommandPalette = dynamic(() => import('@/components/command-palette/CommandPalette'), {
  ssr: false,
})
```

### Memoization
```typescript
import { useMemo } from 'react'

function TripBoard() {
  const currentTrip = useTripStore((state) => state.getCurrentTrip())
  
  // Memoize expensive calculations
  const totalCost = useMemo(() => {
    return currentTrip?.days.reduce((sum, day) =>
      sum + day.cards.reduce((daySum, card) =>
        daySum + (card.cost?.amount || 0), 0), 0)
  }, [currentTrip])
  
  return <div>Total: ${totalCost}</div>
}
```

### Debouncing
```typescript
import { useDebouncedCallback } from 'use-debounce'

function SearchInput() {
  const debouncedSearch = useDebouncedCallback(
    (query: string) => performSearch(query),
    500
  )
  
  return <input onChange={(e) => debouncedSearch(e.target.value)} />
}
```

---

## 🔒 Security Patterns

### Environment Variables
```typescript
// ✅ Good - server-side only
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY  // Never exposed to client
})

// ❌ Bad - exposed to client
const apiKey = process.env.NEXT_PUBLIC_API_KEY
```

### Input Validation
```typescript
// ✅ Always validate user input
const result = CardSchema.safeParse(userInput)
if (!result.success) {
  return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
}
```

---

## 📦 Import Organization

```typescript
// 1. External dependencies
import { useState } from 'react'
import { nanoid } from 'nanoid'

// 2. Internal absolute imports (@/)
import { useTripStore } from '@/lib/store/tripStore'
import { Card } from '@/lib/types'
import { CardSchema } from '@/lib/schemas'

// 3. Relative imports (same directory)
import { TripCard } from './TripCard'
import { formatDuration } from './utils'

// 4. CSS imports (last)
import './styles.css'
```

---

**This document is a living reference. Update it as patterns evolve.**

