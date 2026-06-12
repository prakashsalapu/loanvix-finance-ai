import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'
import { CheckCircle2, Mail, UserCircle2 } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'

export default function Profile() {
  const { user, signOut } = useAuth()
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0]
  const emailVerified = Boolean(user?.email_confirmed_at)

  return (
    <DashboardLayout>
      <div className="min-w-0 space-y-6">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Profile</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">Account details</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-600">Manage the identity and security signals that power your LoanVix experience.</p>
            </div>
            <button
              type="button"
              onClick={() => signOut()}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
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

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
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
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Link
            to="/settings"
            className="rounded-[24px] border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-slate-300"
          >
            <p className="text-sm font-semibold text-slate-900">Account settings</p>
            <p className="mt-3 text-sm text-slate-600">Manage your security preferences and sign-in options.</p>
          </Link>
          <Link
            to="/dashboard"
            className="rounded-[24px] border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-slate-300"
          >
            <p className="text-sm font-semibold text-slate-900">Return to dashboard</p>
            <p className="mt-3 text-sm text-slate-600">Review your protected LoanVix workspace anytime.</p>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
