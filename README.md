# ✈️ Tripper

> Lightning-fast, offline-first trip planning. Think "Trello meets Linear for travel."

## 🛠 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 15 (App Router) | SSR, great routing, Vercel deploy |
| **Language** | TypeScript 5 | Type safety, better DX |
| **State** | Zustand + Immer | Lightweight, immutable updates |
| **Validation** | Zod | Runtime validation, TS inference |
| **Drag & Drop** | dnd-kit | Modern, accessible, mobile-friendly |
| **Styling** | Tailwind CSS | Utility-first, fast iteration |
| **UI Components** | shadcn/ui | Beautiful, accessible primitives |
| **Dates** | date-fns | Lightweight date utilities |
| **IDs** | nanoid | Tiny, secure unique IDs |

## 📁 Project Structure

```
tripper/
├── app/                    # Next.js app router
│   ├── (trip)/            # Trip routes
│   ├── demo/              # Demo trip page
│   └── page.tsx           # Landing page
├── components/
│   ├── board/             # Board, DayColumn, AddDay
│   ├── cards/             # TripCard, CardComposer
│   └── ui/                # shadcn/ui primitives
├── lib/
│   ├── store/             # Zustand state management
│   ├── types/             # TypeScript interfaces
│   ├── schemas/           # Zod validation schemas
│   ├── utils/             # Utility functions
│   └── constants.ts       # App constants
├── memory-bank/           # Project documentation
└── .cursor/rules/         # AI assistant context
```

## 🎨 Card Types

Each card type has its own icon, color scheme, and suggested fields:

- **Activity** 🎯 - Sightseeing, tours, experiences
- **Meal** 🍽️ - Breakfast, lunch, dinner, snacks
- **Transit** 🚗 - Flights, trains, taxis, transfers
- **Note** 📝 - Reminders, packing lists, tips

## 💾 Data Persistence

All data is automatically saved to localStorage with a 500ms debounce. Your trip data persists across browser sessions and works completely offline.

**Future:** Supabase integration for cloud sync and multi-device support.

## ⌨️ Keyboard Shortcuts (Coming in Phase 3)

| Shortcut | Action |
|----------|--------|
| `Enter` | Add card |
| `Tab` / `Shift+Tab` | Navigate |
| `↑` / `↓` | Move card |
| `,` / `.` | Nudge time ±15min |
| `Cmd+Z` | Undo |
| `Cmd+Shift+Z` | Redo |
| `Cmd+D` | Duplicate |
| `Backspace` | Delete |
| `Cmd+K` | Command palette |


## 📦 Build & Deploy

```bash
# Production build
npm run build

# Start production server
npm start

# Deploy to Vercel (recommended)
vercel
```

---

**Built with ❤️ and ☕ in 2 hours**

*"The best trip planner is the one you actually use."*
