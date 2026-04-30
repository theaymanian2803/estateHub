import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAdmin } from '@/hooks/useAdmin'
import { useAuth } from '@/hooks/useAuth'
import { useSiteContent } from '@/hooks/useSiteContent'
import { cn } from '@/lib/utils'
import {
  Building,
  Building2,
  ChevronDown,
  DollarSign,
  FileText,
  Home,
  Info,
  Landmark,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Search,
  Shield,
  TreePine,
  TrendingUp,
  User,
  Users,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function MegaMenuTrigger({
  label,
  isActive,
  children,
}: {
  label: string
  isActive?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}>
      <button
        className={cn(
          'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-semibold transition-colors',
          isActive ? 'text-cyan-800' : 'text-slate-700 hover:text-slate-900'
        )}>
        {label}
        <ChevronDown
          className={cn('h-3.5 w-3.5 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div className="absolute left-1/2 top-full pt-3 -translate-x-1/2 z-50">
          <div className="min-w-[480px] rounded-lg border border-slate-200 bg-white p-5 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

function MegaMenuItem({
  to,
  icon: Icon,
  title,
  description,
  onClick,
}: {
  to: string
  icon: React.ElementType
  title: string
  description: string
  onClick?: () => void
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="group flex items-start gap-3 rounded-md p-2.5 transition-colors">
      <div className="mt-0.5 rounded-md bg-cyan-100 p-2 text-cyan-800 transition-transform group-hover:scale-105 shadow-sm">
        <Icon className="h-4.5 w-4.5 stroke-[1.5]" />
      </div>
      <div>
        <p className="text-[13px] font-semibold text-slate-900 group-hover:text-cyan-800 transition-colors">
          {title}
        </p>
        <p className="text-[11px] font-medium text-slate-600 mt-0.5">{description}</p>
      </div>
    </Link>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { isAdmin } = useAdmin()
  const { getValue } = useSiteContent()

  const siteName = getValue('navbar_site_name', 'SamirEstate')
  const logoImage = getValue('navbar_logo_image')
  const ctaText = getValue('navbar_cta_text', 'Publier une annonce')

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const isPropertyPage =
    ['/search'].includes(location.pathname) || location.pathname.startsWith('/property')
  const isCompanyPage = ['/about', '/contact', '/pricing', '/terms', '/privacy'].includes(
    location.pathname
  )

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          {logoImage ? (
            <img src={logoImage} alt={siteName} className="h-9 w-auto object-contain" />
          ) : (
            <div className="bg-slate-900 rounded-md p-2 transition-colors">
              <Building2 className="h-5 w-5 text-white stroke-[2.5]" />
            </div>
          )}
          <span className="font-display text-lg font-bold tracking-tight text-slate-950 uppercase">
            {siteName}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1.5 lg:flex">
          <Link
            to="/"
            className={cn(
              'rounded-md px-3 py-1.5 text-[13px] font-semibold transition-colors',
              location.pathname === '/' ? 'text-cyan-800' : 'text-slate-700 hover:text-slate-900'
            )}>
            Accueil
          </Link>

          <MegaMenuTrigger label="Propriétés" isActive={isPropertyPage}>
            <div className="grid grid-cols-2 gap-2">
              <MegaMenuItem
                to="/search"
                icon={Search}
                title="Tout parcourir"
                description="Explorer toutes les propriétés"
              />
              <MegaMenuItem
                to="/search?type=house"
                icon={Home}
                title="Maisons"
                description="Maisons unifamiliales"
              />
              <MegaMenuItem
                to="/search?type=apartment"
                icon={Building}
                title="Appartements"
                description="Vie urbaine"
              />
              <MegaMenuItem
                to="/search?type=condo"
                icon={Landmark}
                title="Condos"
                description="Condos modernes"
              />
              <MegaMenuItem
                to="/search?type=land"
                icon={TreePine}
                title="Terrains"
                description="Construisez votre rêve"
              />
              <MegaMenuItem
                to="/search?type=commercial"
                icon={TrendingUp}
                title="Commercial"
                description="Investissement d'entreprise"
              />
            </div>
            <div className="mt-4 border-t border-slate-200 pt-4">
              <Link
                to="/search"
                className="flex items-center gap-2 text-[12px] font-bold text-cyan-800 hover:text-cyan-900 transition-colors">
                <MapPin className="h-3.5 w-3.5 stroke-[2]" /> Voir tout sur la carte →
              </Link>
            </div>
          </MegaMenuTrigger>

          <MegaMenuTrigger label="Entreprise" isActive={isCompanyPage}>
            <div className="grid grid-cols-2 gap-2">
              <MegaMenuItem
                to="/about"
                icon={Info}
                title="À propos de nous"
                description="Notre histoire"
              />
              <MegaMenuItem
                to="/contact"
                icon={Mail}
                title="Contact"
                description="Contactez-nous"
              />
              <MegaMenuItem
                to="/pricing"
                icon={DollarSign}
                title="Tarifs"
                description="Des plans pour tous"
              />
              <MegaMenuItem
                to="/terms"
                icon={FileText}
                title="Conditions"
                description="Conditions d'utilisation"
              />
              <MegaMenuItem
                to="/privacy"
                icon={Shield}
                title="Confidentialité"
                description="Protection des données"
              />
              <MegaMenuItem
                to="/about"
                icon={Users}
                title="Notre équipe"
                description="Rencontrez l'équipe"
              />
            </div>
          </MegaMenuTrigger>
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          {user ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="p-1 font-semibold text-[13px] text-slate-700 hover:text-slate-950 transition-colors focus:bg-transparent">
                  <User className="mr-1.5 h-4 w-4 stroke-[2]" />
                  {user.user_metadata?.full_name || 'Compte'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 border border-slate-200 bg-white font-medium shadow-xl p-1.5">
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer font-semibold py-1.5 text-[13px] hover:text-cyan-800 focus:bg-transparent focus:text-cyan-800">
                  <Link to="/dashboard">Tableau de bord vendeur</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer font-semibold py-1.5 text-[13px] hover:text-cyan-800 focus:bg-transparent focus:text-cyan-800">
                    <Link to="/admin" className="flex items-center gap-2">
                      <Shield className="h-4 w-4 stroke-[1.5]" /> Panneau d'administration
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-slate-200" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer font-bold text-destructive py-1.5 text-[13px] focus:bg-transparent">
                  <LogOut className="mr-2 h-4 w-4 stroke-[2]" /> Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              className="p-1 font-semibold text-[13px] text-slate-700 hover:text-slate-950 transition-colors"
              asChild>
              <Link to="/auth">
                <LogIn className="mr-1.5 h-4 w-4 stroke-[2]" /> Se connecter
              </Link>
            </Button>
          )}
          <Button
            size="sm"
            className="bg-cyan-700 text-white hover:bg-cyan-800 rounded-md font-bold text-[12px] px-5 shadow-sm"
            asChild>
            <Link to={user ? '/dashboard' : '/auth'}>{ctaText}</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            className="text-slate-900 p-1 rounded-md transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? (
              <X className="h-6 w-6 stroke-[2.5]" />
            ) : (
              <Menu className="h-6 w-6 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden shadow-xl">
          <nav className="container mx-auto flex flex-col gap-1.5 px-4 py-5 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-2.5 text-[13px] font-semibold text-slate-900 hover:text-cyan-800 transition-colors">
              Accueil
            </Link>

            <div className="mt-3 mb-1">
              <p className="px-3 text-[11px] font-black uppercase tracking-widest text-slate-500">
                Propriétés
              </p>
            </div>
            {[
              { to: '/search', label: 'Tout parcourir' },
              { to: '/search?type=house', label: 'Maisons' },
              { to: '/search?type=apartment', label: 'Appartements' },
              { to: '/search?type=condo', label: 'Condos' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2.5 text-[13px] font-semibold text-slate-900 hover:text-cyan-800 transition-colors">
                {link.label}
              </Link>
            ))}

            <div className="mt-3 mb-1">
              <p className="px-3 text-[11px] font-black uppercase tracking-widest text-slate-500">
                Entreprise
              </p>
            </div>
            {[
              { to: '/about', label: 'À propos de nous' },
              { to: '/contact', label: 'Contact' },
              { to: '/pricing', label: 'Tarifs' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2.5 text-[13px] font-semibold text-slate-900 hover:text-cyan-800 transition-colors">
                {link.label}
              </Link>
            ))}

            <div className="mt-5 border-t border-slate-200 pt-5 flex flex-col gap-1.5">
              {user && (
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2.5 text-[13px] font-semibold text-slate-900 hover:text-cyan-800 transition-colors">
                  Mon Profil
                </Link>
              )}
              {user && (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2.5 text-[13px] font-semibold text-slate-900 hover:text-cyan-800 transition-colors">
                  Tableau de bord vendeur
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2.5 text-[13px] font-semibold text-slate-900 hover:text-cyan-800 transition-colors flex items-center gap-2">
                  <Shield className="h-4 w-4 stroke-[1.5]" /> Panneau d'administration
                </Link>
              )}
              {user ? (
                <button
                  onClick={() => {
                    handleSignOut()
                    setMobileOpen(false)
                  }}
                  className="rounded-md px-3 py-2.5 text-left text-[13px] font-bold text-destructive transition-colors">
                  Se déconnecter
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2.5 text-[13px] font-semibold text-slate-900 hover:text-cyan-800 transition-colors">
                  Se connecter
                </Link>
              )}
              <Button
                size="sm"
                className="mt-4 bg-cyan-700 text-white hover:bg-cyan-800 rounded-md font-black text-[11px] w-full"
                asChild>
                <Link to={user ? '/dashboard' : '/auth'} onClick={() => setMobileOpen(false)}>
                  {ctaText}
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
