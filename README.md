# ✈️ Tripper

> Lightning-fast, offline-first trip planning. Think "Trello meets Linear for travel."

![Phase 1 Complete](https://img.shields.io/badge/Phase%201-Complete-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open demo trip
open http://localhost:3000/demo
```

## ✨ Features (Phase 1 - COMPLETE)

- ✅ **Board Layout** - Horizontal scrolling day columns
- ✅ **Card Types** - Activity 🎯, Meal 🍽️, Transit 🚗, Note 📝
- ✅ **CRUD Operations** - Create, read, update, delete, duplicate cards
- ✅ **Time Management** - Start/end times, duration, visual display
- ✅ **Rich Details** - Locations, costs, tags, notes, links
- ✅ **Offline First** - All data persists to localStorage (auto-save)
- ✅ **Type Safe** - Full TypeScript with Zod validation
- ✅ **Beautiful UI** - Tailwind CSS + shadcn/ui components

## 🎯 Roadmap

### Phase 2: Drag & Drop (Next Up)
- [ ] Sortable days (horizontal)
- [ ] Sortable cards (vertical)
- [ ] Cross-column dragging
- [ ] Inline card editing
- [ ] Keyboard navigation

### Phase 3: Power Features
- [ ] Undo/redo
- [ ] Keyboard shortcuts (Enter, ↑↓, Cmd+Z, Cmd+K)
- [ ] Multi-select
- [ ] Command palette

### Phase 4: Polish
- [ ] JSON export/import
- [ ] Share read-only links
- [ ] Mobile touch enhancements
- [ ] Accessibility audit

### v1.0: Cloud Sync
- [ ] Supabase integration
- [ ] User authentication
- [ ] Multi-device sync

### v1.5: Collaboration
- [ ] Real-time multiplayer (Yjs)
- [ ] Comments
- [ ] Activity log

### v2.0: Intelligence
- [ ] Map integration
- [ ] Route optimization
- [ ] Budget tracking
- [ ] AI recommendations

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

## 🧪 Testing (Coming Soon)

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e
```

## 📦 Build & Deploy

```bash
# Production build
npm run build

# Start production server
npm start

# Deploy to Vercel (recommended)
vercel
```

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome! Open an issue or reach out.

## 📄 License

MIT

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [dnd-kit](https://dndkit.com/) - Drag and drop toolkit
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Zustand](https://github.com/pmndrs/zustand) - State management

---

**Built with ❤️ and ☕ in 2 hours**

*"The best trip planner is the one you actually use."*
