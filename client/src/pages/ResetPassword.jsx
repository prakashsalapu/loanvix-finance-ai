import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import AuthCard from '../components/auth/AuthCard'
import ResetPasswordForm from '../components/auth/ResetPasswordForm'

export default function ResetPassword() {
  const { loading, user } = useAuth()
  const [message, setMessage] = useState('Preparing secure reset flow...')

  useEffect(() => {
    if (loading) {
      setMessage('Preparing secure reset flow...')
      return
    }

    if (user) {
      setMessage('Your secure reset link is ready. Set a new password below.')
      return
    }

    setMessage('Unable to validate the reset session. Please try again from your email link.')
  }, [loading, user])

  const isReady = !loading && Boolean(user)

  return (
    <section className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-xl shadow-slate-200/50">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-600">LoanVix auth</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">Reset password</h1>
          <p className="mt-3 max-w-2xl text-slate-600">{message}</p>
        </div>

        <AuthCard>
          <ResetPasswordForm isReady={isReady} />
        </AuthCard>
      </div>
    </section>
  )
}
