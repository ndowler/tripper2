# Tech Stack

**Project:** Tripper  
**Last Updated:** October 6, 2025

---

## 🏗 Architecture Stack

### Core Framework
**Next.js 15** (App Router)
- **Why:** Server-side rendering, great routing, Vercel deployment, React Server Components
- **Version:** ^15.0.0
- **Features Used:**
  - App Router for file-based routing
  - Dynamic routes (`/trip/[id]`)
  - API routes (`/api/*`)
  - Server and Client Components
  - Automatic code splitting
- **Alternatives Considered:**
  - Vite + React Router (too much setup)
  - Remix (less mature ecosystem)
  - Create React App (deprecated)

### Programming Language
**TypeScript 5**
- **Why:** Type safety, better DX, catch errors early, excellent tooling
- **Version:** ^5.4.2
- **Features Used:**
  - Strict mode enabled
  - Type inference
  - Zod schema integration
  - Utility types (Partial, Omit, Pick)
- **Configuration:** `tsconfig.json`
  ```json
  {
    "compilerOptions": {
      "strict": true,
      "esModuleInterop": true,
      "skipLibCheck": true,
      "jsx": "preserve",
      "paths": { "@/*": ["./*"] }
    }
  }
  ```

---

## 🎨 Frontend Stack

### UI Framework
**React 18**
- **Why:** Component-based, large ecosystem, excellent performance
- **Version:** ^18.3.1
- **Patterns Used:**
  - Functional components
  - Hooks (useState, useEffect, useMemo, useCallback)
  - Context API (minimal usage)
  - Server Components (Next.js 15)
  - Client Components ('use client')

### Styling
**Tailwind CSS 3**
- **Why:** Utility-first, fast iteration, consistent design, small bundle
- **Version:** ^3.4.1
- **Plugins:**
  - `tailwindcss-animate` - Animation utilities
  - `autoprefixer` - CSS vendor prefixes
- **Configuration:** `tailwind.config.ts`
  ```typescript
  export default {
    darkMode: 'class',
    content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
    theme: {
      extend: {
        colors: { /* custom colors */ },
        animation: { /* custom animations */ },
      },
    },
  }
  ```
- **Helper:** `lib/utils.ts` exports `cn()` for conditional classes
- **Alternatives Considered:**
  - Styled Components (runtime overhead)
  - CSS Modules (too verbose)
  - Emotion (unnecessary complexity)

### UI Components
**shadcn/ui**
- **Why:** Beautiful, accessible, customizable, copy-paste (not a dependency)
- **Components Used:**
  - Button, Input, Textarea
  - Dialog, Dropdown Menu
  - Card, Badge
  - Checkbox
  - Toaster (Sonner)
- **Radix UI Primitives:**
  - `@radix-ui/react-dialog` ^1.1.15
  - `@radix-ui/react-dropdown-menu` ^2.1.16
  - `@radix-ui/react-checkbox` ^1.3.3
- **Installation:** `npx shadcn-ui@latest add <component>`
- **Configuration:** `components.json`

### Icons
**Lucide React**
- **Why:** Beautiful icons, tree-shakeable, consistent design
- **Version:** ^0.344.0
- **Usage:**
  ```typescript
  import { PlusCircle, Calendar, MapPin } from 'lucide-react'
  <PlusCircle className="h-4 w-4" />
  ```
- **Icons Used:** 50+ icons across components
- **Alternatives Considered:**
  - React Icons (too large)
  - Heroicons (limited selection)

---

## 📊 State Management

### Global State
**Zustand 4**
- **Why:** Lightweight (1KB), simple API, great TypeScript support, no boilerplate
- **Version:** ^4.5.2
- **Features Used:**
  - Create stores with `create()`
  - Immer middleware for immutable updates
  - Persist middleware for localStorage
  - Temporal middleware (zundo) for undo/redo
  - Selector pattern for performance
- **Usage:**
  ```typescript
  export const useTripStore = create<TripStore>()(
    temporal(
      persist(
        (set, get) => ({ /* state and actions */ }),
        { name: 'tripper-store' }
      ),
      { limit: 50 }
    )
  )
  ```
- **Alternatives Considered:**
  - Redux Toolkit (too much boilerplate)
  - Jotai (less mature)
  - Context API (performance issues)

