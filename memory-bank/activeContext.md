# Active Context

**Last Updated:** November 11, 2025  
**Current Phase:** Phase 4.6 (Slingshot) Complete  
**Next Phase:** Phase 4.5 (Affiliate Link Integration)  
**Project Status:** 🟢 Production Ready with Cloud Sync + Slingshot AI

---

## 📍 Current State

### What Works Right Now
- ✅ **Multi-trip management** - Full CRUD operations for multiple trips
- ✅ **Trip board with drag & drop** - Horizontal days (desktop) / Vertical stack (mobile), cross-column moves
- ✅ **9 card types** - Activity, Meal, Restaurant, Transit, Flight, Hotel, Shopping, Entertainment, Note
- ✅ **Command palette (Cmd+K)** - 25+ templates with instant search
- ✅ **AI-powered discovery** - GPT-4o-mini generates 20 personalized suggestions
- ✅ **Vibes quiz** - 6-dimension travel preferences system
- ✅ **Things to Do drawer** - Unscheduled activities column
- ✅ **Undo/Redo** - Temporal state with zundo
- ✅ **Hybrid persistence** - localStorage (instant) + Supabase (cloud sync)
- ✅ **Responsive design** - Fully optimized for mobile, tablet, desktop
- ✅ **Mobile-first optimizations** - Automatic detection, 44px touch targets, vertical day stacking
- ✅ **User authentication** - Email/password, OAuth, magic links via Supabase Auth
- ✅ **Profile Management** - Enhanced user profile with preferences, security settings
- ✅ **Cloud sync** - Multi-device synchronization with Supabase
- ✅ **Data migration** - Automatic localStorage to Supabase migration
- ✅ **Slingshot AI Trip Generator** - Complete trip generation with AI (NEW)

