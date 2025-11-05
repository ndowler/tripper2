import { Step } from "react-joyride";

export const TOUR_STEPS: Step[] = [
  {
    target: "body",
    content: "Welcome to your first trip! Let's show you how Triplio makes planning effortless.",
    placement: "center",
    disableBeacon: true,
    hideCloseButton: true,
    spotlightClicks: false,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    target: '[data-tour="add-day-button"]',
    content: "Every trip needs days. Click the 'Add Day' button to create your first day.",
    placement: "bottom",
    disableBeacon: true,
    spotlightClicks: true,
    hideBackButton: false,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    target: '[data-tour="add-card-button"]',
    content: "Now add your first activity! Click the '+' button to see all 9 card types: activities, meals, flights, hotels, and more.",
    placement: "right",
    disableBeacon: true,
    spotlightClicks: true,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    target: '[data-tour="card-detail-modal"]',
    content: "Fill in as much or as little detail as you want. Add times, locations, costs, notes, and more. Everything is optional except the title!",
    placement: "center",
    disableBeacon: true,
    spotlightClicks: false,
    styles: {
      options: {
        zIndex: 10001, // Higher than modal backdrop
      },
    },
  },
  {
    target: '[data-tour="drag-handle"]',
    content: "Drag cards to reorder them within a day, or move them to different days. You can also drag day columns to reorder your timeline!",
    placement: "right",
    disableBeacon: true,
    spotlightClicks: false,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    target: '[data-tour="command-palette"]',
    content: "Power user tip: Press Cmd+K (or Ctrl+K) anytime to quickly add cards from 25+ templates. It's the fastest way to build your itinerary!",
    placement: "bottom",
    disableBeacon: true,
    spotlightClicks: false,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    target: '[data-tour="discover-button"]',
    content: "Need inspiration? Click 'Discover' to get AI-powered suggestions for your destination. It learns from your travel preferences!",
    placement: "bottom",
    disableBeacon: true,
    spotlightClicks: false,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    target: '[data-tour="things-to-do"]',
    content: "Store unscheduled activities here in 'Things to Do'. When you're ready, just drag them to any day. Perfect for flexible planning!",
    placement: "left",
    disableBeacon: true,
    spotlightClicks: false,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    target: "body",
    content: "🎉 You're all set! You've learned the essentials. Now go plan an amazing trip!",
    placement: "center",
    disableBeacon: true,
    hideBackButton: true,
    hideCloseButton: true,
    spotlightClicks: false,
    locale: {
      last: "Start Planning!",
    },
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
];

export const TOUR_STYLES = {
  options: {
    arrowColor: "hsl(var(--popover))",
    backgroundColor: "hsl(var(--popover))",
    primaryColor: "hsl(var(--primary))",
    textColor: "hsl(var(--popover-foreground))",
    overlayColor: "rgba(0, 0, 0, 0.7)",
    spotlightShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
    beaconSize: 36,
    zIndex: 10000,
  },
  tooltip: {
    borderRadius: "0.5rem",
    padding: "1rem",
  },
  tooltipContent: {
    padding: "0.5rem 0",
  },
  buttonNext: {
    backgroundColor: "hsl(var(--primary))",
    borderRadius: "0.375rem",
    color: "hsl(var(--primary-foreground))",
    fontSize: "0.875rem",
    padding: "0.5rem 1rem",
  },
  buttonBack: {
    color: "hsl(var(--muted-foreground))",
    marginRight: "0.5rem",
  },
  buttonSkip: {
    color: "hsl(var(--muted-foreground))",
    fontSize: "0.875rem",
  },
  buttonClose: {
    display: "none",
  },
};

export const TOUR_LOCALE = {
  back: "Back",
  close: "Close",
  last: "Finish",
  next: "Next",
  open: "Open the dialog",
  skip: "Skip tour",
};

