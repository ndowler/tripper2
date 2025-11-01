'use client'

export function TripCardSkeleton() {
  return (
    <div className="bg-card border rounded-lg overflow-hidden animate-pulse">
      {/* Cover placeholder */}
      <div className="h-32 bg-muted" />

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="h-6 bg-muted rounded w-3/4" />
          <div className="h-8 w-8 bg-muted rounded" />
        </div>

        <div className="h-4 bg-muted rounded w-full mb-3" />

        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-3/4" />
        </div>
      </div>
    </div>
  )
}

export function TripStatsSkeletons() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-card border rounded-lg p-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-muted rounded-lg" />
            <div className="space-y-2 flex-1">
              <div className="h-6 bg-muted rounded w-12" />
              <div className="h-3 bg-muted rounded w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

