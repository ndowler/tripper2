# Product Context

**Product Name:** Trailblazer  
**Tagline:** "Lightning-fast, offline-first trip planning. Think Trello meets Linear for travel."  
**Version:** 0.1.6 (Phase 4.6 Complete - Slingshot)  
**License:** MIT

---

## 🎯 Product Vision

### The Problem
Existing trip planners are:
- **Too slow** - Cloud-dependent, laggy interfaces
- **Too complex** - Feature bloat, overwhelming UI
- **Not flexible** - Rigid templates, can't customize
- **Desktop-only** - Poor mobile experience
- **Expensive** - $50+ per trip or subscription required

### The Solution
Trailblazer is a **keyboard-first, offline-first trip planner** that feels like using Linear or Notion:
- ⚡ **Instant** - No loading spinners, 60fps animations
- 🎯 **Focused** - Only what you need, nothing more
- 🎨 **Flexible** - Build your itinerary your way
- 📱 **Mobile-ready** - Responsive design, touch-optimized
- 🆓 **Free** - No paywalls, no subscriptions

### Target Users

**Primary: Power Users**
- Developers, designers, product managers
- Love keyboard shortcuts (Cmd+K, Cmd+Z)
- Use Linear, Notion, Raycast daily
- Plan 2-5 trips per year
- Value speed and efficiency

**Secondary: Casual Travelers**
- Planning first big international trip
- Want structure without complexity
- Need help with ideas and suggestions
- Mobile-first users
- Plan 1-2 trips per year

**Tertiary: Travel Bloggers**
- Create itineraries for followers
- Need beautiful, shareable layouts
- Want to monetize (affiliate links)
- Plan 10+ trips per year

---

## ✨ Core Features

### 1. Trip Management
**Status:** ✅ Complete (Phase 4.3)

**Features:**
- Create unlimited trips
- View all trips in grid layout
- Edit trip metadata (title, description, destination)
- Duplicate entire trips with one click
- Delete trips with confirmation
- Dynamic routing `/trip/[id]`

**User Flow:**
```
Home → View My Trips → Trips List
  → Click Trip → Trip Board
  → Back Arrow → Trips List
```

### 2. Trip Board
**Status:** ✅ Complete (Phase 2)

**Features:**
- Horizontal scrolling day columns
- Add/edit/delete days
- Drag days to reorder
- Things to Do drawer (unscheduled activities)
- Visual time indicators
- Auto-save to localStorage

**User Flow:**
```
Board → Add Day (+ button)
  → Day appears at end
  → Drag day header to reorder
  → Edit day name/date inline
```

### 3. Cards System
**Status:** ✅ Complete (Phase 3)

**9 Card Types:**
1. 🎯 **Activity** - Museums, tours, attractions
2. 🍽️ **Meal** - General meals
3. 🍴 **Restaurant** - Specific reservations
4. 🚗 **Transit** - General transportation
5. ✈️ **Flight** - Flight bookings
6. 🏨 **Hotel** - Accommodation check-in/out
7. 🛍️ **Shopping** - Markets, boutiques
8. 🎭 **Entertainment** - Shows, concerts, nightlife
9. 📝 **Note** - Reminders, packing lists

**Card Fields:**
- Title (required)
- Start/end time (optional)
- Duration (auto-calculated)
- Location (name + address)
- Cost (amount + currency)
- Status (todo, tentative, confirmed)
- Tags (multi-select)
- Links (multiple URLs)
- Notes (rich text)

**User Flow:**
```
Board → Click + in day column
  → Select card type (9 options)
  → Fill minimal info (title + time)
  → Card appears in day
  → Drag to reorder or move days
  → Click card → Edit full details
```

### 4. Drag & Drop
**Status:** ✅ Complete (Phase 2)

**Features:**
- Drag cards vertically within day
- Drag cards horizontally between days
- Drag days to reorder timeline
- 5px activation constraint (prevents accidents)
- Smooth animations with drag overlay
- Keyboard navigation (arrow keys)
- Touch support for mobile

**User Flow:**
```
Grab card → Drag up/down → Drop to reorder
Grab card → Drag left/right → Drop in different day
Grab day header grip → Drag left/right → Drop to reorder
```

### 5. Command Palette
**Status:** ✅ Complete (Phase 3)

**Features:**
- Press `Cmd+K` (or `Ctrl+K`)
- Search 25+ templates instantly
- Filter by card type
- Keyboard navigation (↑↓, Enter, Esc, Tab)
- Two views: Templates & AI Suggestions
- Adds to "Things to Do" by default

