"use client";

import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/theme-toggler";

interface BackNavbarProps {
  tripId?: string | null;
  isHydrated: boolean;
  setIsHydrated?: (value: boolean) => void;
}

export function BackNavbar({
  tripId,
  isHydrated,
  setIsHydrated,
}: BackNavbarProps) {
  useEffect(() => {
    if (!isHydrated) {
      setIsHydrated?.(true);
    }
  }, [isHydrated, setIsHydrated]);

  if (!isHydrated) {
    return (
      <nav
        id="navbar"
        className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10"
      >
        <div id="navbar-content" className="container mx-auto px-4 py-3">
          <div
            id="navbar-inner"
            className="relative flex items-center justify-center"
          >
            <div id="back-button" className="absolute left-0">
              <Button variant="ghost" size="icon" disabled>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>
            <div
              id="title"
              className="rounded flex text-center justify-center select-none mx-auto"
            >
              Tripper
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      id="navbar"
      className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10"
    >
      <div id="navbar-content" className="container mx-auto px-4 py-3">
        <div
          id="navbar-inner"
          className="relative flex items-center justify-center"
        >
          <div id="back-button" className="absolute left-0">
            <Link href={tripId ? `/trip/${tripId}` : "/trips"}>
              <Button variant="ghost" size="icon" title="Back to trips">
                <ArrowLeft className="w-4 h-4" />
                <span className="sr-only">Back to trips</span>
              </Button>
            </Link>
          </div>
          <div
            id="title"
            className="rounded flex text-center justify-center select-none mx-auto"
          >
            Tripper
          </div>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
