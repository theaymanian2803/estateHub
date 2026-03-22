import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSiteContent } from '@/hooks/useSiteContent'

export default function CtaSection() {
  const { getValue } = useSiteContent()

  const benefits = ['No hidden fees', 'Cancel anytime', '24/7 Support', 'Verified listings']

  return (
    <section className="relative py-24 bg-background overflow-hidden transition-colors duration-300">
      {/* 1. THEME-REACTIVE AMBIENT GLOW: Subtle in light mode, richer in dark mode */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] bg-accent/10 dark:bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* 2. REACTIVE CARD: Crisp white in light mode, deep zinc in dark mode */}
        <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-white dark:bg-zinc-900/80 px-6 py-16 sm:p-20 text-center relative overflow-hidden shadow-2xl dark:shadow-none border border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
          {/* Internal glows that adapt their opacity based on the theme */}
          <div className="absolute -top-32 -right-32 h-[400px] w-[400px] rounded-full bg-caramel/10 dark:bg-caramel/20 blur-[100px] pointer-events-none transition-opacity" />
          <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-accent/10 dark:bg-accent/20 blur-[100px] pointer-events-none transition-opacity" />

          <div className="relative z-10 flex flex-col items-center">
            {/* 3. ADAPTIVE TYPOGRAPHY: Dark text in light mode, white text in dark mode. The gradient shifts for perfect contrast. */}
            <h2 className="font-display text-4xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl md:text-6xl tracking-tight transition-colors">
              {getValue('cta_title_line1', 'Ready to Find Your')}
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-caramel to-orange-600 dark:from-amber-200 dark:to-caramel drop-shadow-sm">
                {getValue('cta_title_line2', 'Perfect Property?')}
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-300 sm:text-xl leading-relaxed transition-colors">
              {getValue(
                'cta_subtitle',
                'Join thousands of satisfied buyers and sellers. Start your journey with the #1 premium real estate marketplace today.'
              )}
            </p>

            {/* 4. ADAPTIVE BENEFITS: Icons and text shift colors for readability */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {benefits.map((b) => (
                <span
                  key={b}
                  className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors">
                  <CheckCircle2 className="h-5 w-5 text-caramel dark:text-amber-400 drop-shadow-sm" />
                  {b}
                </span>
              ))}
            </div>

            {/* 5. INVERTING BUTTONS: The primary button flips from Dark (light mode) to Light (dark mode) to guarantee it pops off the card */}
            <div className="mt-12 flex flex-col w-full sm:w-auto sm:flex-row items-center gap-4 justify-center">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 rounded-full px-8 py-6 text-base font-bold shadow-xl transition-all hover:scale-105"
                asChild>
                <Link to="/pricing">
                  View Plans <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-zinc-300 bg-zinc-50/50 text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-white dark:hover:bg-zinc-800 rounded-full px-8 py-6 text-base font-semibold backdrop-blur-sm transition-all"
                asChild>
                <Link to="/auth">Create Free Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
