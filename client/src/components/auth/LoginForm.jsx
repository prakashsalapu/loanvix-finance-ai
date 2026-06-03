import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../hooks/useAuth'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

export default function LoginForm() {
  const { signInWithEmail } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const from = location.state?.from?.pathname || '/dashboard'

  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: zodResolver(schema) })

  async function onSubmit(values) {
    setServerError('')
    setIsLoading(true)

    const { error } = await signInWithEmail(values.email, values.password)
    setIsLoading(false)

    if (error) {
      setServerError(error.message || 'Unable to sign in. Please check your credentials.')
      return
    }

    navigate(from, { replace: true })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div className="grid gap-4">
        <label className="space-y-2 text-sm font-medium text-slate-800">
        
          <input
            type="email"
            placeholder="Enter Your Email Address"
            {...register('email')}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-800">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              {...register('password')}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-14 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 transition hover:text-slate-700 focus:outline-none"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <Link to="/forgot-password" className="text-sm font-medium text-sky-600 hover:text-sky-700">
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
