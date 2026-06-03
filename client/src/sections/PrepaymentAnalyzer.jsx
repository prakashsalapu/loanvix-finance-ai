import { useState, useMemo, useCallback, useContext } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Zap, Lightbulb, BarChart3, CheckCircle, Clock } from 'lucide-react'
import { CalculatorContext } from '../context/CalculatorContext'
import { analyzeEMIIncrease, generateInsights } from '../services/emiIncreaseCalculations'
import { formatCurrency } from '../services/calculationService'
import ComparisonChart from '../components/common/ComparisonChart'

const QUICK_BUTTONS = [
  { label: '+₹1,000', value: 1000 },
  { label: '+₹2,000', value: 2000 },
  { label: '+₹5,000', value: 5000 },
  { label: '+₹10,000', value: 10000 }
]

const INSIGHT_ICONS = {
  TrendingUp,
  Zap,
  Lightbulb,
  BarChart3,
  CheckCircle,
  Clock
}

/**
 * Monthly EMI Increase Analyzer Component
 * 
 * Features:
 * - Analyze impact of increasing monthly EMI
 * - Visual comparison of current vs optimized loan
 * - Dynamic insights based on savings
 * - Quick buttons for common increases
 * - Responsive design with premium SaaS aesthetics
 * 
 * Integration:
 * - Reads from CalculatorContext (loan parameters)
 * - Auto-fills current EMI from calculator results
 * - Updates based on calculator changes
 */
