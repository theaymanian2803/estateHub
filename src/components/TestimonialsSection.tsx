import { Star, Quote } from 'lucide-react'
import { useSiteContent } from '@/hooks/useSiteContent'

export default function TestimonialsSection() {
  const { activeTestimonials } = useSiteContent()

  if (!activeTestimonials || activeTestimonials.length === 0) return null

  return (
    <section className="relative py-24 overflow-hidden bg-background">
      {/* 1. CLEANER BACKGROUND BLOBS: Using larger, softer blurs for a premium glow rather than distinct shapes */}
      <div className="absolute -top-24 -left-24 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[100px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-caramel/5 blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* 2. REFINED HEADER: Better typography hierarchy and text contrast */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm font-semibold tracking-wide text-accent backdrop-blur-sm">
            Client Success Stories
          </span>
          <h2 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            What Our Clients{' '}
            <span className="text-gradient-chocolate block sm:inline mt-2 sm:mt-0">
              Say About Us
            </span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Real stories from real people who found their perfect property. See why thousands trust
            us with their dream homes.
          </p>
        </div>

        {/* 3. NEW GRID LAYOUT: Max-width constraint and responsive gaps */}
        <div className="mt-16 mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activeTestimonials.map((te) => (
            <div
              key={te.id}
              className="group relative flex flex-col rounded-3xl bg-background border border-border/60 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-accent/30 overflow-hidden">
              {/* Subtle hover gradient inside the card */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-transparent to-caramel/0 group-hover:from-accent/[0.03] group-hover:to-caramel/[0.03] transition-colors duration-500" />

              {/* 4. FIXED QUOTE ICON: Better positioning and color */}
              <Quote
                className="absolute right-6 top-6 h-12 w-12 text-muted-foreground/10 group-hover:text-accent/10 transition-colors duration-300"
                fill="currentColor"
              />

              <div className="relative z-10 flex flex-col h-full">
                {/* Stars Container */}
                <div className="mb-6 flex gap-1.5">
                  {Array.from({ length: te.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-amber-400 text-amber-400 drop-shadow-sm"
                    />
                  ))}
                </div>

                {/* 5. IMPROVED TYPOGRAPHY: Darker, more readable text for the quote */}
                <p className="text-base leading-relaxed text-foreground/90 flex-grow font-medium">
                  "{te.quote}"
                </p>

                {/* 6. REDESIGNED FOOTER: Separator line and high-contrast avatar */}
                <div className="mt-8 flex items-center gap-4 pt-6 border-t border-border/50">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-caramel to-chocolate font-display text-base font-bold text-white shadow-md ring-2 ring-background">
                    {te.avatar}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-bold text-foreground">{te.name}</p>
                    <p className="text-xs font-medium text-muted-foreground">{te.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
