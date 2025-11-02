"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/ui/theme-toggler";
import type { Trip } from "@/lib/types";

interface BackNavbarProps {
  trip?: Trip | null;
}

export function BackNavbar({ trip }: BackNavbarProps) {
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
            <Link href={trip?.id ? `/trip/${trip.id}` : "/trips"}>
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
            {trip?.title || "Tripper"}
          </div>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
