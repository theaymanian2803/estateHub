import { Building2, Mail, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()

  const footerLinks = {
    explore: [
      { label: t('footer.browseProperties') || 'Browse Properties', to: '/search' },
      { label: t('footer.sellerPlans') || 'Seller Plans', to: '/pricing' },
      { label: t('footer.listProperty') || 'List Property', to: '/dashboard' },
    ],
    company: [
      { label: t('footer.aboutUs') || 'About Us', to: '/about' },
      { label: t('footer.contact') || 'Contact', to: '/contact' },
      { label: t('footer.careers') || 'Careers', to: '/about' },
    ],
    legal: [
      { label: t('footer.privacyPolicy') || 'Privacy Policy', to: '/privacy' },
      { label: t('footer.termsOfService') || 'Terms of Service', to: '/terms' },
    ],
  }

  return (
    <footer className="bg-[#FAF7F2] dark:bg-[#1A120E] transition-colors duration-300 relative overflow-hidden">
      {/* Subtle background glow for texture (Safely inside the footer element) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] bg-caramel/5 dark:bg-caramel/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10 flex flex-col items-center text-center">
        {/* 1. CENTERED BRAND & LOGO */}
        <Link to="/" className="flex flex-col items-center gap-5 group">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4A373] to-[#8B5A2B] dark:from-[#C48B54] dark:to-[#6B4423] shadow-lg transition-transform duration-300 group-hover:-translate-y-1">
            <Building2 className="h-8 w-8 text-[#FAF7F2]" />
          </div>
          <span className="font-display text-3xl font-bold tracking-tight text-[#4A3B32] dark:text-[#EAE0D5]">
            EstateHub
          </span>
        </Link>

        <p className="mt-6 max-w-md text-base leading-relaxed text-[#8A7360] dark:text-[#A8988C]">
          {t('footer.description') ||
            'The premier marketplace for finding, buying, and selling premium real estate worldwide.'}
        </p>

        {/* CENTERED CONTACT INFO */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          <a
            href="mailto:hello@estatehub.com"
            className="group flex items-center gap-2.5 text-sm font-medium text-[#8A7360] hover:text-[#8B5A2B] dark:text-[#A8988C] dark:hover:text-[#D4A373] transition-colors">
            <Mail className="h-4 w-4 transition-transform group-hover:scale-110" />
            hello@estatehub.com
          </a>
          <a
            href="tel:+18001234567"
            className="group flex items-center gap-2.5 text-sm font-medium text-[#8A7360] hover:text-[#8B5A2B] dark:text-[#A8988C] dark:hover:text-[#D4A373] transition-colors">
            <Phone className="h-4 w-4 transition-transform group-hover:scale-110" />
            1-800-123-4567
          </a>
        </div>

        {/* ELEGANT DIVIDER */}
        <div className="my-16 h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-[#D4A373]/30 dark:via-[#D4A373]/20 to-transparent" />

        {/* 2. CENTERED LINKS GRID */}
        <div className="grid w-full max-w-4xl grid-cols-1 gap-12 sm:grid-cols-3">
          {[
            { title: t('footer.explore') || 'Explore', links: footerLinks.explore },
            { title: t('footer.company') || 'Company', links: footerLinks.company },
            { title: t('footer.legal') || 'Legal', links: footerLinks.legal },
          ].map((section) => (
            <div key={section.title} className="flex flex-col items-center">
              <h4 className="mb-6 font-display text-sm font-bold tracking-widest uppercase text-[#4A3B32] dark:text-[#EAE0D5]">
                {section.title}
              </h4>
              <ul className="flex flex-col items-center space-y-4">
                {section.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-base font-medium text-[#8A7360] transition-colors hover:text-[#8B5A2B] dark:text-[#A8988C] dark:hover:text-[#D4A373]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 3. CENTERED BOTTOM BAR */}
        <div className="mt-20 flex w-full flex-col items-center gap-6 pt-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            <Link
              to="/privacy"
              className="text-[#8A7360] hover:text-[#4A3B32] dark:text-[#A8988C] dark:hover:text-[#EAE0D5] transition-colors">
              {t('footer.privacy') || 'Privacy Policy'}
            </Link>
            <span className="text-[#D4A373]/50">•</span>
            <Link
              to="/terms"
              className="text-[#8A7360] hover:text-[#4A3B32] dark:text-[#A8988C] dark:hover:text-[#EAE0D5] transition-colors">
              {t('footer.terms') || 'Terms of Service'}
            </Link>
            <span className="text-[#D4A373]/50">•</span>
            <Link
              to="/sitemap"
              className="text-[#8A7360] hover:text-[#4A3B32] dark:text-[#A8988C] dark:hover:text-[#EAE0D5] transition-colors">
              Sitemap
            </Link>
          </div>

          <p className="text-sm text-[#8A7360]/80 dark:text-[#A8988C]/60">
            © {new Date().getFullYear()} EstateHub.{' '}
            {t('footer.allRightsReserved') || 'All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  )
}