### Immutable Updates
**Immer 10**
- **Why:** Simplifies immutable state updates, great with Zustand
- **Version:** ^10.1.1
- **Usage:**
  ```typescript
  import { produce } from 'immer'
  
  updateCard: (id, updates) => set(produce((state) => {
    const card = findCard(state, id)
    Object.assign(card, updates)
  }))
  ```

### Undo/Redo
**Zundo 2**
- **Why:** Temporal middleware for Zustand, easy undo/redo
- **Version:** ^2.1.0
- **Features:**
  - 50-step history
  - Pause/resume tracking
  - Time travel debugging
- **Usage:**
  ```typescript
  const useTemporalStore = useTripStore.temporal
  const { undo, redo, clear } = useTemporalStore.getState()
  ```

### Persistence
**localStorage** (via Zustand middleware)
- **Why:** Offline-first, zero latency, no server needed
- **Key:** `tripper-store`
- **Debounce:** 500ms (prevents excessive writes)
- **Partialize:** Only persist `trips`, `currentTripId`, `viewPrefs`, `userVibes`
- **Future:** Migrate to IndexedDB for larger datasets

---

## 🧩 Data Validation

### Schema Validation
**Zod 3**
- **Why:** TypeScript-first, runtime validation, type inference
- **Version:** ^3.23.8
- **Features Used:**
  - Schema definition
  - Type inference with `z.infer<>`
  - `safeParse()` for error handling
  - Transform and refine methods
- **Schemas:**
  - `lib/schemas/index.ts` - Card, Trip, Day
  - `lib/schemas/suggestions.ts` - SuggestionCard
  - `lib/schemas/vibes.ts` - UserVibes
- **Usage:**
  ```typescript
  const CardSchema = z.object({
    id: z.string(),
    type: z.enum(['activity', 'meal', 'restaurant', /* ... */]),
    title: z.string().min(1),
    /* ... */
  })
  
  export type Card = z.infer<typeof CardSchema>
  ```
- **Alternatives Considered:**
  - Yup (less TypeScript integration)
  - Joi (Node.js focused)
  - io-ts (too complex)

---

## 🎯 Drag & Drop

### Library
**dnd-kit**
- **Why:** Modern, accessible, mobile-friendly, TypeScript support
- **Packages:**
  - `@dnd-kit/core` ^6.1.0 - Core functionality
  - `@dnd-kit/sortable` ^8.0.0 - Sortable lists
  - `@dnd-kit/utilities` ^3.2.2 - Helper utilities
- **Features Used:**
  - DndContext for drag & drop container
  - useSortable hook for sortable items
  - SortableContext for sortable lists
  - Sensors (PointerSensor, KeyboardSensor)
  - DragOverlay for visual feedback
  - Collision detection (closestCorners)
- **Configuration:**
  ```typescript
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }  // Prevents accidental drags
    }),
    useSensor(KeyboardSensor)  // Accessibility
  )
  ```
- **Alternatives Considered:**
  - react-beautiful-dnd (not maintained)
  - react-dnd (complex API)

---

## 🤖 AI Integration

### LLM Provider
**OpenAI** (GPT-4o-mini)
- **Why:** Reliable, fast, cheap, good quality, structured outputs
- **Package:** `openai` ^6.1.0
- **Model:** `gpt-4o-mini`
- **Use Cases:**
  - AI-powered discovery (20 suggestions)
  - AI day planner (full day itinerary)
  - AI card regeneration (single card)
  - AI suggestions (quick ideas)
- **Configuration:**
  ```typescript
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  })
  ```
- **Prompt Engineering:**
  - Schema anchoring in system prompt
  - Explicit rules for diversity
  - Request confidence scores and reasoning
  - Structured JSON output
  - Salvage validation (accept 10-20 valid)
- **Alternatives Considered:**
  - Claude (Anthropic) - More expensive
  - GPT-4 - Slower, more expensive
  - GPT-3.5-turbo - Lower quality

---

## 🛠 Utilities

### Date Handling
**date-fns 3**
- **Why:** Lightweight, tree-shakeable, functional, immutable
- **Version:** ^3.6.0
- **Functions Used:**
  - `format()` - Format dates
  - `differenceInMinutes()` - Calculate duration
  - `parseISO()` - Parse ISO strings
  - `addDays()` - Date arithmetic
