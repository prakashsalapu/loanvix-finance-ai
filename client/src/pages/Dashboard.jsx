import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, FileText, ShieldCheck, Sparkles, TrendingUp, Wallet2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useCalculator } from '../context/CalculatorContext'
import LoanVixLayout from '../layouts/LoanVixLayout'
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

  const heroMetrics = [
    {
      label: 'Loan Amount',
      value: `₹${values.loanAmount.toLocaleString()}`,
      detail: 'Principal borrowed',
      icon: Wallet2,
      tone: 'from-sky-50 to-sky-100/70 text-sky-700'
    },
    {
      label: 'EMI',
      value: `₹${results.emi.toLocaleString()}`,
      detail: 'Monthly repayment',
      icon: BarChart3,
      tone: 'from-emerald-50 to-emerald-100/70 text-emerald-700'
    },
    {
      label: 'Interest Payable',
      value: `₹${results.totalInterest.toLocaleString()}`,
      detail: 'Projected borrowing cost',
      icon: TrendingUp,
      tone: 'from-amber-50 to-amber-100/70 text-amber-700'
    },
    {
      label: 'Savings',
      value: `₹${results.interestSavingsWithPrepayment.toLocaleString()}`,
      detail: 'Potential saved with prepayments',
      icon: Sparkles,
      tone: 'from-violet-50 to-violet-100/70 text-violet-700'
    }
  ]

  return (
    <LoanVixLayout>
      <div className="min-w-0 space-y-6 lg:space-y-8">
        <section className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-[0_25px_80px_-28px_rgba(15,23,42,0.6)] sm:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-medium text-slate-100 backdrop-blur">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Smart repayment workspace
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Welcome back, {welcomeName}
              </h1>
              <p className="mt-3 max-w-xl text-sm text-slate-300 sm:text-base">
                Manage your loans, track repayments, and analyze savings from one polished dashboard.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[520px]">
              {heroMetrics.map((metric, index) => {
                const Icon = metric.icon

                return (
                  <motion.article
                    key={metric.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="rounded-[22px] border border-white/10 bg-white/10 p-4 backdrop-blur"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-300">{metric.label}</p>
                        <p className="mt-2 text-lg font-semibold text-white">{metric.value}</p>
                      </div>
                      <div className={`rounded-2xl bg-gradient-to-br ${metric.tone} p-2.5`}>
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-400">{metric.detail}</p>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </section>

        <section id="loan-tools" className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Loan tools</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Analyze your repayment plan</h2>
            </div>
            <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
              <TrendingUp className="h-4 w-4 text-emerald-600" /> Live calculations with structured insights
            </div>
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <Calculator />
            <Analytics />
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <PrepaymentAnalyzer />
            <YearlyPrepaymentAnalyzer />
          </div>
        </section>

        <section id="repayment-analysis" className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Scenario modeling</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Compare repayment outcomes</h2>
            </div>
          </div>
          <ScenarioComparison />
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Amortization</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Understand every payment</h2>
            </div>
          </div>
          <Schedule />
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Insights</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Recommendations tailored to your plan</h2>
            </div>
          </div>
          <AIRecommendations />
        </section>

        <section id="reports" className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="rounded-2xl bg-slate-100 p-3">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Export-ready summaries</p>
                <p className="text-sm text-slate-500">Generate polished reports for review or sharing.</p>
              </div>
            </div>
            <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              View report options
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="rounded-2xl bg-sky-50 p-3 text-sky-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Saved calculations</p>
                <p className="text-sm text-slate-500">Keep important scenarios and summaries organized in one place.</p>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              Saved calculations will appear here as the workspace evolves.
            </div>
          </div>
        </section>
      </div>
    </LoanVixLayout>
  )
}
