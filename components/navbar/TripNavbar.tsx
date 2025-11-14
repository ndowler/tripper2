import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import {
  Compass,
  Home,
  Inbox,
  MoreVertical,
  Redo2,
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
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { cn } from "@/lib/utils";

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
  const isMobile = useIsMobile();

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
      <div id="navbar-content" className={cn(
        "container mx-auto",
        isMobile ? "px-3 py-2" : "px-4 py-3"
      )}>
        <div
          id="navbar-inner"
          className={cn(
            "flex items-center justify-between",
            isMobile ? "gap-2" : "gap-4"
          )}
        >
          <div
            id="header"
            className="flex flex-row items-center gap-2 flex-1 min-w-0"
          >
            <div id="back-button" className="flex justify-start flex-shrink-0">
              <Link href="/trips">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  title="Back to all trips"
                  className={cn(isMobile && "h-9 w-9")}
                >
                  <Home className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {!isMobile && (
              <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                <Image
                  src="/tripper.png"
                  alt="Tripper"
                  width={32}
                  height={32}
                  className="rounded-md"
                />
              </Link>
            )}

            <div id="title" className="flex-1 min-w-0 overflow-hidden">
              <EditableHeader
                tripId={trip.id}
                title={trip.title}
                description={trip.description}
              />
            </div>
          </div>
          {/* Actions */}
          <div
            id="actions"
            className={cn(
              "flex items-center flex-shrink-0",
              isMobile ? "gap-1" : "gap-2"
            )}
          >
            {/* To-Do Toggle */}
            <CustomTooltip content="To-Do List" side="bottom">
              <Button
                variant="outline"
                size={isMobile ? "icon" : "sm"}
                onClick={() => setThingsToDoOpen(!thingsToDoOpen)}
                title="To-Do"
                data-tour="things-to-do"
                className={cn(isMobile && "h-9 w-9 relative")}
              >
                <div className="flex items-center gap-1">
                  <Inbox className="w-4 h-4" />
                  {!isMobile && <span className="hidden sm:inline">To-Do</span>}
                  {trip.unassignedCards && trip.unassignedCards.length > 0 && (
                    <span className={cn(
                      "text-xs font-medium rounded-full",
                      isMobile 
                        ? "absolute -top-1 -right-1 bg-primary text-primary-foreground px-1.5 py-0.5 min-w-[20px] text-center" 
                        : "pl-2"
                    )}>
                      {trip.unassignedCards.length}
                    </span>
                  )}
                </div>
              </Button>
            </CustomTooltip>

            {/* Undo/Redo - hidden on mobile, moved to dropdown */}
            {!isMobile && (
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
            )}

            {/* Discover - Icon only on mobile */}
            {!isMobile && (
              <CustomTooltip content="Discover More" side="bottom">
                <Link href="/discover" data-tour="discover-button">
                  <Button
                    variant="outline"
                    className="lg:px-3"
                  >
                    <Compass className="w-4 h-4 lg:mr-2" />
                    <span className="hidden lg:inline whitespace-nowrap">
                      Discover
                    </span>
                  </Button>
                </Link>
              </CustomTooltip>
            )}

            {/* Actions Dropdown */}
            <div className="flex items-center">
              <CustomTooltip content="More actions" side="bottom">
                <div id="actions-dropdown" className={cn(isMobile ? "block" : "lg:hidden")}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className={cn(isMobile && "h-9 w-9")}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className={cn(isMobile && "min-w-[200px]")}>
                      {isMobile && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link href="/discover" className="flex items-center">
                              <Compass className="w-4 h-4 mr-2" />
                              Discover
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              undo();
                              toast.success("Undone");
                            }}
                            disabled={!canUndo}
                          >
                            <Undo2 className="w-4 h-4 mr-2" />
                            Undo
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              redo();
                              toast.success("Redone");
                            }}
                            disabled={!canRedo}
                          >
                            <Redo2 className="w-4 h-4 mr-2" />
                            Redo
                          </DropdownMenuItem>
                        </>
                      )}
                      <ThemeMenuItems />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CustomTooltip>
            </div>

            {/* Full Actions - visible on lg+ desktop only */}
            {!isMobile && (
              <div id="full-actions" className="hidden lg:flex gap-2">
                {/* Theme Toggle */}
                <ModeToggle />
              </div>
            )}
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
