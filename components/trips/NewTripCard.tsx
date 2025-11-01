'use client'

import { PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NewTripCardProps {
  onClick: () => void
}

export function NewTripCard({ onClick }: NewTripCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-xl border-2 border-dashed",
        "border-muted-foreground/25 hover:border-primary/50",
        "bg-gradient-to-br from-background to-muted/20",
        "hover:from-primary/5 hover:to-primary/10",
        "transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
        "min-h-[280px] flex flex-col items-center justify-center",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] group-hover:opacity-[0.04] transition-opacity" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-4 p-8">
        <div className="rounded-full bg-primary/10 p-6 group-hover:bg-primary/20 transition-colors">
          <PlusCircle className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
            Create New Trip
          </h3>
          <p className="text-sm text-muted-foreground">
            Start planning your next adventure
          </p>
        </div>
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500" />
    </button>
  )
}