- **Usage:**
  ```typescript
  import { format, differenceInMinutes } from 'date-fns'
  
  const duration = differenceInMinutes(endTime, startTime)
  const formatted = format(date, 'MMM d, yyyy')
  ```
- **Alternatives Considered:**
  - Moment.js (large, mutable, deprecated)
  - Day.js (similar, but date-fns is more functional)
  - Luxon (heavier)

### Unique IDs
**nanoid 5**
- **Why:** Tiny (130 bytes), fast, secure, URL-safe
- **Version:** ^5.0.6
- **Usage:**
  ```typescript
  import { nanoid } from 'nanoid'
  
  const id = nanoid()  // => "V1StGXR8_Z5jdHi6B-myT"
  ```
- **ID Length:** 21 characters (default)
- **Collision Probability:** ~1 in 1 quadrillion (with 1K IDs/hour)
- **Alternatives Considered:**
  - UUID - Longer, less URL-friendly
  - ULID - Sortable, but not needed
  - shortid - Deprecated

### Class Names
**clsx + tailwind-merge**
- **clsx** ^2.1.0 - Conditional class names
- **tailwind-merge** ^2.2.1 - Merge Tailwind classes
- **Why:** Resolve conflicting Tailwind classes, clean API
- **Usage:**
  ```typescript
  import { cn } from '@/lib/utils'
  
  <div className={cn(
    'rounded-lg border p-4',
    isActive && 'bg-blue-50',
    className
  )} />
  ```

### Class Variance Authority
**cva** ^0.7.0
- **Why:** Type-safe component variants
- **Usage:**
  ```typescript
  import { cva } from 'class-variance-authority'
  
  const button = cva('rounded px-4 py-2', {
    variants: {
      variant: {
        primary: 'bg-blue-500 text-white',
        secondary: 'bg-gray-200 text-gray-900',
      },
      size: {
        sm: 'text-sm',
        lg: 'text-lg',
      },
    },
  })
  ```

---

## 🎨 Theming

### Dark Mode
**next-themes 0.2**
- **Why:** Automatic theme detection, localStorage persistence
- **Version:** ^0.2.1
- **Features:**
  - System preference detection
  - Manual toggle
  - No flash on load
  - localStorage persistence
- **Usage:**
  ```typescript
  import { ThemeProvider } from 'next-themes'
  
  <ThemeProvider attribute="class" defaultTheme="system">
    {children}
  </ThemeProvider>
  ```
- **Status:** Installed but not fully implemented (future)

---

## 🎉 Notifications

### Toast Notifications
**Sonner**
- **Why:** Beautiful toasts, simple API, accessible
- **Version:** ^2.0.7
- **Usage:**
  ```typescript
  import { toast } from 'sonner'
  
  toast.success('Trip created!')
  toast.error('Failed to save', {
    description: 'Please try again',
    action: { label: 'Retry', onClick: () => retry() },
  })
  ```
- **Features:**
  - Promise toasts
  - Action buttons
  - Position control
  - Custom styling
  - Keyboard dismissal

---

## 🧪 Testing (Planned)

### Unit Testing
**Vitest**
- **Why:** Fast, Vite-powered, Jest-compatible API
- **Version:** ^1.3.1
- **Status:** Installed, not yet configured
- **Configuration:** `vitest.config.ts`

### Component Testing
**React Testing Library**
- **Package:** `@testing-library/react` ^14.2.1
- **Why:** Test user behavior, not implementation details
- **Status:** Installed, not yet configured

### E2E Testing
**Playwright**
- **Version:** ^1.42.0
- **Why:** Fast, reliable, multi-browser, excellent dev tools
- **Status:** Installed, not yet configured
- **Configuration:** `playwright.config.ts`

---

## 📦 Build Tools

### Bundler
**Next.js built-in** (Turbopack)
- **Why:** Fast, optimized, zero-config
- **Features:**
  - Automatic code splitting
  - Tree shaking
  - Image optimization
  - Font optimization
  - Route-based chunking

### PostCSS
**PostCSS 8**
- **Version:** ^8.4.35
- **Plugins:**
  - `tailwindcss` - Process Tailwind directives
  - `autoprefixer` - Add vendor prefixes
- **Configuration:** `postcss.config.js`

