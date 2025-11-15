"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/ui/theme-toggler";
import type { Trip } from "@/lib/types";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { cn } from "@/lib/utils";

interface BackNavbarProps {
  trip?: Trip | null;
}

export function BackNavbar({ trip }: BackNavbarProps) {
  const isMobile = useIsMobile();

  return (
    <nav
      id="navbar"
      className="border-b border-white/20 bg-glass backdrop-blur-strong sticky top-0 z-10 shadow-lg"
    >
      <div id="navbar-content" className={cn(
        "container mx-auto",
        isMobile ? "px-3 py-2" : "px-4 py-3"
      )}>
        <div
          id="navbar-inner"
          className="relative flex items-center justify-between"
        >
          <div id="back-button">
            <Link href={trip?.id ? `/trip/${trip.id}` : "/trips"}>
              <Button 
                variant="ghost" 
                size="icon" 
                title="Back to trips"
                className={cn(isMobile && "h-9 w-9")}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="sr-only">Back to trips</span>
              </Button>
            </Link>
          </div>
          <div
            id="title"
            className={cn(
              "flex text-center justify-center select-none flex-1 truncate px-4",
              isMobile ? "text-base font-semibold" : "text-lg"
            )}
          >
            {trip?.title || "Trailblazer"}
          </div>
          {!isMobile && <ModeToggle />}
          {isMobile && <div className="w-9" />}{/* Spacer for centering */}
        </div>
      </div>
    </nav>
  );
}
