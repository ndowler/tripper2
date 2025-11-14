import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import {
  MoreVertical,
  Redo2,
  Undo2,
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
    destination?: {
      city: string;
      state?: string;
      country?: string;
    };
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
            className="flex flex-row items-center gap-2 w-full"
          >
            {/* Left: Back button */}
            <div id="back-button" className="flex justify-start flex-shrink-0 w-[40px]">
              <Link href="/trips" className="flex items-center">
                <Image
                  src="/tripper.png"
                  alt="Tripper"
                  width={isMobile ? 28 : 32}
                  height={isMobile ? 28 : 32}
                  className="rounded-md hover:opacity-80 transition-opacity"
                  title="Back to all trips"
                />
              </Link>
            </div>

            {/* Center: Title */}
            <div id="title" className="flex-1 flex justify-center min-w-0 overflow-hidden">
              <div className="max-w-2xl w-full">
                <EditableHeader
                  tripId={trip.id}
                  title={trip.title}
                  description={trip.description}
                />
              </div>
            </div>

            {/* Right: Spacer to balance left */}
            <div className="w-[40px] flex-shrink-0" />
          </div>
          {/* Actions */}
          <div
            id="actions"
            className={cn(
              "flex items-center flex-shrink-0",
              isMobile ? "gap-1" : "gap-2"
            )}
          >
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