**Templates (25+):**
- Activities: Museum, Landmark, Tour, Hiking
- Food: Dinner, Lunch, Breakfast, Coffee
- Accommodation: Check-in, Check-out
- Transportation: Flight, Train, Transfer
- Entertainment: Show, Concert, Nightlife
- Other: Shopping, Note

**User Flow:**
```
Cmd+K → Type "museum"
  → Arrow down to select
  → Enter to add
  → Card appears in Things to Do
  → Drag to any day
```

### 6. AI-Powered Discovery
**Status:** ✅ Complete (Phase 4.2)

**Features:**
- Generate 20 personalized suggestions in 6-8 seconds
- Respects travel vibes preferences
- Diverse categories (food, culture, nature, shopping, etc.)
- Confidence scores with reasoning
- Multi-select and bulk save
- Category filtering
- Detail modal with full information
- Converts suggestions to trip cards

**User Flow:**
```
Board → Click "Discover" button
  → Enter destination (e.g., "Rome")
  → Click "Generate Suggestions"
  → Wait 6-8 seconds
  → Browse 20 suggestions
  → Filter by category
  → Select multiple cards
  → Click "Save to Trip"
  → Cards appear in Things to Do
```

### 7. Vibes Quiz
**Status:** ✅ Complete (Phase 4.1)

**6 Preference Dimensions:**
1. **Pace** - Relaxed ↔ Action-packed (1-5)
2. **Budget** - Budget ↔ Luxury (1-5)
3. **Themes** - Culture, nature, food, nightlife, adventure, shopping
4. **Crowds** - Love crowds ↔ Avoid crowds (1-5)
5. **Daypart** - Early bird ↔ Night owl (1-5)
6. **Dietary** - Restrictions/preferences

**Features:**
- Beautiful UI with emoji pickers
- Slider inputs for scales
- Multi-select for themes
- Saves to localStorage
- Used by AI discovery
- Optional (works without vibes)

**User Flow:**
```
Vibes Page → Complete quiz
  → Save preferences
  → Go to Discover
  → Generate suggestions
  → See personalized results
```

### 8. Undo/Redo
**Status:** ✅ Complete (Phase 3)

**Features:**
- Undo with `Cmd+Z` (or `Ctrl+Z`)
- Redo with `Cmd+Shift+Z`
- Visual undo/redo buttons in toolbar
- Temporal state with zundo middleware
- Works for: cards, days, drag, delete, edit
- 50-step history

**User Flow:**
```
Delete card by accident
  → Press Cmd+Z
  → Card restored
```

### 9. User Authentication
**Status:** ✅ Complete (Phase 4.4)

**Features:**
- Email/password authentication
- OAuth providers (Google, GitHub, etc.)
- Magic link login
- Password reset flow
- Email verification
- Session management
- Protected routes with middleware
- Automatic session refresh

**User Flow:**
```
Visit /trips
  → Redirected to /login if not authenticated
  → Enter email and password
  → Login successful
  → Redirected back to /trips
```

### 10. Cloud Synchronization
**Status:** ✅ Complete (Phase 4.4)

**Features:**
- Multi-device sync via Supabase
- Hybrid persistence (localStorage + cloud)
- Instant local updates
- Background cloud sync
- Automatic conflict resolution
- Data migration from localStorage
- Works offline, syncs when online

**User Flow:**
```
Edit trip on laptop
  → Changes sync to cloud
  → Open app on phone
  → See latest changes instantly
```

### 11. Profile Management
**Status:** ✅ Complete (Phase 4.4)

**Features:**
- Profile information (name, email, avatar)
- Travel preferences summary
- Security settings (password, email change)
- Account actions (logout)
- Delete account with confirmation
- Integrated with vibes system

**User Flow:**
```
Navigate to /profile
  → See profile information
  → View travel preferences
  → Change password if needed
  → Log out
```

### 12. Slingshot AI Trip Generator
**Status:** ✅ Complete (Phase 4.6)

**Features:**
- AI-powered complete trip generation
- Comprehensive questionnaire (destination, dates, budget, travelers, purpose)
- Vibes integration for personalization
- Sequential day generation with context building
- Avoids duplicate restaurants and locations
- Balances activity intensity across days
- Includes logical trip flow (check-in/check-out, transit)
- 20 funny loading messages while generating
- Vibe explanation overlay on first visit
- Honors must-dos and existing plans

**Questionnaire Fields:**
- Destination (required)
- Start and end dates (required)
- Budget level (budget/moderate/comfortable/luxury)
- Number of travelers (1-20)
- Trip purpose (honeymoon, family vacation, solo adventure, business+leisure, friend getaway, other)
- Must-do activities (optional)
- Existing plans/reservations (optional)

