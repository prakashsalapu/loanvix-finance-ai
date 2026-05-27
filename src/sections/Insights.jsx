import { motion } from 'framer-motion'
import { useInView } from '../hooks/useScrollPosition'
import { useCalculator } from '../context/CalculatorContext'
import { formatCurrency, formatTenure } from '../utils/calculations'
import { TrendingDown, Lightbulb, PiggyBank, AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import ResponsiveCard from '../components/ResponsiveCard'

function InsightCard({ icon: Icon, title, body, type = 'info', delay = 0, inView }) {
  const styles = {
    good: { border: 'insight-good', bg: 'bg-emerald-50', icon: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
    warn: { border: 'insight-warn', bg: 'bg-amber-50', icon: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
    info: { border: 'insight-info', bg: 'bg-blue-50', icon: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' }
  }
  const s = styles[type]

  return (
    <ResponsiveCard
      isInView={inView}
      delay={delay}
      className={`${s.border} ${s.bg}`}
      animate={false}
      whileHover={false}
    >
      <div className="flex items-start gap-4">
        <div className={`mt-0.5 flex-shrink-0 ${s.icon}`} aria-hidden="true">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-1">{title}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
        </div>
      </div>
    </ResponsiveCard>
  )
}

export default function Insights() {
  const [ref, isInView] = useInView()
  const { values, results } = useCalculator()

  const { loanAmount, interestRate, tenure, prepaymentAmount } = values
  const { emi, totalInterest, totalPayment, interestSavingsWithPrepayment, reducedTenure } = results

  if (!emi || emi <= 0) return null

  // Derived insights
  const interestRatio = totalInterest / loanAmount
  const emiToLoanRatio = (emi / loanAmount) * 100

  const insights = []

  // Interest burden
  if (interestRatio > 1) {
    insights.push({
      icon: AlertTriangle,
      title: 'High interest burden',
      body: `You will pay ${formatCurrency(totalInterest)} in interest - ${(interestRatio * 100).toFixed(0)}% of your principal. Consider negotiating a lower rate or reducing the tenure.`,
      type: 'warn',
      delay: 0.05
    })
  } else if (interestRatio > 0.5) {
    insights.push({
      icon: Info,
      title: 'Moderate interest cost',
      body: `Total interest of ${formatCurrency(totalInterest)} represents ${(interestRatio * 100).toFixed(0)}% of the principal. Adding even small prepayments can significantly reduce this.`,
      type: 'info',
      delay: 0.05
    })
  } else {
    insights.push({
      icon: CheckCircle2,
      title: 'Lean interest cost',
      body: `Your total interest is ${formatCurrency(totalInterest)}, which is ${(interestRatio * 100).toFixed(0)}% of the principal - well within a healthy range for this tenure.`,
      type: 'good',
      delay: 0.05
    })
  }

  // Prepayment savings
  if (prepaymentAmount > 0 && interestSavingsWithPrepayment > 0) {
    insights.push({
      icon: PiggyBank,
      title: `Save ${formatCurrency(interestSavingsWithPrepayment)} with prepayments`,
      body: `Your annual prepayment of ${formatCurrency(prepaymentAmount)} shortens the loan by ${Math.abs(reducedTenure)} month${Math.abs(reducedTenure) !== 1 ? 's' : ''} and saves ${formatCurrency(interestSavingsWithPrepayment)} in interest.`,
      type: 'good',
      delay: 0.1
    })
  } else if (prepaymentAmount === 0) {
    // Suggest prepayment
    const samplePrepay = Math.round(emi * 0.5 / 1000) * 1000
    insights.push({
      icon: TrendingDown,
      title: 'Consider making prepayments',
      body: `Adding ${formatCurrency(samplePrepay)} yearly (≈50% of one EMI) could save substantial interest. Enter a prepayment amount in the calculator to see exact savings.`,
      type: 'info',
      delay: 0.1
    })
  }

  // Tenure advice
  if (tenure > 240) {
    insights.push({
      icon: Lightbulb,
      title: 'Long tenure - consider reducing',
      body: `A ${formatTenure(tenure)} tenure maximises total interest paid. Reducing it by even 24 months can save ${formatCurrency(emi * 24 * 0.35)} on average in interest.`,
      type: 'warn',
      delay: 0.15
    })
  } else if (tenure <= 60) {
    insights.push({
      icon: CheckCircle2,
      title: 'Short tenure - great choice',
      body: `Repaying in ${formatTenure(tenure)} keeps total interest low. Ensure the monthly EMI of ${formatCurrency(emi)} fits comfortably within 40% of your income.`,
      type: 'good',
      delay: 0.15
    })
  }

  // Rate advisory
  if (interestRate > 14) {
    insights.push({
      icon: AlertTriangle,
      title: 'Interest rate above market average',
      body: `${interestRate}% p.a. is above typical lending rates. Shopping around or improving your credit score could reduce the rate and significantly lower your total cost.`,
      type: 'warn',
      delay: 0.2
    })
  }

  return (
    <section id="insights" ref={ref} className="py-16 lg:py-24 bg-gray-50" aria-labelledby="insights-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader
          badge="Financial Insights"
          title={<>Smart advice for your <span className="gradient-text">loan</span></>}
          subtitle="Personalised insights based on your loan parameters to help you make better financial decisions."
          isInView={isInView}
          className="mb-10"
        />

        {/* Key metrics row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8"
        >
          {[
            { label: 'Effective Cost of Loan', value: `${((totalInterest / loanAmount) * 100).toFixed(1)}%`, sub: 'interest / principal' },
            { label: 'Monthly EMI', value: formatCurrency(emi), sub: 'fixed outflow' },
            { label: 'Total Interest', value: formatCurrency(totalInterest), sub: 'over full tenure' },
            { label: 'Total Outflow', value: formatCurrency(totalPayment), sub: 'principal + interest' }
          ].map((item) => (
            <ResponsiveCard
              key={item.label}
              isInView={isInView}
              className="text-center"
              animate={false}
              whileHover={false}
            >
              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
            </ResponsiveCard>
          ))}
        </motion.div>

        {/* Insight cards */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
          {insights.map((insight, i) => (
            <InsightCard key={i} {...insight} inView={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}
