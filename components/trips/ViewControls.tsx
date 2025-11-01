'use client'

import { Search, Grid3x3, List, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

type ViewMode = 'grid' | 'list'
type SortOption = 'updated' | 'created' | 'name' | 'date'
type FilterOption = 'all' | 'upcoming' | 'in-progress' | 'completed' | 'draft'

interface ViewControlsProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  filter: FilterOption
  onFilterChange: (filter: FilterOption) => void
  filteredCount: number
  totalCount: number
}

export function ViewControls({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  filter,
  onFilterChange,
  filteredCount,
  totalCount,
}: ViewControlsProps) {
  const sortLabels: Record<SortOption, string> = {
    updated: 'Last Updated',
    created: 'Date Created',
    name: 'Name',
    date: 'Trip Date',
  }

  const filterLabels: Record<FilterOption, string> = {
    all: 'All Trips',
    upcoming: 'Upcoming',
    'in-progress': 'In Progress',
    completed: 'Completed',
    draft: 'Drafts',
  }

  return (
    <div className="space-y-4 mb-6">
      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search trips..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">{sortLabels[sortBy]}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value={sortBy} onValueChange={(val) => onSortChange(val as SortOption)}>
                <DropdownMenuRadioItem value="updated">Last Updated</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="created">Date Created</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="name">Name (A-Z)</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="date">Trip Date</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Mode Toggle */}
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="rounded-none"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="rounded-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Badges */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-muted-foreground">Filter:</span>
        {(Object.keys(filterLabels) as FilterOption[]).map((option) => (
          <Badge
            key={option}
            variant={filter === option ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={() => onFilterChange(option)}
          >
            {filterLabels[option]}
          </Badge>
        ))}
        {filteredCount !== totalCount && (
          <span className="text-sm text-muted-foreground ml-2">
            Showing {filteredCount} of {totalCount}
          </span>
        )}
      </div>
    </div>
  )
}

