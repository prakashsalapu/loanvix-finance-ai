import { motion } from 'framer-motion'
import { BarChart3, UserCheck, ShieldCheck, Settings2, FileText, Sparkles, Wallet } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useCalculator } from '../context/CalculatorContext'
import DashboardLayout from '../layouts/DashboardLayout'
import Calculator from '../sections/Calculator'
import PrepaymentAnalyzer from '../sections/PrepaymentAnalyzer'
import YearlyPrepaymentAnalyzer from '../sections/YearlyPrepaymentAnalyzer'
import ScenarioComparison from '../sections/ScenarioComparison'
import AIRecommendations from '../sections/AIRecommendations'
import Analytics from '../sections/Analytics'
import Schedule from '../sections/Schedule'

export default function Dashboard() {
  const { user, displayName } = useAuth()
  const { values, results } = useCalculator()
  const fallbackName = user?.email?.split('@')[0] || 'there'
  const welcomeName = displayName || fallbackName

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Welcome back</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
                Hello, {welcomeName}
              </h1>
              <p className="mt-3 max-w-2xl text-slate-600">
                Your LoanVix dashboard is ready. Manage your loan calculations, analyze repayment scenarios, and access reports from one place.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:mt-0 sm:flex-row">
              <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                <p>Loan amount</p>
                <p className="mt-2 text-xl">₹{values.loanAmount.toLocaleString()}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                <p>Expected EMI</p>
                <p className="mt-2 text-xl">₹{results.emi.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 text-slate-900">
              <div className="rounded-2xl bg-sky-50 p-3 text-sky-600">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Loan overview</p>
                <p className="text-sm text-slate-500">Your principal, interest, and repayment snapshot.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Total interest</p>
                <p>₹{results.totalInterest.toLocaleString()}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Total payment</p>
                <p>₹{results.totalPayment.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 text-slate-900">
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Smart insights</p>
                <p className="text-sm text-slate-500">Review savings estimates and amortization outcomes.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Processing fee</p>
                <p>₹{results.processingFeeAmount.toLocaleString()}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Prepayment savings</p>
                <p>₹{results.interestSavingsWithPrepayment.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 text-slate-900">
              <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Ready reports</p>
                <p className="text-sm text-slate-500">Access your prepared loan summaries and export-ready insights.</p>
              </div>
            </div>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Effective amount</p>
                <p>₹{results.effectiveAmount.toLocaleString()}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Remaining tenure</p>
                <p>{values.tenure} months</p>
              </div>
            </div>
          </motion.div>
        </div>

        <section id="loan-tools" className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900">Loan calculators</h2>
          <div className="grid gap-6 xl:grid-cols-2">
            <Calculator />
            <Analytics />
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <PrepaymentAnalyzer />
            <YearlyPrepaymentAnalyzer />
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900">Scenario modeling</h2>
          <ScenarioComparison />
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900">Amortization schedule</h2>
          <Schedule />
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900">Loan intelligence</h2>
          <AIRecommendations />
        </section>

        <section id="reports" className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Reports</p>
            <h3 className="mt-3 text-xl font-semibold text-slate-900">Export ready summaries</h3>
            <p className="mt-3 text-sm text-slate-600">
              Generate reports for your loan strategy. Use the dashboard to compare scenarios and export key loan metrics.
            </p>
            <button className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              View report options
            </button>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Saved calculations</p>
            <h3 className="mt-3 text-xl font-semibold text-slate-900">Placeholder content</h3>
            <p className="mt-3 text-sm text-slate-600">
              Saved calculations will appear here once the feature is enabled. Keep your scenarios and reports organized in one place.
            </p>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
