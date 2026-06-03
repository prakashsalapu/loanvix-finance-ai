import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'
import { UserCircle2, Mail, CheckCircle2 } from 'lucide-react'

export default function Profile() {
  const { user, signOut } = useAuth()
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0]
  const emailVerified = Boolean(user?.email_confirmed_at)

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Profile</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">Account details</h1>
            </div>
            <button
              type="button"
              onClick={() => signOut()}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-center gap-3 text-slate-900">
                <UserCircle2 className="h-6 w-6" />
                <p className="text-sm font-semibold">Full name</p>
              </div>
              <p className="mt-4 text-lg font-medium text-slate-900">{displayName}</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-center gap-3 text-slate-900">
                <Mail className="h-6 w-6" />
                <p className="text-sm font-semibold">Email</p>
              </div>
              <p className="mt-4 text-lg font-medium text-slate-900">{user?.email}</p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3 text-slate-900">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              <p className="text-sm font-semibold">Email verification status</p>
            </div>
            <p className="mt-4 text-sm text-slate-600">
              {emailVerified
                ? 'Your email is verified and ready for secure LoanVix access.'
                : 'Verify your email to complete account activation and access all secure features.'}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Link
            to="/settings"
            className="rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-slate-300"
          >
            <p className="text-sm font-semibold text-slate-900">Account settings</p>
            <p className="mt-3 text-sm text-slate-600">Manage your security preferences and sign-in options.</p>
          </Link>
          <Link
            to="/dashboard"
            className="rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-slate-300"
          >
            <p className="text-sm font-semibold text-slate-900">Return to dashboard</p>
            <p className="mt-3 text-sm text-slate-600">Review your protected LoanVix workspace anytime.</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
