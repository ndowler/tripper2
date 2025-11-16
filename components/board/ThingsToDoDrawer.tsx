"use client";

import { useState } from "react";
import Link from "next/link";
import { type Trip } from "@/lib/types";
import { SortableCard } from "@/components/cards/SortableCard";
import { CardComposer } from "@/components/cards/CardComposer";
import {
  Inbox,
  X,
  ArrowRight,
  ChevronsLeft,
  ChevronsRight,
  Compass,
} from "lucide-react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";

interface ThingsToDoDrawerProps {
  trip: Trip;
  userId?: string; // Optional for demo/offline mode
  isOpen: boolean;
  onClose: () => void;
}

export function ThingsToDoDrawer({
  trip,
  userId,
  isOpen,
  onClose,
}: ThingsToDoDrawerProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const unassignedCards = trip.unassignedCards || [];

  const { setNodeRef } = useDroppable({
    id: "unassigned",
    data: {
      type: "unassigned",
    },
  });

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        ref={setNodeRef}
        className={`
          fixed top-0 left-0 h-full bg-card border-r shadow-xl z-40
          transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-16" : "w-80"}
          xl:relative xl:translate-x-0 xl:z-0 xl:shadow-none xl:h-auto xl:flex-shrink-0
        `}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 px-4 py-4 border-b border-teal-400/10 bg-gradient-to-b from-background/98 to-background/95 backdrop-blur-sm">
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hidden lg:flex hover:bg-teal-500/10"
                onClick={() => setIsCollapsed(false)}
                aria-label="Expand drawer"
                title="Expand Things to Do"
              >
                <ChevronsRight className="w-4 h-4 text-teal-400" />
              </Button>

              <div className="relative">
                <Inbox className="w-4 h-4 text-teal-400" />
                {unassignedCards.length > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 text-[10px] font-bold bg-gradient-to-r from-teal-500 to-violet-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-teal-500/30">
                    {unassignedCards.length}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <Link
                  href={`/discover?from=trip&destination=${encodeURIComponent(
                    trip.destination?.city || trip.title
                  )}`}
                  className="flex-1"
                >
                  <button className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-violet-500 hover:from-teal-600 hover:to-violet-600 shadow-lg shadow-teal-500/25 transition-all hover:shadow-xl hover:shadow-teal-500/30 hover:scale-[1.02] text-white font-semibold flex items-center justify-center gap-2">
                    <Compass className="w-5 h-5" />
                    <span>Discover Activities</span>
                  </button>
                </Link>
                <div className="flex items-center gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hidden lg:flex hover:bg-teal-500/10"
                    onClick={() => setIsCollapsed(true)}
                    aria-label="Collapse drawer"
                    title="Collapse"
                  >
                    <ChevronsLeft className="w-4 h-4 text-teal-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 lg:hidden hover:bg-teal-500/10"
                    onClick={onClose}
                    aria-label="Close drawer"
                  >
                    <X className="w-4 h-4 text-teal-400" />
                  </Button>
                </div>
              </div>
              {/* Things to Do section label */}
              <div className="flex items-center gap-2 px-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500/10 to-violet-500/10 border border-teal-400/20">
                  <Inbox className="w-4 h-4 text-teal-400" />
                </div>
                <h2 className="font-semibold text-sm select-none">
                  Things to Do
                </h2>
                {unassignedCards.length > 0 && (
                  <span className="px-2.5 py-0.5 text-xs font-medium bg-gradient-to-r from-teal-500/20 to-violet-500/20 border border-teal-400/20 text-teal-400 rounded-full">
                    {unassignedCards.length}
                  </span>
                )}
              </div>
              {/* Tip */}
              <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground/70 px-1">
                <ArrowRight className="w-3 h-3 mt-0.5 flex-shrink-0 text-teal-400/60" />
                <span>Drag cards onto any day to schedule them</span>
              </div>
            </>
          )}
        </div>

        {/* Cards - Vertical Stack */}
        {!isCollapsed && (
          <SortableContext
            items={unassignedCards.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-10rem)]">
              {unassignedCards.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-500/20 to-violet-500/20 border border-teal-400/30 mb-4">
                    <div className="absolute inset-0 rounded-full bg-teal-400/10 blur-lg" />
                    <Inbox className="relative w-8 h-8 text-teal-400 z-10" />
                  </div>
                  <p className="text-sm font-semibold mb-1">
                    All activities scheduled!
                  </p>
                  <p className="text-xs text-muted-foreground/70 max-w-xs">
                    Add new ideas here before assigning them to specific days
                  </p>
                </div>
              ) : (
                unassignedCards.map((card) => (
                  <SortableCard
                    key={card.id}
                    card={card}
                    tripId={trip.id}
                    dayId="unassigned"
                    userId={userId}
                  />
                ))
              )}

              {/* Add card composer */}
              <CardComposer tripId={trip.id} dayId="unassigned" userId={userId} />
            </div>
          </SortableContext>
        )}

        {/* Collapsed State - Show cards as minimal badges */}
        {isCollapsed && unassignedCards.length > 0 && (
          <div className="p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-10rem)]">
            {unassignedCards.map((card) => (
              <div
                key={card.id}
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500/10 to-violet-500/10 border border-teal-400/20 flex items-center justify-center text-xs font-bold text-teal-400 cursor-pointer hover:border-teal-400/40 hover:bg-teal-500/20 transition-all"
                title={card.title}
                onClick={() => setIsCollapsed(false)}
              >
                {card.title.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
