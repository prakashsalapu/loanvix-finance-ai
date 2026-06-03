import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'

const VERIFICATION_STORAGE_KEY = 'loanvix_verification_resend'

function getLastVerificationTimestamp(email) {
  if (!email) return 0
  try {
    const stored = JSON.parse(localStorage.getItem(VERIFICATION_STORAGE_KEY) || '{}')
    return Number(stored[email.toLowerCase()] || 0)
  } catch (_error) {
    return 0
  }
}

function setLastVerificationTimestamp(email) {
  if (!email) return
  try {
    const stored = JSON.parse(localStorage.getItem(VERIFICATION_STORAGE_KEY) || '{}')
    stored[email.toLowerCase()] = Date.now()
    localStorage.setItem(VERIFICATION_STORAGE_KEY, JSON.stringify(stored))
  } catch (_error) {
    localStorage.setItem(VERIFICATION_STORAGE_KEY, JSON.stringify({ [email.toLowerCase()]: Date.now() }))
  }
}

export default function VerifyEmail() {
  const { resendVerificationEmail } = useAuth()
  const location = useLocation()
  const initialEmail = location.state?.email ?? ''

  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (!email) return
    const lastSent = getLastVerificationTimestamp(email)
    const elapsed = Math.floor((Date.now() - lastSent) / 1000)
    const remaining = 60 - elapsed
    if (remaining > 0) {
      setCooldown(remaining)
    }
  }, [email])

  useEffect(() => {
    let timer
    if (cooldown > 0) {
      timer = window.setTimeout(() => setCooldown(cooldown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [cooldown])

  const handleResend = async () => {
    setErrorMessage('')
    setSuccessMessage('')

    if (!email) {
      setErrorMessage('Enter the email address used to sign up.')
      return
    }

    if (!password) {
      setErrorMessage('Enter the password you used when signing up.')
      return
    }

    setIsSending(true)
    const { error } = await resendVerificationEmail(email, password)
    setIsSending(false)

    if (error) {
      if (error.status === 429 || /rate limit/i.test(error.message || '')) {
        setErrorMessage('Too many verification requests. Please wait a minute before trying again.')
        setCooldown(60)
        return
      }
      setErrorMessage(error.message || 'Unable to resend verification email. Please check your details and try again.')
      return
    }

    setLastVerificationTimestamp(email)
    setSuccessMessage('Verification email resent. Check your inbox and spam folder.')
    setCooldown(60)
  }

  return (
    <section className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-xl shadow-slate-200/50"
        >
          <p className="text-sm uppercase tracking-[0.35em] text-sky-600">LoanVix auth</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">Verify your email</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Check your inbox for a verification email from Supabase. Open the message and follow the secure link to activate your LoanVix account.
          </p>

          {initialEmail && (
            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Verification email sent to</p>
              <p className="mt-1 font-medium text-slate-900">{initialEmail}</p>
            </div>
          )}

          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="font-medium text-slate-900">No email yet?</p>
            <p className="mt-2 text-sm text-slate-600">
              If you don’t see the verification message, check your spam folder or refresh your inbox. Resend only when you are ready.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-slate-800">
                Email address
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter Your Email Address"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-800">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password used at sign up"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </label>
            </div>

            {errorMessage && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                {successMessage}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleResend}
                disabled={isSending || cooldown > 0}
                className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSending ? 'Resending...' : cooldown > 0 ? `Resend available in ${cooldown}s` : 'Resend verification email'}
              </button>
              <div className="grid gap-3 sm:auto-cols-min sm:grid-flow-col">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Return to sign in
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
