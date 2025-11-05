/**
 * Mobile detection and utility functions
 */

/**
 * Check if the current device is mobile based on user agent
 * Note: This is a server-side check. For responsive design, use CSS media queries or useIsMobile hook
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // Check for mobile devices
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    userAgent.toLowerCase()
  );
}

/**
 * Check if the current device is a touch device
 */
export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
}

/**
 * Get viewport width
 */
export function getViewportWidth(): number {
  if (typeof window === "undefined") return 0;
  return window.innerWidth;
}

/**
 * Get viewport height
 */
export function getViewportHeight(): number {
  if (typeof window === "undefined") return 0;
  return window.innerHeight;
}

/**
 * Mobile breakpoints
 */
export const MOBILE_BREAKPOINTS = {
  xs: 320,  // Extra small (older phones)
  sm: 375,  // Small (iPhone SE, older iPhones)
  md: 393,  // Medium (iPhone 15, modern phones)
  lg: 430,  // Large (iPhone 15 Pro Max)
  xl: 768,  // Tablet
} as const;

/**
 * Check if viewport is within a specific mobile breakpoint
 */
export function isViewportSize(size: keyof typeof MOBILE_BREAKPOINTS): boolean {
  const width = getViewportWidth();
  return width <= MOBILE_BREAKPOINTS[size];
}

