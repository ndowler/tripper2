"use client";

import { useState, useEffect, useMemo } from "react";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTripStore } from "@/lib/store/tripStore";
import { TripGrid } from "@/components/trips/TripGrid";
import { TripStats } from "@/components/trips/TripStats";
import { ViewControls } from "@/components/trips/ViewControls";
import { EmptyTripsState } from "@/components/trips/EmptyTripsState";
import { NewTripModal } from "@/components/trips/NewTripModal";
import { EditTripModal } from "@/components/trips/EditTripModal";
import { DeleteTripDialog } from "@/components/trips/DeleteTripDialog";
import { TripCardSkeleton, TripStatsSkeletons } from "@/components/trips/TripCardSkeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Trip } from "@/lib/types";
import { getTripStats, getTripStatus } from "@/lib/utils/trips";
import Link from "next/link";
import Image from "next/image";

type ViewMode = 'grid' | 'list'
type SortOption = 'updated' | 'created' | 'name' | 'date'
type FilterOption = 'all' | 'upcoming' | 'in-progress' | 'completed' | 'draft'

export default function TripsPage() {
  const router = useRouter();
  const getAllTrips = useTripStore((state) => state.getAllTrips);
  const loadTrips = useTripStore((state) => state.loadTrips);
  const duplicateTrip = useTripStore((state) => state.duplicateTrip);

  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewTripModalOpen, setIsNewTripModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [deletingTrip, setDeletingTrip] = useState<Trip | null>(null);
  
  // View state
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [filter, setFilter] = useState<FilterOption>('all');

  // Check auth and load trips
  useEffect(() => {
    async function init() {
      try {
        const supabase = createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          router.push('/login');
          return;
        }

        setUserId(user.id);
        await loadTrips(user.id);
      } catch (error) {
        console.error('Failed to initialize:', error);
        toast.error('Failed to load trips');
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, [router, loadTrips]);

  const allTrips = getAllTrips();

  // Filter and sort trips
  const filteredAndSortedTrips = useMemo(() => {
    let result = [...allTrips];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(trip => 
        trip.title.toLowerCase().includes(query) ||
        trip.destination?.toLowerCase().includes(query) ||
        trip.description?.toLowerCase().includes(query)
      );
    }

    // Apply filter
    if (filter !== 'all') {
      result = result.filter(trip => getTripStatus(trip) === filter);
    }

    // Apply sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'name':
          return a.title.localeCompare(b.title);
        case 'date':
          const dateA = a.days[0]?.date || '';
          const dateB = b.days[0]?.date || '';
          return dateB.localeCompare(dateA);
        default:
          return 0;
      }
    });

    return result;
  }, [allTrips, searchQuery, filter, sortBy]);

  const stats = useMemo(() => getTripStats(allTrips), [allTrips]);

  const handleDuplicate = async (trip: Trip) => {
    if (!userId) return;
    
    try {
      await duplicateTrip(trip.id, userId);
      toast.success(`"${trip.title}" duplicated`);
    } catch (error) {
      toast.error('Failed to duplicate trip');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Enhanced Header */}
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur-lg z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            {/* Logo */}
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Image
                src="/tripper.png"
                alt="Tripper"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>

            {/* Profile Button */}
            <Link href="/profile">
              <Button variant="outline" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Your Trips
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Your adventures, beautifully organized
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          // Loading skeletons
          <>
            <TripStatsSkeletons />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <TripCardSkeleton key={i} />
              ))}
            </div>
          </>
        ) : allTrips.length === 0 ? (
          <EmptyTripsState onCreateTrip={() => setIsNewTripModalOpen(true)} />
        ) : (
          <>
            {/* Stats Dashboard */}
            <TripStats
              total={stats.total}
              upcoming={stats.upcoming}
              inProgress={stats.inProgress}
              totalDays={stats.totalDays}
              totalActivities={stats.totalActivities}
            />

            {/* View Controls */}
            <ViewControls
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortBy={sortBy}
              onSortChange={setSortBy}
              filter={filter}
              onFilterChange={setFilter}
              filteredCount={filteredAndSortedTrips.length}
              totalCount={allTrips.length}
            />

            {/* Trips Grid */}
            {filteredAndSortedTrips.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4 opacity-30">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No trips found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filters
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <TripGrid
                trips={filteredAndSortedTrips}
                onEdit={(trip) => setEditingTrip(trip)}
                onDuplicate={handleDuplicate}
                onDelete={(trip) => setDeletingTrip(trip)}
                onCreateNew={() => setIsNewTripModalOpen(true)}
                viewMode={viewMode}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {userId && (
        <>
          <NewTripModal
            open={isNewTripModalOpen}
            onOpenChange={setIsNewTripModalOpen}
            userId={userId}
          />

          <EditTripModal
            trip={editingTrip}
            open={!!editingTrip}
            onOpenChange={(open) => !open && setEditingTrip(null)}
            userId={userId}
          />

          <DeleteTripDialog
            trip={deletingTrip}
            open={!!deletingTrip}
            onOpenChange={(open) => !open && setDeletingTrip(null)}
            userId={userId}
          />
        </>
      )}
    </div>
  );
}
