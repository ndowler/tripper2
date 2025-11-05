"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect if the current viewport is mobile size
 * @param breakpoint - Maximum width to consider as mobile (default: 768px)
 * @returns boolean indicating if viewport is mobile size
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Initial check
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    checkMobile();

    // Listen for resize events
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  // Return false during SSR to prevent hydration mismatch
  // After mount, return actual mobile state
  return mounted ? isMobile : false;
}