**User Flow:**
```
Navigate to /trips
  → Click "Create New Trip"
  → Choose "Slingshot" option
  → Complete vibes quiz if not done (redirects to /vibes)
  → Fill in questionnaire
  → Click "Generate Trip"
  → Watch progress bar (30-60 seconds)
  → See funny loading messages rotate
  → Navigate to fully populated trip
  → Read vibe explanation overlay (one-time)
  → Dismiss and start using trip
```

**Generated Trip Structure:**
- Multiple days based on dates (1-30 days)
- 5-9 cards per day with realistic timing
- Hotel check-in on Day 1, check-out on last day
- No duplicate restaurants across days
- Balanced activity pacing
- All cards editable after generation

---

## 🎨 User Flows

### Flow 1: First-Time User Creating a Trip
```
1. Land on homepage (/)
2. Click "View My Trips"
3. See empty state with "Create Your First Trip"
4. Click CTA → Modal opens
5. Fill in: "Tokyo Trip", "March 2026", "Tokyo, Japan"
6. Click "Create Trip"
7. Navigate to empty board with Day 1 created
8. Click + to add first card (or press Cmd+K)
9. Select "Flight Departure" template
10. Fill in flight details
11. Card appears in day column
12. Add more cards, drag to organize
13. Complete itinerary
```

### Flow 2: Power User with Command Palette
```
1. Open existing trip board
2. Press Cmd+K
3. Type "rest" → "Restaurant Reservation" filters in
4. Press Enter → Card added to Things to Do
5. Press Cmd+K again
6. Type "land" → "Landmark Visit" filters in
7. Press Enter
8. Close palette with Esc
9. Drag both cards to Day 2
10. Click cards to edit times and details
11. Press Cmd+Z to undo mistake
```

### Flow 3: AI-Assisted Planning
```
1. Create new trip for "Paris"
2. Navigate to Vibes quiz (/vibes)
3. Set preferences: Pace=4, Budget=3, Themes=[culture, food]
4. Save vibes
5. Go to Discover (/discover)
6. Enter "Paris" and dates
7. Click "Generate Suggestions"
8. Wait 7 seconds → 20 suggestions appear
9. Filter to "Culture" category (8 results)
10. Select 3 favorites (multi-select)
11. Click "Save to Trip"
12. Navigate back to board
13. See 3 cards in Things to Do
14. Drag to appropriate days
15. Edit times and details
```

### Flow 4: Duplicating and Editing Trips
```
1. Navigate to /trips
2. See list of all trips
3. Hover over "Rome Itinerary"
4. Click ⋮ menu
5. Click "Duplicate Trip"
6. New trip "Rome Itinerary (copy)" appears
7. Click ⋮ menu on copy
8. Click "Edit Details"
9. Change title to "Rome 2026"
10. Update dates
11. Save changes
12. Open trip → Edit cards for new trip
```

### Flow 5: Slingshot AI Trip Generation
```
1. Navigate to /trips
2. Click "Create New Trip"
3. See choice: "Make my Own" vs "Slingshot"
4. Click "Slingshot"
5. If no vibes: redirected to /vibes quiz
6. Complete vibes quiz (2 minutes)
7. Return to Slingshot questionnaire
8. Fill in form:
   - Destination: "Tokyo, Japan"
   - Dates: Next month, 5 days
   - Budget: Moderate
   - Travelers: 2
   - Purpose: Friend Getaway
   - Must-dos: "Visit TeamLab, try authentic ramen"
   - Existing: "Dinner reservation Day 2 at 7pm"
9. Click "Generate Trip"
10. Loading overlay appears
11. Watch progress: "Planning Day 1 of 5..."
12. See funny messages rotate every 2.5s
13. Wait 45 seconds for 5-day trip
14. Navigate to fully populated trip
15. Vibe explanation overlay appears
16. Read: "Yo! We packed this trip with..."
17. Dismiss overlay
18. See all 5 days with 6-8 cards each
19. Day 1 has hotel check-in
20. Day 5 has hotel check-out
21. No duplicate restaurants across days
22. Edit any card as needed
```

---

## 🎭 User Personas

### Persona 1: Alex (Power User)
- **Age:** 28
- **Occupation:** Software Engineer
- **Tools:** Linear, Notion, Raycast, VS Code
- **Travel:** 3-4 trips/year, mix of work and leisure
- **Needs:** Speed, keyboard shortcuts, offline mode
- **Quote:** "I want to plan my trip as fast as I write code"
- **Usage Pattern:**
  - Opens Trailblazer on flight booking
  - Uses Cmd+K exclusively
  - Never touches mouse
  - Plans entire 5-day trip in 15 minutes
  - Syncs to phone (future feature)

