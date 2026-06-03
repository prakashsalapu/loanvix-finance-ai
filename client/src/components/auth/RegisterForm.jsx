import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../hooks/useAuth'

const VERIFICATION_STORAGE_KEY = 'loanvix_verification_resend'

function setVerificationTimestamp(email) {
  if (!email) return
  try {
    const stored = JSON.parse(localStorage.getItem(VERIFICATION_STORAGE_KEY) || '{}')
    stored[email.toLowerCase()] = Date.now()
    localStorage.setItem(VERIFICATION_STORAGE_KEY, JSON.stringify(stored))
  } catch (_error) {
    localStorage.setItem(VERIFICATION_STORAGE_KEY, JSON.stringify({ [email.toLowerCase()]: Date.now() }))
  }
}

const schema = z
  .object({
    firstName: z.string().min(2, 'Enter your first name'),
    lastName: z.string().min(2, 'Enter your last name'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Use at least one uppercase letter')
      .regex(/[a-z]/, 'Use at least one lowercase letter')
      .regex(/[0-9]/, 'Use at least one number')
      .regex(/[^A-Za-z0-9]/, 'Use at least one special character'),
    confirmPassword: z.string().min(8, 'Confirm your password'),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the terms and conditions' })
    })
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        code: 'custom',
        message: 'Passwords do not match'
      })
    }
  })

const requirementChecks = (password) => [
  { label: 'At least 8 characters', valid: password.length >= 8 },
  { label: 'One uppercase letter', valid: /[A-Z]/.test(password) },
  { label: 'One number', valid: /[0-9]/.test(password) },
  { label: 'One special character', valid: /[^A-Za-z0-9]/.test(password) }
]

export default function RegisterForm() {
  const { signUpWithEmail } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({ resolver: zodResolver(schema) })

  const passwordValue = watch('password', '')
  const requirements = requirementChecks(passwordValue)

  async function onSubmit(values) {
    setServerError('')
    setSuccessMessage('')
    setIsLoading(true)

    const fullName = `${values.firstName.trim()} ${values.lastName.trim()}`
    const { data, error } = await signUpWithEmail(fullName, values.email, values.password)
    setIsLoading(false)

    if (error) {
      setServerError(error.message || 'Unable to create your account. Please try again.')
      return
    }

    if (data?.session) {
      navigate('/dashboard', { replace: true })
      return
    }

    setVerificationTimestamp(values.email)
    setSuccessMessage('Account created. Please verify your email before signing in.')
    navigate('/verify-email', { replace: true, state: { email: values.email } })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {serverError && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {serverError}
        </div>
      )}
      {successMessage && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-3 text-sm font-medium text-slate-800">
        
          <input
            type="text"
            placeholder="First Name"
            {...register('firstName')}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:outline-none transition focus:border-sky-500 focus:ring-0"
          />
          {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
        </label>

        <label className="space-y-3 text-sm font-medium text-slate-800">
          
          <input
            type="text"
            placeholder="Last Name"
            {...register('lastName')}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:outline-none transition focus:border-sky-500 focus:ring-0"
          />
          {errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
        </label>
      </div>

      <label className=" block space-y-3 mt-3 text-sm font-medium text-slate-800">
   
        <input
          type="email"
          placeholder="Email Address"
          {...register('email')}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:outline-none transition focus:border-sky-500 focus:ring-0"
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </label>

      <div className="grid gap-6">
        <label className="space-y-3 text-sm font-medium text-slate-800">
        
         <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Create Strong Password"
            {...register('password')}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-14 text-slate-900 outline-none focus:outline-none transition focus:border-sky-500 focus:ring-0"
          />
          <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 transition hover:text-slate-700 focus:outline-none"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          </div>
        </label>

        <label className="space-y-3 text-sm font-medium text-slate-800">
        
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              {...register('confirmPassword')}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-14 text-slate-900 outline-none focus:outline-none transition focus:border-sky-500 focus:ring-0"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((current) => !current)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 transition hover:text-slate-700 focus:outline-none"
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
        </label>

        <div className="space-y-3 text-sm font-medium text-slate-800">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
            <input
              type="checkbox"
              {...register('acceptTerms')}
              className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:outline-none focus:ring-0"
            />
            <label className="text-sm text-slate-700">
              I agree to the{' '}
              <span className="font-semibold text-sky-700">Terms of Service</span> and{' '}
              <span className="font-semibold text-sky-700">Privacy Policy</span>
            </label>
          </div>
          {errors.acceptTerms && <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>}
        </div>
 




       
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  )
}
