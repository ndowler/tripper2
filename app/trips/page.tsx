"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { Trip } from "@/lib/types";
import { useTripStore } from "@/lib/store/tripStore";
import { PlusCircle, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TripGrid } from "@/components/trips/TripGrid";
import { DeleteTripDialog } from "@/components/trips/DeleteTripDialog";
import { EmptyTripsState } from "@/components/trips/EmptyTripsState";
import { NewTripModal } from "@/components/trips/NewTripModal";
import { EditTripModal } from "@/components/trips/EditTripModal";
import { ModeToggle } from "@/components/ui/theme-toggler";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { LoadingSpinner } from "@/components/ui/page-loading-spinner";

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

  // Only render after hydration
  if (!isHydrated) return LoadingSpinner("Loading your trips...");

  const handleDuplicate = (trip: Trip) => {
    duplicateTrip(trip.id);
    toast.success(`"${trip.title}" duplicated`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* <Link href="/">
              <Button variant="ghost" title="Home">
                Home
              </Button>
            </Link> */}
            <div>
              <h1 className="text-2xl font-bold select-none text-start">
                ✈️ My Trips
              </h1>
              {isHydrated && (
                <p className="text-sm text-muted-foreground mt-1 select-none text-start">
                  {trips.length} {trips.length === 1 ? "Trip" : "Trips"}
                </p>
              )}
            </div>
            <CustomTooltip content="Create a new trip" side="bottom">
              <Button
                onClick={() => setIsNewTripModalOpen(true)}
                className="gap-2"
              >
                <PlusCircle className="h-5 w-5" />
                New Trip
              </Button>
            </CustomTooltip>
            <CustomTooltip content="Discover more!" side="bottom">
              <Link href="/discover">
                <Button variant="outline" className="gap-2">
                  <Search className="h-5 w-5" />
                  <span className="hidden md:inline">Discover</span>
                </Button>
              </Link>
            </CustomTooltip>

            <CustomTooltip content="Theme" side="bottom">
              <ModeToggle />
            </CustomTooltip>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {trips.length === 0 ? (
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