### Key Routes
- `/` - Landing page with CTAs
- `/login` - User authentication (email/password)
- `/signup` - New user registration
- `/forgot-password` - Password reset flow
- `/reset-password` - Password reset confirmation
- `/trips` - Trips overview with grid layout (protected)
- `/trip/[id]` - Individual trip board (protected)
- `/demo` - Demo trip (Rome, 3 days)
- `/discover` - AI-powered suggestions page (protected)
- `/vibes` - Travel preferences quiz (protected)
- `/preferences` - User settings (detailed vibes configuration, protected)
- `/profile` - Enhanced profile management with security settings (protected)
- `/about` - About page
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/auth/callback` - OAuth callback handler

### Key API Routes
- `/api/slingshot-trip` - AI-powered multi-day trip generation (NEW)
- `/api/ai-suggestions` - Generate 20 personalized cards for a destination
- `/api/ai-day-plan` - Generate 5-8 cards for a single day
- `/api/ai-regenerate-card` - Regenerate a single card with AI
- `/api/ai-swap-card` - Swap a card for an alternative
- `/api/vibe-suggestions` - Get recommendations from user vibes
- `/auth/callback` - Supabase OAuth callback handler

---

## 🎯 What We're Working On

### Current Focus
**Phase 4.6: Slingshot AI Trip Generator Complete** ✅

Trailblazer now features a complete AI-powered trip generation workflow:
- One-click trip creation with comprehensive questionnaire
- Sequential AI day generation with context building
- Vibe-personalized suggestions throughout
- Logical trip flow (hotel check-in/out, balanced activities)
- No duplicate restaurants, realistic timing
- Fun loading experience with progress updates
- One-time vibe explanation overlay

**Next: Phase 4.5 - Affiliate Link Integration** (Planned)

Goal: Transform Trailblazer from a planning tool into a booking platform by integrating affiliate links for flights, hotels, experiences, and restaurants.

#### Priority Tasks
1. Create affiliate configuration system
2. Build link generators for Booking.com, Skyscanner, Viator
3. Add BookingActions component to CardDetailModal
4. Implement parameter extraction (dates, location, travelers)
5. Add basic click tracking
6. Create trip-level booking dashboard
7. Implement AI-powered booking suggestions
8. Add affiliate disclosure modal
9. Mobile optimization

#### Expected Outcomes
- Seamless booking experience with pre-filled details
- Revenue generation through affiliate commissions
- No extra cost to users
- Transparent about relationships

---

## 🔄 Recent Sessions

### Session: November 11, 2025
**Goal:** Complete Phase 4.6 - Slingshot AI Trip Generator  
**Completed:**
- Implemented complete Slingshot feature from trip creation choice to generated trip display
- Created comprehensive questionnaire with 8 fields (destination, dates, budget, travelers, purpose, must-dos, existing plans)
- Built sequential AI day generation system with context building (previous days inform next)
- Added vibe check integration (redirects to `/vibes` if not completed)
- Created 3 new components: `SlingshotQuestionnaire`, `SlingshotLoadingOverlay`, `SlingshotExplainOverlay`
- Enhanced `NewTripModal` with "Make my Own" vs "Slingshot" choice screen
- Built `/api/slingshot-trip` route with iterative OpenAI calls
- Added 20 funny loading messages that rotate every 2.5 seconds
- Created one-time dismissible vibe explanation overlay with localStorage tracking
- Extended Trip type with `isSlingshotGenerated` and `slingshotMetadata` fields
- Created new types in `lib/types/slingshot.ts`
- Added Slingshot-specific Zod schemas for validation
- Implemented `generateSlingshotTrip` action in tripStore
- Integrated with existing trip system (all cards editable after generation)
- Created comprehensive testing checklist in `SLINGSHOT_IMPLEMENTATION.md`

**Outcomes:**
- Users can now generate complete multi-day trips with one questionnaire
- AI creates 5-9 cards per day with realistic timing and logical flow
- No duplicate restaurants, balanced activity intensity
- Hotel check-in/out handled automatically
- Vibe-personalized suggestions throughout
- Smooth UX with progress feedback and fun loading messages
- No linter errors, full TypeScript type safety
- Production ready

### Session: November 1, 2025
**Goal:** Complete Phase 4.4 - Enhanced Profile Management  
**Completed:**
- Created 3 new profile components: `ProfileInformation`, `PreferencesSummary`, `SecuritySettings`
- Enhanced `/profile` page with modular component structure
- Integrated travel preferences display from tripStore
- Added password change functionality with current password verification
- Added email change with verification email flow
- Improved profile UI with better organization and visual hierarchy
- Added avatar display with initials fallback
- Connected profile to userVibes for preferences summary

**Outcomes:**
- Complete profile management system with 4 major sections
- Users can view and manage all account settings in one place
- Security settings allow password and email changes
- Travel preferences integrated and displayed with quick edit link
- No linter errors, clean TypeScript
- Production ready

### Session: October 6, 2025 AM
**Goal:** Complete Phase 4.3 - Trips Overview Page  
**Completed:**
- Created 7 new components in `components/trips/`
- Added dynamic route `/trip/[id]`
- Updated store with `duplicateTrip()` and `getAllTrips()`
- Implemented full trip management UI
- Tested all CRUD operations

**Outcomes:**
- Trailblazer is now a multi-trip application
- Clean navigation between trips list and boards
- No linter errors, no TypeScript errors
- Production ready

### Session: October 5, 2025 PM
**Goal:** Complete Phase 4.2 - Vibe Planner  
**Completed:**
- Built AI-powered Discover page
- Created SuggestionCard type with 20 fields
- Integrated OpenAI GPT-4o-mini API
- Added multi-select and bulk actions
- Implemented category filtering

**Outcomes:**
- Users can generate 20 personalized suggestions in 6-8 seconds
- Suggestions respect vibes preferences
- Seamless integration with trip board

---

## 📝 Quick Notes

### Important Conventions
- All IDs use `nanoid()`
- Times stored as ISO strings
- LocalStorage key: `trailblazer-store`
- Auto-save debounce: 500ms
- Modal state pattern: `const [editingTrip, setEditingTrip] = useState<Trip | null>(null)`

### File Locations
- **Types:** `lib/types/index.ts`, `lib/types/vibes.ts`, `lib/types/suggestions.ts`
- **Store:** `lib/store/tripStore.ts`
- **Services:** `lib/services/` (trips, cards, days, preferences)
- **Supabase:** `lib/supabase/` (client, server, middleware, database.sql)
- **Mobile:** `lib/hooks/useIsMobile.ts`, `lib/utils/mobile.ts` (NEW - mobile detection)
- **Constants:** `lib/constants.ts`
- **Templates:** `lib/templates.ts`
- **Seed data:** `lib/seed-data.ts`
- **Board:** `components/board/Board.tsx` (vertical stacking on mobile)
- **Cards:** `components/cards/` (touch-friendly actions)
- **Trips:** `components/trips/`
- **Vibes:** `components/vibes/`
- **Profile:** `components/profile/` (ProfileInformation, PreferencesSummary, SecuritySettings)
- **Migration:** `components/migration/MigrationDialog.tsx`
- **Auth Pages:** `app/login/`, `app/signup/`, `app/forgot-password/`, `app/reset-password/`
- **Middleware:** `middleware.ts` (route protection)

### API Routes
- `/api/ai-day-plan` - Generate full day plan
- `/api/ai-regenerate-card` - Regenerate single card
- `/api/ai-suggestions` - Get AI card suggestions
- `/api/ai-swap-card` - Swap card with AI alternative
- `/api/vibe-suggestions` - Get personalized travel suggestions
- `/auth/callback` - OAuth callback handler

### Environment Variables
- `OPENAI_API_KEY` - Required for AI features
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)
- Set in `.env.local` (not committed)

---

## 🐛 Known Issues

**Recently Fixed (Nov 12, 2025):**
- ✅ OpenAI API beta namespace error: Fixed by removing deprecated `.beta` from `openai.beta.chat.completions.parse()` → `openai.chat.completions.parse()`
- ✅ Modal Cancel button alignment: Fixed to center-align in `NewTripModal.tsx` choice screen
- ✅ Removed Export JSON and Share buttons: Cleaned up TripNavbar by removing unused functionality
- ✅ AI generation errors: Fixed "Cannot read properties of undefined (reading 'completions')" error across all AI features
- ✅ Discover page AI generation: Now working properly with correct SDK API usage
- ✅ Slingshot trip generation: Now working with stable OpenAI SDK API

**Previously Fixed (Nov 11, 2025):**
- ✅ Slingshot timestamp error: Fixed by adding proper time-to-timestamp conversion in `trips-service.ts`
- ✅ Favicon 404 errors: Fixed by updating layout.tsx to use existing tripper.png
- ✅ Vibes check showing unnecessarily: Fixed by loading preferences first before checking vibes in `SlingshotQuestionnaire`

**Current:**
- ⚠️ share-modal.js error: Caused by browser extension, not the app (safe to ignore)

---

## 💡 Things to Remember

### When Adding New Features
1. Update types in `lib/types/index.ts`
2. Update schemas in `lib/schemas/index.ts`
3. Add constants to `lib/constants.ts` if needed
4. Add service methods in `lib/services/` if data access needed
5. Update store actions in `lib/store/tripStore.ts`
6. Create components in appropriate subdirectory
7. Test Supabase persistence (+ localStorage fallback)
8. Update database schema in `lib/supabase/database.sql` if needed
9. Verify responsive design
10. Check for linter errors
11. Test with authenticated and unauthenticated states

### When Working with AI
- Use GPT-4o-mini for suggestions (cheap, fast)
- Schema anchoring in system prompt
- Salvage validation (accept 10-20 valid)
- Temperature: 0.7 for creativity
- Max tokens: 4000 for complex outputs

### When Working with Store
- Use Immer for immutable updates
- Enable temporal middleware for undo/redo
- Debounce localStorage writes (500ms)
- Sync to Supabase after state changes (via services)
- Clear sensitive data on logout
- Handle optimistic updates with rollback on failure

---

## 🚀 Next Steps

### Immediate (This Week)
1. ✅ **COMPLETED:** Mobile optimization across all pages
2. Test mobile experience on actual iPhone 15 (393px width)
3. Review Phase 4.5 plan in `PHASE4.5_PLAN.md`
4. Set up affiliate partner accounts (Booking.com, Skyscanner, etc.)
5. Create affiliate configuration system
6. Build link generators for top 3 partners

### Short Term (This Month)
1. Commit and push Phase 4.4 changes (git behind by 18 commits)
2. Merge dev branch changes
3. Complete Phase 4.5A: Core Foundation (3-4 hours)
4. Complete Phase 4.5B: Enhanced UX (2-3 hours)
5. Complete Phase 4.5C: Trust & Settings (1-2 hours)
6. User testing with real bookings
7. Document revenue metrics

### Long Term (Next Quarter)
1. Phase 5: Price comparison APIs
2. Phase 6: Booking management (email import, calendar sync)
3. Phase 7: Smart recommendations (AI suggests best platforms)
4. v1.5: Real-time collaboration (Yjs) - Supabase Realtime
5. v2.0: Mobile native apps (React Native)

---

## 🎓 Learning & Insights

### What Went Well
- **dnd-kit** is fantastic for drag & drop
- **Zustand + Immer** is perfect for React state
- **Zod** catches errors early with schema validation
- **shadcn/ui** speeds up UI development dramatically
- **Command palette** makes power users incredibly productive
- **AI integration** is surprisingly reliable with good prompts

### What Could Be Better
- Need better error messages for AI failures
- Could optimize bundle size (currently ~300KB)
- ✅ **FIXED:** Mobile touch targets now 44px+ (Apple HIG standard)
- Need to add loading skeletons for perceived performance
- Could add more keyboard shortcuts
- Could add swipe gestures for mobile navigation

### Technical Debt
- **None currently** - Code is clean and well-structured
- Consider code splitting for AI features (future optimization)
- Git status behind origin/dev by 18 commits - need to sync
- Many uncommitted changes - need to commit Phase 4.4

---

## 📞 Getting Help

### If Something Breaks
1. Check browser console for errors
2. Verify `.env.local` has `OPENAI_API_KEY`
3. Clear localStorage: `localStorage.clear()`
4. Hard refresh: Ctrl+Shift+R
5. Check `package.json` dependencies

### Documentation References
- `README.md` - Quick start and features
- `PHASE*.md` - Detailed phase completion docs
- `TESTING_GUIDE.md` - Test scenarios
- `OPENAI_SETUP.md` - API setup instructions

---

**Remember:** Trailblazer is an offline-first, keyboard-driven, AI-powered trip planner. Keep it fast, keep it simple, keep it delightful.

