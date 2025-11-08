import { Heart, Users, Zap } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Feature card data
const FEATURES = [
  {
    icon: <Zap className="w-12 h-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />,
    title: "Speed First",
    desc: "Every interaction is instant. No loading spinners, ever.",
  },
  {
    icon: <Users className="w-12 h-12 mx-auto mb-4 text-indigo-600 dark:text-indigo-400" />,
    title: "Built for Travelers",
    desc: "Designed with real travelers, not travel agents.",
  },
  {
    icon: <Heart className="w-12 h-12 mx-auto mb-4 text-pink-600 dark:text-pink-400" />,
    title: "Made with Love",
    desc: "Crafted with attention to every detail and interaction.",
  },
];

const MISSION = {
  title: "Our Mission",
  description:
    "Travel planning should be exciting, not exhausting. We built Tripper to make organizing your dream trips as fast and enjoyable as planning them in your head.",
};

const PROBLEM = {
  title: "The Problem We're Solving",
  description: "Planning trips today is often:",
  points: {
    tooSlow: { heading: "Too Slow", description: "Cloud-dependent with laggy interfaces and loading spinners" },
    tooComplex: { heading: "Too Complex", description: "Packed with features you'll never use" },
    tooRigid: { heading: "Too Rigid", description: "Force you into templates instead of letting you plan your way" },
    tooExpensive: { heading: "Too Expensive", description: "Charge $50+ per trip or require subscriptions" },
  },
};
const SOLUTION = {
  title: "Our Solution",
  description: "Tripper is different. We're building a trip planner that feels like using Linear or Notion:",
  points: {
    lightningFast: { heading: "Lightning Fast", description: "Offline-first with zero latency" },
    keyboardDriven: { heading: "Keyboard Driven", description: "Press Cmd+K to do anything" },
    flexible: { heading: "Flexible", description: "Use templates, AI, or start from scratch" },
    freeForever: { heading: "Free Forever", description: "Core features are free, no paywalls" },
  },
};

const VALUES = {
  title: "Our Values",
  points: {
    speedAboveAll: {
      heading: "Speed Above All",
      description:
        "We believe software should be fast. Not 'pretty fast' or 'fast enough' — actually fast. Every interaction in Tripper takes less than 100ms.",
    },
    simplicityOverFeatures: {
      heading: "Simplicity Over Features",
      description:
        "More features don't make better products. We focus on doing a few things exceptionally well rather than many things poorly. Every feature must earn its place.",
    },
    userOwnership: {
      heading: "User Ownership",
      description:
        "Your trips are yours. We don't sell your data. We don't lock you in. Export your data anytime in standard formats. Delete your account with one click.",
    },
    developerExperience: {
      heading: "Developer Experience",
      description:
        "Built by developers, for people who appreciate great software. We use modern tools, write clean code, and embrace keyboard-first workflows.",
    },
  },
};

const STACK = {
  title: "Our Stack",
  description: "We believe in using the right tools for the job. Tripper is built with:",
  points: {
    framework: {
      heading: "NextJS 15",
      description: "React framework with App Router.",
    },
    typescript: {
      heading: "TypeScript",
      description: "Type safety and developer experience.",
    },
    supabase: {
      heading: "Supabase",
      description: "PostgreSQL for reliable and scalable data storage.",
    },
    tailwind: {
      heading: "Tailwind CSS",
      description: "Utility-first styling for rapid UI development.",
    },
    openai: {
      heading: "OpenAI",
      description: "GPT-4o-mini for AI suggestions and enhancements.",
    },
    dndkit: {
      heading: "DndKit",
      description: "Drag-and-drop library for building complex interfaces.",
    },
  },
};

const NEXT_STEPS = {
  title: "What's Next",
  heading: "We're just getting started. Here's what's coming:",
  points: {
    rtc: { heading: "Real-Time Collaboration", description: "Plan trips with friends." },
    mobileApps: { heading: "Mobile Apps", description: "Native iOS and Android apps." },
    smartBooking: { heading: "Smart Booking", description: "Integrated booking with best price guarantees." },
    mapIntegration: { heading: "Map Integration", description: "Visualize your itinerary on a map." },
    budgetTracking: { heading: "Budget Tracking", description: "Track spending and stay on budget." },
  },
};

const GET_IN_TOUCH = {
  title: "Get In Touch",
  description: "We'd love to hear from you! Whether you have feedback, questions, or just want to say hi:",
  points: {
    email: {
      heading: "Email",
      description: (
        <a href="mailto:hello@tripper.app" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
          hello@tripper.app
        </a>
      ),
    },
    support: {
      heading: "Support",
      description: (
        <a href="mailto:support@tripper.app" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
          support@tripper.app
        </a>
      ),
    },
  },
};

const ABOUT_TEAM = {
  title: "Our Team",
  description: "Built by people who love travel and great software.",
  points: {
    // Add team members as needed
    hiring: {
      heading: "We're Hiring",
      description: "Interested in joining us? We'd love to hear from you.",
    },
  },
};

const sectionConfig = {
  mission: { color: "blue", icon: "🎯" },
  problem: { color: "red", icon: "⚠️" },
  solution: { color: "green", icon: "✨" },
  values: { color: "purple", icon: "💎" },
  stack: { color: "indigo", icon: "🛠️" },
  nextSteps: { color: "orange", icon: "🚀" },
  getInTouch: { color: "pink", icon: "💬" },
};

// Feature card component
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="text-center p-6 rounded-lg border bg-card border-gray-600">
      {icon}
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

// Function to render a list of points
function SectionPoints(points: Record<string, { heading: string; description: React.ReactNode }>) {
  return (
    <ul>
      {Object.entries(points).map(([key, value]) => (
        <li className="mb-2" key={key}>
          <strong> - {value.heading}:</strong> {value.description}
        </li>
      ))}
    </ul>
  );
}

// Function to render a section with title, description, and points
function SectionLayout(
  title: string,
  description: string | React.ReactNode,
  points?: Record<string, { heading: string; description: string | React.ReactNode }>
) {
  return (
    <Card className="p-2 mb-4 border-gray-600 shadow-md dark:shadow-white-500/50 shadow-gray-600">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{description}</p>
        {points && SectionPoints(points)}
      </CardContent>
    </Card>
  );
}

export {
  FEATURES,
  MISSION,
  PROBLEM,
  SOLUTION,
  VALUES,
  STACK,
  NEXT_STEPS,
  GET_IN_TOUCH,
  ABOUT_TEAM,
  sectionConfig,
  FeatureCard,
  SectionPoints,
  SectionLayout,
};
