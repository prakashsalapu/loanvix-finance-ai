import { useMemo, useContext } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Zap,
  Target,
  AlertCircle,
  Clock,
  Layers,
  Activity,
  Download,
  Lightbulb
} from 'lucide-react'
import { CalculatorContext } from '../context/CalculatorContext'
import { generateScenarios } from '../utils/scenarioComparison'
import {
  calculateLoanHealthScore,
  generateRecommendations,
  getHealthScoreInterpretation,
  generateInsightsSummary
} from '../utils/aiRecommendations'
import { generatePrepaymentReportPDF } from '../utils/pdfReportGenerator'
import { formatCurrency } from '../utils/calculations'

const ICON_MAP = {
  TrendingUp,
  Zap,
  Target,
  AlertCircle,
  Clock,
  Layers,
  Lightbulb
}

/**
 * AI Recommendations & Loan Health Component
 * Displays AI-powered insights, health score, and recommendations
 */
export default function AIRecommendations() {
  const { values, results } = useContext(CalculatorContext)

  const isCalculatorValid = useMemo(() => {
    return (
      results?.emi > 0 &&
      values?.loanAmount > 0 &&
      values?.interestRate >= 0 &&
      values?.tenure > 0
    )
  }, [results, values])

  // Generate scenarios
  const scenarioData = useMemo(() => {
    if (!isCalculatorValid) return null

    return generateScenarios(
      {
        principal: values.loanAmount,
        annualRate: values.interestRate,
        tenure: values.tenure,
        emi: results.emi,
        totalInterest: results.totalInterest
      },
      2000,
      100000
    )
  }, [values.loanAmount, values.interestRate, values.tenure, results.emi, results.totalInterest, isCalculatorValid])

  // Calculate health score and recommendations
  const loan = useMemo(() => ({
    principal: values.loanAmount,
    annualRate: values.interestRate,
    tenure: values.tenure,
    emi: results.emi,
    totalInterest: results.totalInterest
  }), [values.loanAmount, values.interestRate, values.tenure, results.emi, results.totalInterest])

  const healthScore = useMemo(() => {
    if (!isCalculatorValid || !scenarioData) return 0
    return calculateLoanHealthScore(loan, scenarioData)
  }, [loan, scenarioData, isCalculatorValid])

  const recommendations = useMemo(() => {
    if (!isCalculatorValid || !scenarioData) return []
    return generateRecommendations(loan, scenarioData.scenarios)
  }, [loan, scenarioData, isCalculatorValid])

  const healthInterpretation = useMemo(() => {
    return getHealthScoreInterpretation(healthScore)
  }, [healthScore])

  const summary = useMemo(() => {
    if (!scenarioData) return null
    return generateInsightsSummary(loan, scenarioData, recommendations)
  }, [loan, scenarioData, recommendations])

  const handleGenerateReport = async () => {
    if (!scenarioData) return
    
    const success = await generatePrepaymentReportPDF(
      loan,
      scenarioData,
      scenarioData.scenarios,
      healthScore,
      recommendations
    )
    
    if (success) {
      // Show success message (can be improved with toast)
      alert('Report generated successfully!')
    }
  }

  if (!isCalculatorValid || !scenarioData || !summary) {
    return null
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-sm font-medium mb-4">
            <Activity className="w-4 h-4" />
            AI Insights & Recommendations
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Loan Health Score &<span className="gradient-text">Intelligence</span>
          </h2>
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
            Get personalized AI recommendations based on comprehensive analysis of your loan. Understand your loan health and optimization opportunities.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Health Score Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: '-100px' }}
            className={`rounded-2xl border p-8 shadow-sm ${healthInterpretation.bgColor} ${healthInterpretation.borderColor}`}
          >
            <h3 className="text-sm uppercase tracking-wider font-semibold text-gray-600 mb-6">Loan Health Score</h3>

            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="text-6xl font-bold text-gray-900 mb-2">{healthScore}</div>
                <p className={`text-lg font-semibold ${healthInterpretation.color}`}>{healthInterpretation.level}</p>
              </div>
              <div className="relative w-28 h-28">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={healthInterpretation.color.replace('text-', '')}
                    strokeWidth="8"
                    strokeDasharray={`${(healthScore / 100) * 282.7} 282.7`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">{healthScore}%</span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-6">{healthInterpretation.description}</p>

            {/* Key Metrics */}
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Interest Percentage</p>
                <p className="font-bold text-gray-900">{summary.interestAsPercentageOfPrincipal}%</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Years to Repay</p>
                <p className="font-bold text-gray-900">{summary.yearsToRepay}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Monthly Outflow</p>
                <p className="font-bold text-gray-900">{formatCurrency(summary.monthlyOutflow)}</p>
              </div>
            </div>
          </motion.div>

          {/* Opportunities Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, margin: '-100px' }}
            className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6">Your Optimization Opportunities</h3>

            {summary.potentialSavings > 0 ? (
              <div className="grid sm:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <p className="text-3xl font-bold gradient-text mb-2">{formatCurrency(summary.potentialSavings)}</p>
                  <p className="text-sm text-gray-600">Interest Savings Potential</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-600 mb-2">{summary.potentialTenureReduction}</p>
                  <p className="text-sm text-gray-600">Months You Can Reduce</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600 mb-2">
                    {((summary.potentialSavings / summary.totalInterestPayable) * 100).toFixed(0)}%
                  </p>
                  <p className="text-sm text-gray-600">Interest Reduction</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-600">Your loan is well-optimized. Continue your current strategy.</p>
              </div>
            )}

            {/* Download Report Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateReport}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
            >
              <Download className="w-5 h-5" />
              Download Full Report (PDF)
            </motion.button>
          </motion.div>
        </div>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Personalized Recommendations</h3>

            <div className="space-y-6">
              {recommendations.map((rec, idx) => {
                const IconComponent = ICON_MAP[rec.icon] || Lightbulb
                const priorityStyles = {
                  high: {
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    badgeBg: 'bg-red-100',
                    badgeText: 'text-red-700',
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-600'
                  },
                  medium: {
                    bgColor: 'bg-amber-50',
                    borderColor: 'border-amber-200',
                    badgeBg: 'bg-amber-100',
                    badgeText: 'text-amber-700',
                    iconBg: 'bg-amber-100',
                    iconColor: 'text-amber-600'
                  },
                  low: {
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                    badgeBg: 'bg-blue-100',
                    badgeText: 'text-blue-700',
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600'
                  }
                }

                const styles = priorityStyles[rec.priority] || priorityStyles.low

                return (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                    viewport={{ once: true, margin: '-100px' }}
                    className={`rounded-xl border p-6 ${styles.bgColor} ${styles.borderColor}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg ${styles.iconBg} flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className={`w-6 h-6 ${styles.iconColor}`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-gray-900">{rec.title}</h4>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles.badgeBg} ${styles.badgeText} uppercase tracking-wider`}>
                            {rec.priority} Priority
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{rec.description}</p>

                        {rec.savingsAmount > 0 && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">Potential Savings:</span>
                            <span className="font-bold text-gray-900">{formatCurrency(rec.savingsAmount)}</span>
                          </div>
                        )}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap ${styles.badgeBg} ${styles.badgeText} hover:opacity-80 transition-opacity`}
                      >
                        {rec.action}
                      </motion.button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Footer Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 text-lg">
            Use our interactive calculators above to explore different scenarios and find the strategy that works best for you.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
