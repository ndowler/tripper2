import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import {
  ArrowLeft,
  Calendar,
  Compass,
  Download,
  Moon,
  MoreVertical,
  Redo2,
  Share2,
  Sun,
  Undo2,
  User,
} from "lucide-react";

import { useUndoRedo } from "@/lib/hooks/useUndoRedo";
import { useKeyboardShortcuts } from "@/lib/hooks/useKeyboardShortcuts";
import { EditableHeader } from "@/components/board/EditableHeader";
import { CommandPalette } from "@/components/command-palette/CommandPalette";
import { Button } from "@/components/ui/button";
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
  const { theme, setTheme } = useTheme();

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

            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/tripper.png"
                alt="Tripper"
                width={32}
                height={32}
                className="rounded-md"
              />
            </Link>

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
          {/* Actions */}
          <div
            id="actions"
            className="flex items-center gap-2 flex-wrap justify-center w-full sm:w-auto"
          >
            {/* Day View Button */}
            <Tooltip>
              <Link href="/day-view">
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Day View"
                    className="flex items-center gap-1"
                  >
                    <Calendar className="w-4 h-4" />
                    <span className="hidden sm:inline">Day View</span>
                  </Button>
                </TooltipTrigger>
              </Link>
              <TooltipContent side="bottom">
                View by day
              </TooltipContent>
            </Tooltip>

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

            {/* Discover */}
            <Tooltip>
              <Link href="/discover">
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Discover things to do"
                    className="flex items-center gap-1"
                  >
                    <Compass className="w-4 h-4" />
                    <span className="hidden lg:inline">Discover</span>
                  </Button>
                </TooltipTrigger>
              </Link>
              <TooltipContent side="bottom">
                Discover things to do!
              </TooltipContent>
            </Tooltip>
            
            {/* Profile Button */}
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
            </Link>

            {/* More Actions Dropdown - all the way to the right */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  title="More actions"
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
                <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  {theme === "dark" ? (
                    <>
                      <Sun className="w-4 h-4 mr-2" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 mr-2" />
                      Dark Mode
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