export default function PrepaymentAnalyzer() {
  const { values, results } = useContext(CalculatorContext)
  const [emiIncrease, setEmiIncrease] = useState(1000)

  // Validate that we have required calculator results
  const isCalculatorValid = useMemo(() => {
    return (
      results?.emi > 0 &&
      values?.loanAmount > 0 &&
      values?.interestRate >= 0 &&
      values?.tenure > 0
    )
  }, [results, values])

  // Calculate analysis whenever EMI increase or loan parameters change
  const analysis = useMemo(() => {
    if (!isCalculatorValid || emiIncrease <= 0) {
      return null
    }

    return analyzeEMIIncrease(
      {
        principal: values.loanAmount,
        annualRate: values.interestRate,
        tenure: values.tenure,
        currentEMI: results.emi,
        currentTotalInterest: results.totalInterest
      },
      emiIncrease
    )
  }, [values.loanAmount, values.interestRate, values.tenure, results.emi, results.totalInterest, emiIncrease, isCalculatorValid])

  // Generate insights based on analysis
  const insights = useMemo(() => {
    return analysis?.isValid ? generateInsights(analysis) : []
  }, [analysis])

  // Handle quick button clicks
  const handleQuickIncrease = useCallback((value) => {
    setEmiIncrease(value)
  }, [])

  // Handle custom input change
  const handleEmiIncreaseChange = useCallback((e) => {
    const value = e.target.value
    if (value === '') {
      setEmiIncrease('')
    } else {
      const numValue = parseInt(value, 10)
      if (!isNaN(numValue) && numValue >= 0) {
        setEmiIncrease(numValue)
      }
    }
  }, [])

  if (!isCalculatorValid) {
    return null
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Advanced Analytics
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Monthly EMI Increase <span className="gradient-text">Analyzer</span>
          </h2>
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
            Discover how increasing your monthly EMI can dramatically reduce your loan tenure and save thousands in interest. Visualize your financial optimization opportunities.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Left: Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, margin: '-100px' }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
              {/* Current EMI Display */}
              <div className="mb-6">
                <label className="block text-xs uppercase tracking-widest font-semibold text-gray-500 mb-2">
                  Current EMI
                </label>
                <div className="text-3xl font-bold text-gray-900">
                  {formatCurrency(results.emi)}
                </div>
                <p className="text-xs text-gray-400 mt-1">Auto-filled from calculator</p>
              </div>

              {/* EMI Increase Input */}
              <div className="mb-6">
                <label htmlFor="emi-increase" className="block text-xs uppercase tracking-widest font-semibold text-gray-500 mb-2">
                  EMI Increase Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                  <input
                    id="emi-increase"
                    type="number"
                    value={emiIncrease}
                    onChange={handleEmiIncreaseChange}
                    min="0"
                    step="100"
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 font-semibold"
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              {/* Quick Buttons */}
              <div className="mb-8">
                <p className="text-xs uppercase tracking-widest font-semibold text-gray-500 mb-3">Quick Increase</p>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_BUTTONS.map((btn) => (
                    <motion.button
                      key={btn.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleQuickIncrease(btn.value)}
                      className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                        emiIncrease === btn.value
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {btn.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Summary Stats */}
              <div className="border-t border-gray-100 pt-6 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">New EMI</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(results.emi + emiIncrease)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Current Tenure</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {values.tenure} <span className="text-base font-normal text-gray-500">months</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Comparison Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, margin: '-100px' }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Comparison Cards Header */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Comparison</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Current Loan Card */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">📊</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">Current Loan</h4>
                  </div>

                  {analysis?.isValid && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Monthly EMI</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(analysis.currentLoan.emi)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Tenure</p>
                        <p className="text-2xl font-bold text-gray-900">{analysis.currentLoan.tenure} <span className="text-base font-normal text-gray-500">months</span></p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Interest</p>
                        <p className="text-2xl font-bold gradient-text">{formatCurrency(analysis.currentLoan.totalInterest)}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Repayment</p>
                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(analysis.currentLoan.totalRepayment)}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Optimized Loan Card */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/20 rounded-full -mr-16 -mt-16" aria-hidden="true" />
                  
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-emerald-200 relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <span className="text-emerald-600 font-bold text-sm">✨</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">Optimized Loan</h4>
                    <span className="ml-auto text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">Recommended</span>
                  </div>

                  {analysis?.isValid && (
                    <div className="space-y-4 relative z-10">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Monthly EMI</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(analysis.optimizedLoan.emi)}</p>
                        <p className="text-xs text-emerald-600 mt-1 font-medium">+{formatCurrency(emiIncrease)} increase</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Tenure</p>
                        <p className="text-2xl font-bold text-gray-900">{analysis.optimizedLoan.tenure} <span className="text-base font-normal text-gray-500">months</span></p>
                        <p className="text-xs text-emerald-600 mt-1 font-medium">↓ {analysis.savings.monthsReduced} months</p>
                      </div>
                      <div className="bg-white/60 rounded-lg p-4 backdrop-blur-sm">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Interest</p>
                        <p className="text-2xl font-bold text-emerald-600">{formatCurrency(analysis.optimizedLoan.totalInterest)}</p>
                      </div>
                      <div className="bg-emerald-100/40 rounded-lg p-4 border border-emerald-300">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Repayment</p>
                        <p className="text-2xl font-bold text-emerald-600">{formatCurrency(analysis.optimizedLoan.totalRepayment)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Savings Highlight Cards */}
            {analysis?.isValid && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Savings</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-2">Interest Saved</p>
                    <p className="text-2xl font-bold gradient-text">{formatCurrency(analysis.savings.interestSaved)}</p>
                    <p className="text-xs text-gray-500 mt-2">{analysis.savings.percentageInterestReduction}% reduction</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
                    <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-2">Months Reduced</p>
                    <p className="text-2xl font-bold text-emerald-600">{analysis.savings.monthsReduced}</p>
                    <p className="text-xs text-gray-500 mt-2">{analysis.savings.yearsReduced} years earlier</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                    <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-2">EMI Increase</p>
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(analysis.savings.emiIncrease)}</p>
                    <p className="text-xs text-gray-500 mt-2">Monthly commitment</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
                    <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-2">Total Savings</p>
                    <p className="text-2xl font-bold text-orange-600">{formatCurrency(analysis.savings.totalSavings)}</p>
                    <p className="text-xs text-gray-500 mt-2">Complete benefit</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Comparison Chart */}
        {analysis?.isValid && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true, margin: '-100px' }}
            className="mb-12"
          >
            <ComparisonChart analysis={analysis} />
          </motion.div>
        )}

        {/* Insights Section */}
        {insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Key Insights</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {insights.map((insight, index) => {
                const IconComponent = INSIGHT_ICONS[insight.icon]
                const bgColorMap = {
                  excellent: 'bg-emerald-50 border-emerald-200',
                  good: 'bg-blue-50 border-blue-200',
                  tip: 'bg-amber-50 border-amber-200',
                  highlight: 'bg-purple-50 border-purple-200',
                  success: 'bg-green-50 border-green-200'
                }
                const iconBgMap = {
                  excellent: 'bg-emerald-100 text-emerald-600',
                  good: 'bg-blue-100 text-blue-600',
                  tip: 'bg-amber-100 text-amber-600',
                  highlight: 'bg-purple-100 text-purple-600',
                  success: 'bg-green-100 text-green-600'
                }

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    viewport={{ once: true, margin: '-100px' }}
                    className={`rounded-xl border p-5 ${bgColorMap[insight.type]}`}
                  >
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBgMap[insight.type]}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">{insight.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{insight.description}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
