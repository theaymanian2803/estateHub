import heroBgDefault from '@/assets/hero-bg.jpg'
import { Button } from '@/components/ui/button'
import { useListingOptions } from '@/hooks/useListingOptions'
import { useSiteContent } from '@/hooks/useSiteContent'
import { ChevronDown, DollarSign, Home, MapPin, Search } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
      {/* 1. FIXED OVERLAY - Darkened for much better text contrast */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-background dark:from-black/80 dark:via-black/60 dark:to-background backdrop-blur-[2px]" />

      {/* Decorative Blobs - Swapped to standard Tailwind warm colors */}
      <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl animate-float" />
      <div className="absolute top-1/4 -right-16 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl animate-float-slow" />
      <div
        className="absolute bottom-20 left-1/4 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl animate-float"
        style={{ animationDelay: '2s' }}
      />

      <div className="relative z-10 container mx-auto px-4 text-center mt-12 transition-colors duration-300">
        <div className="animate-fade-in-up">
          {/* Badge - Cleaned up to use primary theme color */}
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-semibold text-primary-foreground dark:text-primary backdrop-blur-md shadow-sm transition-colors duration-300 text-white">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
            {getValue('hero_badge', 'Le marché n°1 des propriétés de prestige')}
          </span>
        </div>

        {/* 2. TYPOGRAPHY */}
        <h1
          className="mt-8 font-display text-5xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl animate-fade-in-up drop-shadow-sm transition-colors duration-300"
          style={{ animationDelay: '0.1s' }}>
          {getValue('hero_title_line1', 'Trouvez votre')}
          {/* Title Gradient - Swapped to a standard rich amber/orange gradient */}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 block mt-2 pb-2">
            {getValue('hero_title_line2', 'Maison de rêve')}
          </span>
        </h1>

        <p
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-200 md:text-xl animate-fade-in-up font-medium transition-colors duration-300"
          style={{ animationDelay: '0.2s' }}>
          {getValue(
            'hero_subtitle',
            'Découvrez des propriétés de prestige sélectionnées pour vous.'
          )}
        </p>

        {/* 3. CONVERSION FOCUSED SEARCH BAR: FIXED STACKING HERE */}
        <div
          className="relative z-[200] mx-auto mt-10 max-w-4xl animate-fade-in-up rounded-2xl bg-background/90 p-4 border border-border/50 shadow-2xl backdrop-blur-xl sm:p-6 transition-colors duration-300"
          style={{ animationDelay: '0.35s' }}>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {/* Search Input */}
            <div className="flex flex-1 items-center gap-3 rounded-xl bg-muted/50 px-4 py-3.5 focus-within:ring-2 focus-within:ring-primary focus-within:bg-background transition-all duration-300">
              <MapPin className="h-5 w-5 text-primary shrink-0" />
              <input
                type="text"
                placeholder="Rechercher par ville, région ou code postal…"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground font-medium transition-colors duration-300"
              />
            </div>

            {/* CUSTOM Property Type Dropdown */}
            <div
              className="relative flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3.5 hover:bg-muted/80 focus-within:ring-2 focus-within:ring-primary focus-within:bg-background transition-all duration-300 md:w-48 cursor-pointer z-50"
              onClick={() => setIsTypeOpen(!isTypeOpen)}>
              <Home className="h-5 w-5 text-primary shrink-0" />
              <div className="w-full flex items-center justify-between text-sm text-foreground font-medium select-none transition-colors duration-300">
                <span className="truncate">{selectedType || 'Tous les types'}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isTypeOpen ? 'rotate-180' : ''}`}
                />
              </div>

              {isTypeOpen && (
                <>
                  <div
                    className="fixed inset-0 z-80"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsTypeOpen(false)
                    }}
                  />

                  <div className="absolute top-[calc(100%+8px)] left-0 w-full rounded-xl bg-background border border-border/50 shadow-2xl z-[100] py-2 animate-in fade-in slide-in-from-top-2 transition-colors duration-300">
                    <div
                      className="px-4 py-2.5 text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors duration-300"
                      onClick={() => setSelectedType('')}>
                      Tous les types
                    </div>
                    {propertyTypes?.map((t) => (
                      <div
                        key={t.id}
                        className="px-4 py-2.5 text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors duration-300"
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
              className="relative flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3.5 hover:bg-muted/80 focus-within:ring-2 focus-within:ring-primary focus-within:bg-background transition-all duration-300 md:w-48 cursor-pointer z-40"
              onClick={() => setIsPriceOpen(!isPriceOpen)}>
              <DollarSign className="h-5 w-5 text-primary shrink-0" />
              <div className="w-full flex items-center justify-between text-sm text-foreground font-medium select-none transition-colors duration-300">
                <span className="truncate">{selectedPrice || 'Tous les prix'}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isPriceOpen ? 'rotate-180' : ''}`}
                />
              </div>

              {isPriceOpen && (
                <>
                  <div
                    className="fixed inset-0 z-80"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsPriceOpen(false)
                    }}
                  />

                  <div className="absolute top-[calc(100%+8px)] left-0 w-full rounded-xl bg-background border border-border/50 shadow-2xl z-[100] py-2 animate-in fade-in slide-in-from-top-2 transition-colors duration-300">
                    {[
                      { label: 'Tous les prix', value: '' },
                      { label: 'Moins de 300 000 DH', value: 'under_300' },
                      { label: '300 000 DH – 600 000 DH', value: '300_600' },
                      { label: '600 000 DH – 1M DH', value: '600_1m' },
                      { label: 'Plus de 1M DH', value: 'over_1m' },
                    ].map((p) => (
                      <div
                        key={p.label}
                        className="px-4 py-2.5 text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors duration-300"
                        onClick={() => setSelectedPrice(p.label)}>
                        {p.label}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* CTA Button - Replaced custom class with standard rich gradient */}
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-none text-white rounded-xl px-8 py-7 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 w-full md:w-auto font-bold text-base"
              onClick={() => navigate('/search')}>
              <Search className="mr-2 h-5 w-5" /> Rechercher
            </Button>
          </div>
        </div>

        {/* 4. TRUST BADGES */}
        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 animate-fade-in-up"
          style={{ animationDelay: '0.5s' }}>
          {['Vendeurs vérifiés', 'Transactions sécurisées', 'Navigation gratuite'].map((badge) => (
            <span
              key={badge}
              className="flex items-center gap-2 text-sm font-medium text-slate-300 drop-shadow-sm transition-colors duration-300">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-xs text-emerald-400">
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
