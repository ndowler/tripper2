import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

import {
  FeatureCard,
  FEATURES,
  GET_IN_TOUCH,
  MISSION,
  NEXT_STEPS,
  PROBLEM,
  SectionLayout,
  SOLUTION,
  STACK,
  VALUES,
} from "./aboutData";

export const metadata = {
  title: "About | Tripper",
  description: "Learn more about Tripper and our mission",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 sm:p-12">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            About Tripper
          </h1>
          <p className="text-xl text-muted-foreground mb-12">Fast, simple, and beautiful trip planning for everyone</p>

          <div className="space-y-12">
            {/* Mission Section */}
            {SectionLayout(MISSION.title, MISSION.description)}

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Problem Section */}
            {SectionLayout(PROBLEM.title, PROBLEM.description, PROBLEM.points)}

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Solution Section */}
            {SectionLayout(SOLUTION.title, SOLUTION.description, SOLUTION.points)}

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 my-12">
              {FEATURES.map((feature) => (
                <FeatureCard key={feature.title} icon={feature.icon} title={feature.title} desc={feature.desc} />
              ))}
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Values Section */}
            {SectionLayout(VALUES.title, "", VALUES.points)}

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Stack Section */}
            {SectionLayout(STACK.title, STACK.description, STACK.points)}

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Next Steps Section */}
            {SectionLayout(NEXT_STEPS.title, NEXT_STEPS.heading, NEXT_STEPS.points)}

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Get In Touch Section */}
            {SectionLayout(GET_IN_TOUCH.title, GET_IN_TOUCH.description, GET_IN_TOUCH.points)}

            {/* Social Links */}
            <div className="flex gap-4 justify-center mt-6">
              <a
                href="mailto:hello@tripper.app"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>

            {/* CTA Section */}
            <div className="mt-12 p-8 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 dark:shadow-white-500/50 shadow-md text-center">
              <p className="text-lg font-semibold mb-2">Ready to plan your next trip?</p>
              <p className="text-muted-foreground mb-6">Join travelers who are planning better trips with Tripper.</p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors font-medium shadow-md hover:shadow-lg"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
