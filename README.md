# ✈️ Tripper

> Lightning-fast, offline-first trip planning. Think "Trello meets Linear for travel."

**Status**: Phase 1 MVP - Ready for Production 🚀

## ✨ Features

- 🚀 **Lightning Fast** - Offline-first with instant sync
- 🎨 **Drag & Drop** - Organize your itinerary visually
- ⌨️ **Keyboard Shortcuts** - Press Cmd+K for everything
- 🤖 **AI-Powered** - Get personalized destination suggestions
- 📱 **Mobile Ready** - Responsive design for all devices
- 🔐 **Secure** - Row-level security with Supabase
- 🆓 **Free Forever** - No paywalls, no subscriptions

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Supabase account (free)
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd tripper

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Add your keys to .env.local
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - OPENAI_API_KEY

# Run database migrations (see SETUP_GUIDE.md)

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📖 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup and deployment guide
- **[memory-bank/](./memory-bank/)** - Project context and architecture
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Testing scenarios

## 🛠 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 15 (App Router) | SSR, great routing, Vercel deploy |
| **Database** | Supabase (PostgreSQL) | Real-time, RLS, authentication |
| **Language** | TypeScript 5 | Type safety, better DX |
| **State** | Zustand + Immer | Lightweight, immutable updates |
| **Auth** | Supabase Auth | Email, OAuth, secure sessions |
| **AI** | OpenAI GPT-4o-mini | Fast, cheap, high-quality suggestions |
| **Styling** | Tailwind CSS | Utility-first, fast iteration |
| **UI** | shadcn/ui + Radix UI | Beautiful, accessible components |
| **Drag & Drop** | dnd-kit | Modern, accessible, mobile-friendly |

## 📁 Project Structure

```
tripper/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth pages (login, signup)
│   ├── api/                 # API routes
│   ├── trip/[id]/           # Individual trip pages
│   ├── trips/               # Trips overview
│   ├── discover/            # AI suggestions
│   ├── profile/             # User profile
│   └── page.tsx             # Landing page
├── components/
│   ├── board/               # Trip board components
│   ├── cards/               # Card components
│   ├── trips/               # Trip management
│   ├── migration/           # Data migration
│   └── ui/                  # Reusable UI primitives
├── lib/
│   ├── supabase/            # Supabase clients & config
│   ├── store/               # Zustand state management
│   ├── types/               # TypeScript types
│   ├── schemas/             # Zod validation
│   └── utils/               # Utilities & helpers
└── memory-bank/             # Project documentation
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+K` / `Ctrl+K` | Open command palette |
| `Cmd+Z` / `Ctrl+Z` | Undo |
| `Cmd+Shift+Z` | Redo |
| `↑` / `↓` | Navigate cards |
| `Esc` | Close dialogs |

## 🎨 Card Types

- **Activity** 🎯 - Museums, tours, attractions
- **Meal** 🍽️ - General meals
- **Restaurant** 🍴 - Specific reservations
- **Transit** 🚗 - General transportation
- **Flight** ✈️ - Flight bookings
- **Hotel** 🏨 - Accommodation
- **Shopping** 🛍️ - Markets, boutiques
- **Entertainment** 🎭 - Shows, concerts
- **Note** 📝 - Reminders, packing lists

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions.

### Self-Hosted

```bash
npm run build
npm start
```

## 🔒 Security

- Row-level security (RLS) on all tables
- Server-side authentication with Supabase
- Environment variables never exposed to client
- Input validation with Zod schemas
- HTTPS required in production

## 📊 Database Schema

See `lib/supabase/database.sql` for complete schema.

Tables:
- `user_profiles` - Extended user data
- `trips` - Trip metadata
- `days` - Days in a trip
- `cards` - Activities, meals, etc.
- `user_preferences` - Vibes and settings

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details

## 🆘 Support

- **Issues**: Open a GitHub issue
- **Email**: support@tripper.app
- **Documentation**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## 🗺️ Roadmap

- [x] Phase 1: Core trip planning
- [x] Phase 2: Drag & drop
- [x] Phase 3: Command palette & templates
- [x] Phase 4: AI suggestions & vibes
- [x] Phase 5: Authentication & cloud sync
- [ ] Phase 6: Real-time collaboration
- [ ] Phase 7: Mobile apps
- [ ] Phase 8: Map integration

## 💎 Built With

- ❤️ Love for great software
- ☕ Too much coffee
- ✈️ Passion for travel

*"The best trip planner is the one you actually use."*

---

Made with ❤️ by the Tripper team
