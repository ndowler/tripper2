import Link from 'next/link'
import { ArrowLeft, Heart, Zap, Users } from 'lucide-react'

export const metadata = {
  title: 'About | Trailblazer',
  description: 'Learn more about Trailblazer and our mission',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 sm:p-12">
          <h1 className="text-4xl font-bold mb-4">About Trailblazer</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Fast, simple, beautiful trip planning for everyone
          </p>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h2>Our Mission</h2>
            <p>
              Travel planning should be exciting, not exhausting. We built Trailblazer to make organizing your dream trips 
              as fast and enjoyable as planning them in your head.
            </p>

            <h2>The Problem We're Solving</h2>
            <p>
              Existing trip planners are slow, bloated, and overcomplicated. They're either:
            </p>
            <ul>
              <li><strong>Too slow:</strong> Cloud-dependent with laggy interfaces and loading spinners</li>
              <li><strong>Too complex:</strong> Packed with features you'll never use</li>
              <li><strong>Too rigid:</strong> Force you into templates instead of letting you plan your way</li>
              <li><strong>Too expensive:</strong> Charge $50+ per trip or require subscriptions</li>
            </ul>

            <h2>Our Solution</h2>
            <p>
              Trailblazer is different. We're building a trip planner that feels like using Linear or Notion:
            </p>
            <ul>
              <li><strong>Lightning fast:</strong> Offline-first with zero latency</li>
              <li><strong>Keyboard-driven:</strong> Press Cmd+K to do anything</li>
              <li><strong>Flexible:</strong> Use templates, AI, or start from scratch</li>
              <li><strong>Free forever:</strong> Core features are free, no paywalls</li>
            </ul>

            <div className="grid md:grid-cols-3 gap-6 my-8">
              <div className="text-center p-6 rounded-lg border bg-card">
                <Zap className="w-12 h-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold mb-2">Speed First</h3>
                <p className="text-sm text-muted-foreground">
                  Every interaction is instant. No loading spinners, ever.
                </p>
              </div>
              <div className="text-center p-6 rounded-lg border bg-card">
                <Users className="w-12 h-12 mx-auto mb-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-semibold mb-2">Built for Travelers</h3>
                <p className="text-sm text-muted-foreground">
                  Designed with real travelers, not travel agents.
                </p>
              </div>
              <div className="text-center p-6 rounded-lg border bg-card">
                <Heart className="w-12 h-12 mx-auto mb-4 text-pink-600 dark:text-pink-400" />
                <h3 className="font-semibold mb-2">Made with Love</h3>
                <p className="text-sm text-muted-foreground">
                  Crafted with attention to every detail and interaction.
                </p>
              </div>
            </div>

            <h2>Our Values</h2>
            <h3>1. Speed Above All</h3>
            <p>
              We believe software should be fast. Not "pretty fast" or "fast enough" — actually fast. Every interaction 
              in Trailblazer takes less than 100ms. No loading spinners. No waiting. Just instant.
            </p>

            <h3>2. Simplicity Over Features</h3>
            <p>
              More features don't make better products. We focus on doing a few things exceptionally well rather than 
              many things poorly. Every feature must earn its place.
            </p>

            <h3>3. User Ownership</h3>
            <p>
              Your trips are yours. We don't sell your data. We don't lock you in. Export your data anytime in standard 
              formats. Delete your account with one click.
            </p>

            <h3>4. Developer Experience</h3>
            <p>
              Built by developers, for people who appreciate great software. We use modern tools, write clean code, 
              and embrace keyboard-first workflows.
            </p>

            <h2>Our Stack</h2>
            <p>
              We believe in using the right tools for the job. Trailblazer is built with:
            </p>
            <ul>
              <li><strong>Next.js 15:</strong> React framework with App Router</li>
              <li><strong>TypeScript:</strong> Type safety and developer experience</li>
              <li><strong>Supabase:</strong> PostgreSQL with real-time subscriptions</li>
              <li><strong>Tailwind CSS:</strong> Utility-first styling</li>
              <li><strong>OpenAI:</strong> GPT-4o-mini for AI suggestions</li>
              <li><strong>dnd-kit:</strong> Beautiful drag and drop interactions</li>
            </ul>

            <h2>What's Next</h2>
            <p>
              We're just getting started. Here's what's coming:
            </p>
            <ul>
              <li><strong>Real-time collaboration:</strong> Plan trips with friends</li>
              <li><strong>Mobile apps:</strong> Native iOS and Android apps</li>
              <li><strong>Smart booking:</strong> Integrated booking with best price guarantees</li>
              <li><strong>Map integration:</strong> Visualize your itinerary on a map</li>
              <li><strong>Budget tracking:</strong> Track spending and stay on budget</li>
            </ul>

            <h2>Get In Touch</h2>
            <p>
              We'd love to hear from you! Whether you have feedback, questions, or just want to say hi:
            </p>
            <ul>
              <li>Email: <a href="mailto:hello@trailblazer.app" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">hello@trailblazer.app</a></li>
              <li>Support: <a href="mailto:support@trailblazer.app" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">support@trailblazer.app</a></li>
            </ul>

            <div className="mt-12 p-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-lg font-medium mb-2">Ready to plan your next trip?</p>
              <p className="text-muted-foreground mb-4">
                Join thousands of travelers who are planning better trips with Trailblazer.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

