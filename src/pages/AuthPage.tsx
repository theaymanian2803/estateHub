import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'

// ---------------------------------------------------------------------------
// Inline SVG Icons
// ---------------------------------------------------------------------------
const UserIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const MailIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const LockIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const EyeIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
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

const ArrowLeftIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
)

// ---------------------------------------------------------------------------
// Schema & Component
// ---------------------------------------------------------------------------
const authSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
})

type AuthFormValues = z.infer<typeof authSchema>

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const { signIn, signUp } = useAuth()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
  })

  const onSubmit = async (data: AuthFormValues) => {
    clearErrors()
    setIsLoading(true)

    try {
      if (isLogin) {
        // --- SIGN IN FLOW ---
        const { error } = await signIn(data.email, data.password)
        if (error) throw error

        navigate('/')
      } else {
        // --- SIGN UP FLOW ---
        if (!data.fullName || data.fullName.trim().length < 2) {
          setError('fullName', { message: 'Full name is required to sign up' })
          setIsLoading(false)
          return
        }

        const { error } = await signUp(data.email, data.password, data.fullName)
        if (error) throw error

        toast({
          title: 'Account created!',
          description: 'Welcome! You can now log in with your credentials.',
        })
        setIsLogin(true)
      }
    } catch (error: any) {
      toast({
        title: 'Authentication Error',
        description: error.message || 'Something went wrong.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    clearErrors()
  }

  return (
    <div className="flex min-h-screen bg-[#FDFBF7]">
      {/* LEFT SIDE: Form Section */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16 xl:px-24">
        {/* Back to Home Link */}
        <div className="absolute top-6 left-6 lg:top-8 lg:left-12">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-[#7A6354] hover:text-[#4A3525] transition-colors">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="mx-auto w-full max-w-[420px]">
          <div className="mb-10">
            <h2 className="font-display text-4xl font-bold text-[#3E2723] tracking-tight">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="mt-3 text-[15px] text-[#7A6354]">
              {isLogin
                ? 'Enter your credentials to access your estate portfolio.'
                : 'Sign up to discover exclusive properties and manage your listings.'}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* CONDITIONAL FULL NAME INPUT */}
            {!isLogin && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label className="text-sm font-semibold text-[#5D432F]">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#A68A78]">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <input
                    {...register('fullName')}
                    type="text"
                    placeholder="e.g. Samir Oulkhir"
                    className="flex h-12 w-full rounded-xl border border-[#E8DFD8] bg-white px-3 py-2 pl-12 text-[#3E2723] placeholder:text-[#CBBBB0] focus:outline-none focus:ring-2 focus:ring-[#8D6E5A] focus:border-transparent transition-all shadow-sm"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs font-medium text-red-500">{errors.fullName.message}</p>
                )}
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#5D432F]">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#A68A78]">
                  <MailIcon className="w-5 h-5" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="flex h-12 w-full rounded-xl border border-[#E8DFD8] bg-white px-3 py-2 pl-12 text-[#3E2723] placeholder:text-[#CBBBB0] focus:outline-none focus:ring-2 focus:ring-[#8D6E5A] focus:border-transparent transition-all shadow-sm"
                />
              </div>
              {errors.email && (
                <p className="text-xs font-medium text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#5D432F]">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#A68A78]">
                  <LockIcon className="w-5 h-5" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="flex h-12 w-full rounded-xl border border-[#E8DFD8] bg-white px-3 py-2 pl-12 pr-12 text-[#3E2723] placeholder:text-[#CBBBB0] focus:outline-none focus:ring-2 focus:ring-[#8D6E5A] focus:border-transparent transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#A68A78] hover:text-[#5D432F] focus:outline-none transition-colors">
                  {showPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#4A3525] px-4 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#322318] focus:outline-none focus:ring-2 focus:ring-[#4A3525] focus:ring-offset-2 focus:ring-offset-[#FDFBF7] disabled:opacity-70 disabled:pointer-events-none">
              {isLoading ? <SpinnerIcon className="mr-2 h-5 w-5" /> : null}
              {isLoading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Footer Toggle */}
          <div className="mt-8 text-center text-sm text-[#7A6354]">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={toggleMode}
              className="font-bold text-[#4A3525] hover:underline hover:text-[#322318] focus:outline-none transition-colors">
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Image Section (Hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative">
        {/* Deep chocolate overlay for richer aesthetic */}
        <div className="absolute inset-0 bg-[#3E2723]/20 z-10 mix-blend-overlay"></div>
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80"
          alt="Luxury modern real estate home"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Tasteful floating card on the image */}
        <div className="absolute bottom-12 left-12 right-12 z-20 rounded-2xl bg-white/10 p-8 backdrop-blur-md border border-white/20 text-white shadow-2xl">
          <h3 className="font-display text-2xl font-bold mb-2">Find your perfect space.</h3>
          <p className="text-white/80 leading-relaxed">
            Join thousands of users discovering luxury properties, managing portfolios, and finding
            their dream homes with EstateHub.
          </p>
        </div>
      </div>
    </div>
  )
}
