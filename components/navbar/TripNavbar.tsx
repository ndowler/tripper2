import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import {
  Compass,
  Download,
  Home,
  Inbox,
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
import { ModeToggle, ThemeMenuItems } from "@/components/ui/theme-toggler";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomTooltip } from "../ui/custom-tooltip";
import { ButtonGroup } from "../ui/button-group";
import { Separator } from "../ui/separator";

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
                  <Home className="w-4 h-4" />
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
            {/* To-Do Toggle */}
            <CustomTooltip content="To-Do List" side="bottom">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setThingsToDoOpen(!thingsToDoOpen)}
                title="To-Do"
                data-tour="things-to-do"
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
            <div id="undo-redo" className="flex gap-1">
              <ButtonGroup className="border rounded-lg">
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
                <Separator orientation="vertical" />
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
              </ButtonGroup>
            </div>

            {/* Actions */}
            <CustomTooltip content="Discover More" side="bottom">
              <Link href="/discover" data-tour="discover-button">
                <Button
                  variant="outline"
                  // size="icon"
                  // title="Discover things to do"
                  className="lg:px-3"
                >
                  <Compass className="w-4 h-4 lg:mr-2" />
                  <span className="hidden lg:inline whitespace-nowrap">
                    Discover
                  </span>
                </Button>
              </Link>
            </CustomTooltip>
            {/* Actions Dropdown - hidden on lg+ */}
            <div className="flex items-center">
              <CustomTooltip content="More actions" side="bottom">
                <div id="actions-dropdown" className="lg:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
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
                      <ThemeMenuItems />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CustomTooltip>
            </div>

            {/* Full Actions - visible on lg+ */}
            <div id="full-actions" className="hidden lg:flex gap-2">
              <Button variant="outline" size="icon" title="Export JSON">
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" title="Share">
                <Share2 className="w-4 h-4" />
              </Button>
              {/* Theme Toggle */}
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
      {/* Command Palette */}
      <div data-tour="command-palette">
        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          tripId={trip.id}
          defaultDayId="unassigned"
        />
      </div>
    </nav>
  );
}
