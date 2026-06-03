import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../hooks/useAuth'

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Use at least one uppercase letter')
      .regex(/[a-z]/, 'Use at least one lowercase letter')
      .regex(/[0-9]/, 'Use at least one number'),
    confirmPassword: z.string().min(8, 'Confirm your password')
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

export default function ResetPasswordForm({ isReady }) {
  const { updatePassword } = useAuth()
  const [serverError, setServerError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: zodResolver(schema) })

  async function onSubmit(values) {
    setServerError('')
    setSuccessMessage('')
    setIsLoading(true)

    const { error } = await updatePassword(values.password)
    setIsLoading(false)

    if (error) {
      setServerError(error.message || 'Unable to reset password. Please try again.')
      return
    }

    setSuccessMessage('Your password has been updated. You can now sign in with your new password.')
  }

  if (!isReady) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
        The secure reset session is initializing. Please wait for the page to complete verification.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {serverError}
        </div>
      )}
      {successMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}

      <label className="space-y-2 text-sm font-medium text-slate-800">
        New password
        <input
          type="password"
          placeholder="Enter a new password"
          {...register('password')}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        />
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
      </label>

      <label className="space-y-2 text-sm font-medium text-slate-800">
        Confirm new password
        <input
          type="password"
          placeholder="Confirm your new password"
          {...register('confirmPassword')}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        />
        {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Updating password…' : 'Update password'}
      </button>
    </form>
  )
}
