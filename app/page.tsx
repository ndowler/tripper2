import './globals.css';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { InteractiveGradient } from '@/components/ui/interactive-gradient';
import { titleClasses, taglineClasses, ctaBtnBase } from '@/lib/styles';

export default async function Home() {
  // Check if user is authenticated
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect authenticated users to their trips page
  if (user) {
    redirect('/trips');
  }

  return (
    <main
      role="main"
      aria-label="Triplio landing"
      className="min-h-screen flex items-center justify-center relative overflow-hidden select-none"
    >
      <InteractiveGradient />

      <div className="container mx-auto px-4 z-10 pb-20">
        <header className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center">
            <h1 className={titleClasses}>Triplio</h1>
            <div className="relative w-20 h-20 sm:w-24 sm:h-24">
              <Image
                src="/tripper.png"
                alt="Triplio logo"
                fill
                sizes="90px"
                className="drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          <p className={taglineClasses}>
            Plan your dream trip in minutes, not hours
          </p>

          <nav
            aria-label="Primary"
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
          >
            <Link href="/signup" aria-label="Sign up for Triplio">
              <Button
                size="lg"
                className={`${ctaBtnBase} bg-white text-blue-600 hover:bg-white/90`}
              >
                Get Started Now
              </Button>
            </Link>

            <Link href="/login" aria-label="Log in to Triplio">
              <Button
                size="lg"
                variant="outline"
                className={`${ctaBtnBase} bg-transparent text-white border-2 border-white hover:bg-white/10`}
              >
                Login
              </Button>
            </Link>
          </nav>
        </header>
      </div>
    </main>
  );
}
