import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils' // Import cn utility if not already present

// ---------------------------------------------------------------------------
// Inline SVG Icons (Replacing lucide-react, kept from previous)
// ---------------------------------------------------------------------------
const MailIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const UserIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const LockIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const UploadIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)

const SpinnerIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    className={`animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
)

const ArrowRightIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

// ---------------------------------------------------------------------------
// Custom Switch Component
// ---------------------------------------------------------------------------
interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange, ...props }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-accent' : 'bg-muted'
      )}
      onClick={() => onCheckedChange(!checked)}
      {...props}>
      <span
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  )
}

// ---------------------------------------------------------------------------
// Seller Profile Schema & Form Component
// ---------------------------------------------------------------------------
const sellerProfileSchema = z.object({
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  company: z.string().optional(),
  phone: z.string().min(10, { message: 'Invalid phone number' }),
  website: z.string().url({ message: 'Invalid URL' }).optional(),
  bio: z.string().max(500, { message: 'Bio must be less than 500 characters' }).optional(),
  showPhone: z.boolean().default(false),
  showEmail: z.boolean().default(false),
})

type SellerProfileFormValues = z.infer<typeof sellerProfileSchema>

export default function SellerProfilePage() {
  const [isLoading, setIsLoading] = useState(false)

  // Mock initial data (replace with actual data fetching)
  const initialData: SellerProfileFormValues = {
    fullName: 'samir',
    company: 'oulkhir',
    phone: '+212 691-584999',
    website: 'https://yourwebsite.com',
    bio: "With 8 years of specialized experience in the Marrakech property market, I help clients navigate the complexities of buying and selling premium houses and villas. At 30, my approach combines a modern entrepreneurial mindset with deep-rooted local knowledge of the Red City's most sought-after neighborhoods. Whether you are looking",
    showPhone: true,
    showEmail: true,
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SellerProfileFormValues>({
    resolver: zodResolver(sellerProfileSchema),
    defaultValues: initialData,
  })

  const onSubmit = async (data: SellerProfileFormValues) => {
    // CRITICAL: REMOVED CONSOLE LOGGING OF PASSWORD
    setIsLoading(true)
    try {
      // TODO: Add your Supabase Profile update logic here
      // console.log("Profile Data:", data); // REMOVE THIS OR ONLY LOG SAFE FIELDS

      // Simulating a network request
      await new Promise((resolve) => setTimeout(resolve, 1500))
    } catch (error) {
      // Handle error without console logging sensitive data
      console.error('Failed to update profile', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      {/* Restored rich background experience */}
      <div className="absolute top-20 right-20 h-24 w-24 shape-blob bg-accent/5 animate-float" />
      <div className="absolute bottom-10 left-10 h-16 w-16 shape-blob-2 bg-caramel/5 animate-float-slow" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl space-y-10 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800 relative z-10">
        {/* Top-level badge restored */}
        <div className="mx-6 mt-6 mb-8 flex items-center gap-4 rounded-xl border-2 border-latte/30 bg-white p-5 text-sm font-semibold tracking-wider text-accent neu-shadow-sm dark:bg-zinc-800/70">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cream p-2.5 text-accent-foreground dark:bg-zinc-700">
            <LockIcon className="h-6 w-6" />
          </div>
          <div>
            <span className="font-bold">Free — 0/2 listings used</span>
            <p className="mt-1 text-xs text-muted-foreground">
              Upgrade for more listings, analytics & more.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 p-8">
          {/* Main Card Section */}
          <div className="space-y-10 rounded-xl border border-border/70 bg-secondary/20 p-8 neu-card dark:bg-zinc-900">
            <div className="border-b border-latte pb-4">
              <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                Your Seller Profile
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                This information is shown to potential buyers on your listings.
              </p>
            </div>

            {/* Profile Picture Upload Section */}
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <img
                src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=800" // Replace with actual avatar URL
                alt="Seller Avatar"
                className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-elevated dark:border-zinc-800"
              />
              <button
                type="button"
                className="neu-button text-accent flex items-center gap-2 font-medium">
                <UploadIcon />
                <span>Upload Photo</span>
              </button>
            </div>

            {/* Form Fields Grid restored */}
            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-semibold leading-none text-foreground">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <input
                    {...register('fullName')}
                    placeholder="e.g. Samir Oulkhir"
                    className="neu-input pl-10 h-11 w-full rounded-xl"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-red-500">{errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold leading-none text-foreground">
                  Company / Agency
                </label>
                <input
                  {...register('company')}
                  placeholder="e.g. Red City Real Estate"
                  className="neu-input h-11 w-full rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold leading-none text-foreground">
                  Phone Number
                </label>
                <input
                  {...register('phone')}
                  placeholder="+212 6XXXXXXXX"
                  className="neu-input h-11 w-full rounded-xl"
                />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold leading-none text-foreground">
                  Website
                </label>
                <input
                  {...register('website')}
                  placeholder="https://yourwebsite.com"
                  className="neu-input h-11 w-full rounded-xl"
                />
                {errors.website && <p className="text-xs text-red-500">{errors.website.message}</p>}
              </div>
            </div>

            {/* Non-editable Email Field restored */}
            <div className="space-y-2">
              <label className="text-sm font-semibold leading-none text-foreground">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground/50">
                  <MailIcon className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value="atbohos@gmail.com"
                  disabled
                  className="neu-input pl-10 h-11 w-full rounded-xl cursor-not-allowed opacity-50 bg-latte/30"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Email is managed through your account settings
              </p>
            </div>

            {/* About / Bio Textarea restored */}
            <div className="space-y-1">
              <label className="text-sm font-semibold leading-none text-foreground">
                About / Bio
              </label>
              <textarea
                {...register('bio')}
                placeholder="Describe your experience, values and services to buyers..."
                rows={6}
                className="neu-input p-3 w-full rounded-xl"
              />
              {errors.bio && <p className="text-xs text-red-500">{errors.bio.message}</p>}
            </div>

            {/* Contact Visibility Section with Switches */}
            <div className="space-y-6 rounded-xl border border-border/70 bg-cream/30 p-8 neu-shadow-sm dark:bg-zinc-800/40">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Contact Visibility</h3>
                <p className="text-sm text-muted-foreground">
                  Choose what buyers can see on your listings
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Show phone number</span>
                <Controller
                  control={control}
                  name="showPhone"
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Show email address</span>
                <Controller
                  control={control}
                  name="showEmail"
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
            </div>
          </div>

          {/* New, Lighter Caramel Button with White Text as requested */}
          <div className="flex justify-end pt-6 border-t border-border">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-xl text-sm font-bold transition-opacity focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 gradient-caramel text-white hover:opacity-90 h-11 px-6 shadow-md">
              {isLoading ? <SpinnerIcon className="w-5 h-5 mr-2" /> : null}
              {isLoading ? 'Please wait...' : 'Save Profile'}
              {!isLoading && <ArrowRightIcon className="ml-2 h-4 w-4" />}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
