import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Compass,
  Download,
  Inbox,
  MoreVertical,
  Redo2,
  Share2,
  Undo2,
} from "lucide-react";

import { useUndoRedo } from "@/lib/hooks/useUndoRedo";
import { useKeyboardShortcuts } from "@/lib/hooks/useKeyboardShortcuts";
import { EditableHeader } from "@/components/board/EditableHeader";
import { CommandPalette } from "@/components/command-palette/CommandPalette";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/theme-toggler";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavbarProps {
  trip: {
    id: string;
    title: string;
    description?: string;
    unassignedCards?: any[];
  };
  thingsToDoOpen: boolean;
  setThingsToDoOpen: (open: boolean) => void;
}

export function Navbar({
  trip,
  thingsToDoOpen,
  setThingsToDoOpen,
}: NavbarProps) {
  const { undo, redo, canUndo, canRedo } = useUndoRedo();

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: "z",
      meta: true,
      shift: false,
      handler: () => {
        if (canUndo) {
          undo();
          toast.success("Undone");
        }
      },
      description: "Undo last action",
    },
    {
      key: "z",
      meta: true,
      shift: true,
      handler: () => {
        if (canRedo) {
          redo();
          toast.success("Redone");
        }
      },
      description: "Redo last action",
    },
    {
      key: "k",
      meta: true,
      shift: false,
      handler: () => {
        setCommandPaletteOpen(true);
      },
      description: "Open command palette",
    },
  ]);

  return (
    <nav
      id="navbar"
      className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10"
    >
      <div id="navbar-content" className="container mx-auto px-4 py-3">
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
                  <ArrowLeft className="w-4 h-4" />
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
          {/* only show if url /trip/:id */}
          <div
            id="things-to-do-toggle"
            className="flex items-center gap-2 flex-wrap justify-center w-full sm:w-auto"
          >
            {/* To-Do Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setThingsToDoOpen(!thingsToDoOpen)}
              title="To-Do"
              className="flex items-center gap-1"
            >
              <Inbox className="w-4 h-4" />
              <span className="hidden sm:inline">To-Do</span>
              {trip.unassignedCards && trip.unassignedCards.length > 0 && (
                <span className="px-1.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                  {trip.unassignedCards.length}
                </span>
              )}
            </Button>

            {/* Undo/Redo */}
            <div id="undo-redo" className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                title="Undo (Cmd+Z)"
                onClick={() => {
                  undo();
                  toast.success("Undone");
                }}
                disabled={!canUndo}
              >
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Redo (Cmd+Shift+Z)"
                onClick={() => {
                  redo();
                  toast.success("Redone");
                }}
                disabled={!canRedo}
              >
                <Redo2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="w-px h-6 bg-border mx-2" />

            {/* Actions */}
            <Tooltip>
              <Link href="/discover">
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    // size="icon"
                    // title="Discover things to do"
                    className="lg:px-3"
                  >
                    <Compass className="w-4 h-4 lg:mr-2" />
                    <span className="hidden lg:inline whitespace-nowrap">
                      Discover
                    </span>
                  </Button>
                </TooltipTrigger>
              </Link>
              <TooltipContent side="bottom">
                Discover things to do!
              </TooltipContent>
            </Tooltip>
            <div className="w-px h-6 bg-border mx-2"></div>
            {/* Actions Dropdown - hidden on lg+ */}
            <div className="flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div id="actions-dropdown" className="lg:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          // title="More actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Export JSON
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">More actions</TooltipContent>
              </Tooltip>
            </div>

            {/* Full Actions - visible on lg+ */}
            <div id="full-actions" className="hidden lg:flex gap-2">
              <Button variant="ghost" size="icon" title="Export JSON">
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Share">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
            <ModeToggle />
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