### Linting
**ESLint 8**
- **Version:** ^8.57.0
- **Configs:**
  - `eslint-config-next` - Next.js recommended rules
  - `@typescript-eslint/eslint-plugin` - TypeScript rules
  - `@typescript-eslint/parser` - TypeScript parser
- **Configuration:** `.eslintrc.json`
- **Scripts:**
  ```json
  "lint": "next lint"
  ```

---

## 🚀 Deployment

### Hosting
**Vercel** (Recommended)
- **Why:** Built by Next.js creators, automatic deployments, edge network
- **Features:**
  - Git integration
  - Preview deployments
  - Edge Functions
  - Analytics
  - Zero config

### Alternative: Self-Hosted
- **Node.js 20+**
- **Scripts:**
  ```json
  "build": "next build",
  "start": "next start"
  ```
- **Dockerfile:** (future)

---

## 🔮 Future Stack (Planned)

### Cloud Sync (v1.0)
**Supabase**
- **Why:** Open source, PostgreSQL, real-time, authentication, RLS
- **Features:**
  - PostgreSQL database
  - Real-time subscriptions
  - Row-level security
  - User authentication
  - Storage for files
  - Edge Functions

### Real-Time Collaboration (v1.5)
**Yjs**
- **Why:** CRDT-based, conflict-free, peer-to-peer
- **Features:**
  - Operational transformation
  - Undo/redo
  - Cursors and presence
  - Offline support

### Maps (v2.0)
**Google Maps API**
- **Why:** Best-in-class maps, routing, geocoding
- **Features:**
  - Display activities on map
  - Route optimization
  - Travel time estimates
  - Street View

### Analytics
**Vercel Analytics** + **Plausible**
- **Why:** Privacy-friendly, lightweight, GDPR-compliant
- **Metrics:**
  - Page views
  - User flows
  - Feature usage
  - Performance metrics

---

## 📊 Bundle Size

### Current
- **Total:** ~350KB gzipped
- **React + Next.js:** ~100KB
- **Zustand + middlewares:** ~5KB
- **dnd-kit:** ~30KB
- **OpenAI SDK:** ~50KB
- **Tailwind CSS:** ~10KB (purged)
- **Other dependencies:** ~155KB

### Optimization Opportunities
- Code splitting for AI features
- Dynamic imports for heavy components
- Lazy load command palette
- Image optimization (future)
- Font optimization (future)

---

## 🔑 Environment Variables

### Required
```env
OPENAI_API_KEY=sk-...  # OpenAI API key for AI features
```

### Optional (Future)
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
GOOGLE_MAPS_API_KEY=...
BOOKING_COM_AFFILIATE_ID=...
SKYSCANNER_AFFILIATE_ID=...
```

### Configuration
- File: `.env.local` (gitignored)
- Access: `process.env.VARIABLE_NAME` (server-side)
- Access: `process.env.NEXT_PUBLIC_VARIABLE_NAME` (client-side)

---

## 📚 Documentation

### In-Code
- **TSDoc comments** for complex functions
- **Type definitions** in `lib/types/`
- **Schemas** in `lib/schemas/`

### External
- **README.md** - Quick start, features
- **PHASE*.md** - Detailed phase completion docs
- **TESTING_GUIDE.md** - Test scenarios
- **memory-bank/** - Project memory bank
  - `activeContext.md` - Current state
  - `productContext.md` - Product vision
  - `systemPatterns.md` - Architecture
  - `progress.md` - Roadmap
  - `techStack.md` - This file

---

## 🎯 Technology Principles

### 1. **Offline-First**
All features work without internet. Cloud sync is additive, not required.

### 2. **Type Safety**
100% TypeScript with strict mode. Runtime validation with Zod.

### 3. **Performance**
< 100ms interactions, 60fps animations, zero layout shift.

### 4. **Developer Experience**
Fast builds, hot reload, clear errors, excellent tooling.

### 5. **User Experience**
Keyboard-first, accessible, responsive, delightful interactions.

### 6. **Maintainability**
Clean code, clear patterns, comprehensive docs, zero tech debt.

### 7. **Modern Stack**
Use latest stable versions, embrace new patterns (RSC, App Router).

---

**This stack is optimized for speed, simplicity, and scalability. Every technology choice is intentional.**

