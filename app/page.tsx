import Link from "next/link"
import { PlusCircle, Map } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-6xl font-bold tracking-tight">
          ✈️ Tripper
        </h1>
        <p className="text-xl text-muted-foreground">
          Fast, offline-first trip planning. Like Trello, but for travel.
        </p>
        
        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/trips"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
          >
            <Map className="w-5 h-5" />
            View My Trips
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
          >
            <PlusCircle className="w-5 h-5" />
            Try Demo
          </Link>
        </div>
        
        <div className="mt-12 text-sm text-muted-foreground">
          <p>✨ Drag & drop • ⌨️ Keyboard shortcuts • 📱 Mobile-friendly • ✈️ Offline-first</p>
        </div>
      </div>
    </main>
  )
}
