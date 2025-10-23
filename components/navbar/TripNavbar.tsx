"use client";

import Link from "next/link";
import { useState } from "react";
import { Home, Inbox } from "lucide-react";

import { EditableHeader } from "@/components/board/EditableHeader";
import { CommandPalette } from "@/components/command-palette/CommandPalette";
import { ActionsBar } from "@/components/ui/actions-bar";
import { Button } from "@/components/ui/button";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { UndoRedoGroup } from "@/components/ui/undo-redo-group";
import { useAppShortcuts } from "@/lib/hooks/useKeyboardShortcuts";
import { InfoCard } from "@/lib/types";

interface NavbarProps {
  trip: {
    id: string;
    title: string;
    description?: string;
    unassignedCards?: InfoCard[];
  };
  thingsToDoOpen: boolean;
  setThingsToDoOpen: (open: boolean) => void;
}

export function Navbar({
  trip,
  thingsToDoOpen,
  setThingsToDoOpen,
}: NavbarProps) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useAppShortcuts(setCommandPaletteOpen);

  return (
    <nav
      id="navbar"
      className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10"
    >
      <div id="navbar-content" className="mx-auto px-4 py-3">
        <div
          id="navbar-inner"
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div
            id="header"
            className="flex flex-row items-center gap-4 flex-1 justify-between sm:justify-start"
          >
            <div id="back-button" className="flex justify-start">
              <Link href="/trips">
                <Button variant="ghost" size="icon" title="Back to all trips">
                  <Home className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div id="title" className="flex justify-center flex-1">
              <div className="flex items-center gap-4 min-w-0">
                <EditableHeader
                  tripId={trip.id}
                  title={trip.title}
                  description={trip.description}
                />
              </div>
            </div>
          </div>

          <div
            id="things-to-do-toggle"
            className="flex items-center gap-2 flex-wrap justify-center w-full sm:w-auto"
          >
            {/* To-Do Toggle */}
            <CustomTooltip content="To-Do List" side="bottom">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setThingsToDoOpen(!thingsToDoOpen)}
                title="To-Do"
              >
                <div className="flex items-center gap-1">
                  <Inbox className="w-4 h-4" />
                  <span className="hidden sm:inline">To-Do</span>
                  <span className="text-xs font-medium rounded-full pl-2">
                    {trip.unassignedCards && trip.unassignedCards.length > 0
                      ? trip.unassignedCards.length
                      : 0}
                  </span>
                </div>
              </Button>
            </CustomTooltip>

            {/* Undo/Redo */}
            <UndoRedoGroup />

            {/* Actions Bar */}
            <ActionsBar discoverHref="/discover?from=trip" />
          </div>
        </div>
      </div>
      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        tripId={trip.id}
        defaultDayId="unassigned"
      />
    </nav>
  );
}
