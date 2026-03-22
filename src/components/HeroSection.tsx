import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Home, DollarSign, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSiteContent } from '@/hooks/useSiteContent'
import { useListingOptions } from '@/hooks/useListingOptions'
import heroBgDefault from '@/assets/hero-bg.jpg'

export default function HeroSection() {
  const navigate = useNavigate()
  const [location, setLocation] = useState('')

  // New state for custom dropdowns
  const [selectedType, setSelectedType] = useState('')
  const [isTypeOpen, setIsTypeOpen] = useState(false)
  const [selectedPrice, setSelectedPrice] = useState('')
  const [isPriceOpen, setIsPriceOpen] = useState(false)

  const { getValue } = useSiteContent()
  const { getByCategory } = useListingOptions()

  const propertyTypes = getByCategory('property_type')
  const heroBg = getValue('hero_bg_image') || heroBgDefault

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background transition-colors duration-300">
      {/* 1. FIXED OVERLAY */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/45 via-background/20 to-background dark:from-background/70 dark:via-background/50 dark:to-background backdrop-blur-[2px]" />

      {/* Decorative Blobs */}
      <div className="absolute -top-20 -left-20 h-80 w-80 shape-blob bg-accent/10 blur-3xl animate-float" />
      <div className="absolute top-1/4 -right-16 h-64 w-64 shape-blob-2 bg-caramel/15 blur-3xl animate-float-slow" />
      <div
        className="absolute bottom-20 left-1/4 h-48 w-48 shape-blob-3 bg-chocolate-light/15 blur-3xl animate-float"
        style={{ animationDelay: '2s' }}
      />

      <div className="relative z-10 container mx-auto px-4 text-center mt-12 transition-colors duration-300">
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-5 py-2 text-sm font-semibold text-accent backdrop-blur-sm shadow-sm transition-colors duration-300">
            <span className="h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
            {getValue('hero_badge', 'The #1 Marketplace for Premium Properties')}
          </span>
        </div>

        {/* 2. TYPOGRAPHY */}
        <h1
          className="mt-8 font-display text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl animate-fade-in-up drop-shadow-sm transition-colors duration-300"
          style={{ animationDelay: '0.1s' }}>
          {getValue('hero_title_line1', 'Find Your Perfect')}
          <span className="text-gradient-chocolate block mt-2 pb-2">
            {getValue('hero_title_line2', 'Dream Home')}
          </span>
        </h1>

        <p
          className="mx-auto mt-6 max-w-2xl text-lg text-foreground/80 md:text-xl animate-fade-in-up font-medium transition-colors duration-300"
          style={{ animationDelay: '0.2s' }}>
          {getValue('hero_subtitle', 'Discover premium properties curated for you.')}
        </p>

        {/* 3. CONVERSION FOCUSED SEARCH BAR: FIXED STACKING HERE */}
        <div
          // Added 'relative z-[200]' to ensure the whole search experience floats on top
          className="relative z-[200] mx-auto mt-10 max-w-4xl animate-fade-in-up rounded-2xl bg-background/95 p-4 border border-border/50 shadow-2xl backdrop-blur-md sm:p-6 transition-colors duration-300"
          style={{ animationDelay: '0.35s' }}>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {/* Search Input */}
            <div className="flex flex-1 items-center gap-3 rounded-xl bg-muted/50 px-4 py-3.5 focus-within:ring-2 focus-within:ring-accent focus-within:bg-background transition-all duration-300">
              <MapPin className="h-5 w-5 text-accent shrink-0" />
              <input
                type="text"
                placeholder="Search by city, state, or ZIP…"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground font-medium transition-colors duration-300"
              />
            </div>

            {/* CUSTOM Property Type Dropdown */}
            <div
              className="relative flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3.5 focus-within:ring-2 focus-within:ring-accent focus-within:bg-background transition-all duration-300 md:w-48 cursor-pointer z-50"
              onClick={() => setIsTypeOpen(!isTypeOpen)}>
              <Home className="h-5 w-5 text-accent shrink-0" />
              <div className="w-full flex items-center justify-between text-sm text-foreground font-medium select-none transition-colors duration-300">
                <span className="truncate">{selectedType || 'All Types'}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isTypeOpen ? 'rotate-180' : ''}`}
                />
              </div>

              {isTypeOpen && (
                <>
                  {/* Invisible overlay to close dropdown when clicking outside */}
                  <div
                    className="fixed inset-0 z-80"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsTypeOpen(false)
                    }}
                  />

                  <div className="absolute top-[calc(100%+8px)] left-0 w-full rounded-xl bg-background border border-border/50 shadow-2xl z-[100] py-2 animate-in fade-in slide-in-from-top-2 transition-colors duration-300">
                    <div
                      className="px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent/10 hover:text-accent cursor-pointer transition-colors duration-300"
                      onClick={() => setSelectedType('')}>
                      All Types
                    </div>
                    {propertyTypes?.map((t) => (
                      <div
                        key={t.id}
                        className="px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent/10 hover:text-accent cursor-pointer transition-colors duration-300"
                        onClick={() => setSelectedType(t.value)}>
                        {t.value}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* CUSTOM Price Dropdown */}
            <div
              className="relative flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3.5 focus-within:ring-2 focus-within:ring-accent focus-within:bg-background transition-all duration-300 md:w-48 cursor-pointer z-40"
              onClick={() => setIsPriceOpen(!isPriceOpen)}>
              <DollarSign className="h-5 w-5 text-accent shrink-0" />
              <div className="w-full flex items-center justify-between text-sm text-foreground font-medium select-none transition-colors duration-300">
                <span className="truncate">{selectedPrice || 'Any Price'}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isPriceOpen ? 'rotate-180' : ''}`}
                />
              </div>

              {isPriceOpen && (
                <>
                  {/* Invisible overlay to close dropdown when clicking outside */}
                  <div
                    className="fixed inset-0 z-80"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsPriceOpen(false)
                    }}
                  />

                  <div className="absolute top-[calc(100%+8px)] left-0 w-full rounded-xl bg-background border border-border/50 shadow-2xl z-[100] py-2 animate-in fade-in slide-in-from-top-2 transition-colors duration-300">
                    {[
                      { label: 'Any Price', value: '' },
                      { label: 'Under $300K', value: 'under_300' },
                      { label: '$300K – $600K', value: '300_600' },
                      { label: '$600K – $1M', value: '600_1m' },
                      { label: '$1M+', value: 'over_1m' },
                    ].map((p) => (
                      <div
                        key={p.label}
                        className="px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent/10 hover:text-accent cursor-pointer transition-colors duration-300"
                        onClick={() => setSelectedPrice(p.label)}>
                        {p.label}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* CTA Button */}
            <Button
              size="lg"
              className="gradient-caramel text-white hover:opacity-90 rounded-xl px-8 py-7 shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto font-bold text-base"
              onClick={() => navigate('/search')}>
              <Search className="mr-2 h-5 w-5" /> Search
            </Button>
          </div>
        </div>

        {/* 4. TRUST BADGES */}
        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 animate-fade-in-up"
          style={{ animationDelay: '0.5s' }}>
          {['Verified Sellers', 'Secure Transactions', 'Free to Browse'].map((badge) => (
            <span
              key={badge}
              className="flex items-center gap-2 text-sm font-medium text-foreground/70 transition-colors duration-300">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/15 text-xs text-green-600 dark:text-green-400">
                ✓
              </span>
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
