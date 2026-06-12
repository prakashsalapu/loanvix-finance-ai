import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'
import { ArrowRight, Key, ShieldCheck } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'

export default function Settings() {
  const { user, signOut } = useAuth()

  return (
    <DashboardLayout>
      <div className="min-w-0 space-y-6">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Settings</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">Security controls</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-600">Keep your account and loan workspace operating with confident, secure access.</p>
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
                <ShieldCheck className="h-5 w-5" />
                <p className="text-sm font-semibold">Account protection</p>
              </div>
              <p className="mt-4 text-sm text-slate-600">
                Keep your LoanVix session secure with email verification and strong password best practices.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-center gap-3 text-slate-900">
                <Key className="h-5 w-5" />
                <p className="text-sm font-semibold">Password recovery</p>
              </div>
              <p className="mt-4 text-sm text-slate-600">
                Reset your password at any time and return to secure LoanVix access.
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <ArrowRight className="h-4 w-4" />
              Reset password
            </Link>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">Signed in as</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{user?.email}</p>
        </section>
      </div>
    </DashboardLayout>
  )
}