### Persona 2: Sarah (Casual Traveler)
- **Age:** 34
- **Occupation:** Marketing Manager
- **Tools:** Google Docs, Instagram, Pinterest
- **Travel:** 1-2 trips/year, mostly vacations
- **Needs:** Help with ideas, simple interface, mobile-friendly
- **Quote:** "I know I want to visit Tokyo, but I don't know what to do there"
- **Usage Pattern:**
  - Starts with AI Discover
  - Browses suggestions on phone
  - Saves favorites
  - Shares trip with partner (future feature)
  - Books from recommendations

### Persona 3: Mike (Travel Blogger)
- **Age:** 31
- **Occupation:** Full-time Travel Content Creator
- **Tools:** Notion, Google Sheets, TripAdvisor
- **Travel:** 10+ trips/year, professional
- **Needs:** Beautiful output, affiliate revenue, audience sharing
- **Quote:** "I need to create itineraries that my followers actually use"
- **Usage Pattern:**
  - Creates detailed 10-day itineraries
  - Adds affiliate links to cards (Phase 4.5)
  - Exports to share with followers
  - Earns commission on bookings
  - Tracks engagement metrics

---

## 💎 Unique Value Propositions

### 1. Speed Above All
- No loading spinners (offline-first)
- 60fps animations
- Instant search and filtering
- Keyboard shortcuts for everything
- < 100ms interactions

### 2. Flexibility Without Complexity
- Start with templates OR blank canvas
- Use AI suggestions OR manual input
- Minimal required fields
- Drag & drop for quick organization
- Undo/redo for experimentation

### 3. Intelligence When You Want It
- AI discovery generates personalized suggestions
- Respects preferences without being pushy
- Confidence scores for transparency
- Optional (can ignore completely)
- Learn from user behavior (future)

### 4. Mobile-First Design
- Responsive layouts (3/2/1 columns)
- Touch-optimized interactions
- 44px+ touch targets (WIP)
- Swipe gestures (future)
- Progressive Web App (future)

### 5. Revenue Without Compromise
- Affiliate links pre-fill booking details
- No price markup for users
- Transparent about relationships
- Opt-out available
- Supports free product

---

## 📊 Success Metrics

### Phase 1-4 (Current)
- ✅ Build MVP in < 20 hours
- ✅ Zero linter errors
- ✅ Offline-first working
- ✅ Command palette < 50ms open
- ✅ AI suggestions in < 10s

### Phase 5 (Next Quarter)
- [ ] 100 active users
- [ ] 500 trips created
- [ ] 85% user retention (30 days)
- [ ] 5% affiliate click-through rate
- [ ] 4.5/5 user satisfaction

### v1.0 (6 Months)
- [ ] 1,000 active users
- [ ] 5,000 trips created
- [ ] Multi-device sync working
- [ ] $500/month affiliate revenue
- [ ] 90% mobile responsiveness score

### v2.0 (12 Months)
- [ ] 10,000 active users
- [ ] 50,000 trips created
- [ ] Real-time collaboration
- [ ] $5,000/month revenue
- [ ] Featured on Product Hunt

---

## 🎯 Competitive Positioning

| Feature | Trailblazer | TripIt | Wanderlog | Sygic | Google Trips |
|---------|---------|--------|-----------|-------|--------------|
| **Offline-first** | ✅ | ❌ | ❌ | Partial | ❌ |
| **Keyboard shortcuts** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Drag & drop** | ✅ | ❌ | ✅ | Partial | ❌ |
| **AI suggestions** | ✅ | ❌ | Partial | ❌ | ✅ |
| **Free forever** | ✅ | Freemium | Freemium | Paid | Free |
| **Command palette** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Affiliate links** | 🚧 | ❌ | ✅ | ❌ | Partial |
| **Real-time collab** | 🚧 | ❌ | ✅ | ❌ | Partial |
| **Developer-friendly** | ✅ | ❌ | ❌ | ❌ | ❌ |

**Legend:**
- ✅ Fully supported
- 🚧 In progress
- Partial: Limited implementation
- ❌ Not available

---

## 🚀 Future Vision

### v1.0: Cloud Sync (3 months)
- Supabase integration
- User authentication
- Multi-device sync
- Backup and restore

### v1.5: Collaboration (6 months)
- Real-time multiplayer (Yjs)
- Comments and mentions
- Activity log
- Permissions system

### v2.0: Intelligence (12 months)
- Map integration with routes
- Optimize travel times
- Budget tracking and forecasts
- Smart recommendations (ML)
- Auto-import from emails

### v3.0: Platform (18 months)
- Mobile native apps (iOS, Android)
- Browser extensions
- API for third-party integrations
- Marketplace for templates
- White-label for travel agencies

---

**Remember:** Trailblazer is not about having every feature. It's about having the *right* features, executed perfectly, with uncompromising speed and simplicity.

