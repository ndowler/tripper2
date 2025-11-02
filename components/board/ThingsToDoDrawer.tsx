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
  Calendar,
} from "lucide-react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";

interface ThingsToDoDrawerProps {
  trip: Trip;
  userId: string;
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
        <div className="sticky top-0 z-20 px-4 py-3 border-b bg-card/95 backdrop-blur-sm">
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hidden lg:flex"
                onClick={() => setIsCollapsed(false)}
                aria-label="Expand drawer"
                title="Expand Things to Do"
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>

              <div className="relative">
                <Inbox className="w-4 h-4 text-muted-foreground" />
                {unassignedCards.length > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 text-[10px] font-bold bg-blue-500 text-white rounded-full flex items-center justify-center">
                    {unassignedCards.length}
                  </span>
                )}
              </div>
              <Link href="/day-view">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Go to day view"
                  title="Day View"
                >
                  <Calendar className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-muted-foreground" />
                  <h2 className="font-semibold text-base select-none">
                    Things to Do
                  </h2>
                  {unassignedCards.length > 0 && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                      {unassignedCards.length}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hidden lg:flex"
                    onClick={() => setIsCollapsed(true)}
                    aria-label="Collapse drawer"
                    title="Collapse"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 lg:hidden"
                    onClick={onClose}
                    aria-label="Close drawer"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Link href="/day-view">
                  <Button
                    variant="ghost"
                    // size="icon"
                    // className="h-8 w-8"
                    aria-label="Go to day view"
                    title="Day View"
                  >
                    <Calendar className="w-4 h-4" />
                    Day View
                  </Button>
                </Link>
              </div>
              {/* Tip */}
              <div className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
                <ArrowRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
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
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <Inbox className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-sm font-medium mb-1">
                    All activities scheduled!
                  </p>
                  <p className="text-xs text-muted-foreground max-w-xs">
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
                className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary cursor-pointer hover:bg-primary/20 transition-colors"
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
