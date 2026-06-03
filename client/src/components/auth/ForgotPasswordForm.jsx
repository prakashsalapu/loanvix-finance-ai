import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../hooks/useAuth'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address')
})

export default function ForgotPasswordForm() {
  const { sendPasswordResetEmail } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: zodResolver(schema) })

  async function onSubmit(values) {
    setServerError('')
    setMessage('')
    setIsLoading(true)

    const { error } = await sendPasswordResetEmail(values.email)
    setIsLoading(false)

    if (error) {
      setServerError(error.message || 'Unable to send the reset email. Please try again.')
      return
    }

    setMessage('Password reset instructions have been sent to your email.')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {serverError}
        </div>
      )}
      {message && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {message}
        </div>
      )}

      <label className="mt-4 space-y-2 text-sm font-medium text-slate-800">
       
        <input
          type="email"
          placeholder="Enter Your Email Address"
          {...register('email')}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Sending reset email…' : 'Send reset email'}
      </button>
    </form>
  )
}
