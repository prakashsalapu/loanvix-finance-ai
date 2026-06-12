import { useState, useMemo, useCallback, useContext } from 'react'
import { motion } from 'framer-motion'
import { TrendingDown, Calendar, DollarSign, Clock } from 'lucide-react'
import { CalculatorContext } from '../context/CalculatorContext'
import { analyzeYearlyPrepayment } from '../services/yearlyPrepaymentCalculations'
import { formatCurrency } from '../services/calculationService'
import ComparisonChart from '../components/common/ComparisonChart'

const QUICK_PREPAYMENTS = [
  { label: '₹50K', value: 50000 },
  { label: '₹1L', value: 100000 },
  { label: '₹2L', value: 200000 },
  { label: '₹5L', value: 500000 }
]

/**
 * Yearly Prepayment Analyzer Component
 * Analyzes impact of yearly lump sum prepayments on loan tenure and interest
 */
export default function YearlyPrepaymentAnalyzer() {
  const { values, results } = useContext(CalculatorContext)
  const [yearlyPrepayment, setYearlyPrepayment] = useState(100000)

  const isCalculatorValid = useMemo(() => {
    return (
      results?.emi > 0 &&
      values?.loanAmount > 0 &&
      values?.interestRate >= 0 &&
      values?.tenure > 0
    )
  }, [results, values])

  const analysis = useMemo(() => {
    if (!isCalculatorValid || yearlyPrepayment <= 0) {
      return null
    }

    return analyzeYearlyPrepayment(
      {
        principal: values.loanAmount,
        annualRate: values.interestRate,
        tenure: values.tenure,
        emi: results.emi,
        totalInterest: results.totalInterest
      },
      yearlyPrepayment
    )
  }, [values.loanAmount, values.interestRate, values.tenure, results.emi, results.totalInterest, yearlyPrepayment, isCalculatorValid])

  const handleQuickPrepayment = useCallback((value) => {
    setYearlyPrepayment(value)
  }, [])

  const handlePrepaymentChange = useCallback((e) => {
    const value = e.target.value
    if (value === '') {
      setYearlyPrepayment('')
    } else {
      const numValue = parseInt(value, 10)
      if (!isNaN(numValue) && numValue >= 0) {
        setYearlyPrepayment(numValue)
      }
    }
  }, [])

  if (!isCalculatorValid) {
    return null
  }

  return (
    <section className="w-full rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      <div className="mx-auto w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium mb-4">
            <Calendar className="w-4 h-4" />
            Prepayment Strategy
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Yearly Prepayment <span className="gradient-text">Analyzer</span>
          </h2>
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
            Plan your yearly prepayment strategy and see how lump sum payments can dramatically reduce your loan tenure and save substantial interest over time.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, margin: '-100px' }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-6">
              <div className="mb-6">
                <label className="block text-xs uppercase tracking-widest font-semibold text-gray-500 mb-2">
                  Yearly Prepayment
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                  <input
                    type="number"
                    value={yearlyPrepayment}
                    onChange={handlePrepaymentChange}
                    min="0"
                    step="10000"
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-gray-900 font-semibold"
                  />
                </div>
              </div>

              <div className="mb-8">
                <p className="text-xs uppercase tracking-widest font-semibold text-gray-500 mb-3">Quick Prepayments</p>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_PREPAYMENTS.map((btn) => (
                    <motion.button
                      key={btn.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleQuickPrepayment(btn.value)}
                      className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                        yearlyPrepayment === btn.value
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {btn.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Annual Commitment</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(yearlyPrepayment)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Current Tenure</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(values.tenure / 12).toFixed(1)} <span className="text-base font-normal text-gray-500">years</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Comparison Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, margin: '-100px' }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Current Loan */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Current Loan</h4>
                </div>

                {analysis?.isValid && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Tenure</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {(analysis.currentLoan.tenure / 12).toFixed(1)} <span className="text-base font-normal text-gray-500">years</span>
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Interest</p>
                      <p className="text-2xl font-bold gradient-text">{formatCurrency(analysis.currentLoan.totalInterest)}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Repayment</p>
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(analysis.currentLoan.totalRepayment)}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      <p className="font-semibold mb-1">Closure Date:</p>
                      <p>{analysis.currentLoan.loanClosureDate?.toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Optimized Loan */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/20 rounded-full -mr-16 -mt-16" aria-hidden="true" />

                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-emerald-200 relative z-10">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">With Yearly Prepayment</h4>
                  <span className="ml-auto text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">Optimized</span>
                </div>

                {analysis?.isValid && (
                  <div className="space-y-4 relative z-10">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">New Tenure</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {(analysis.optimizedLoan.tenure / 12).toFixed(1)} <span className="text-base font-normal text-gray-500">years</span>
                      </p>
                      <p className="text-xs text-emerald-600 mt-1 font-medium">↓ {analysis.savings.yearsReduced} years</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-4 backdrop-blur-sm">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Interest</p>
                      <p className="text-2xl font-bold text-emerald-600">{formatCurrency(analysis.optimizedLoan.totalInterest)}</p>
                    </div>
                    <div className="bg-emerald-100/40 rounded-lg p-4 border border-emerald-300">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Repayment</p>
                      <p className="text-2xl font-bold text-emerald-600">{formatCurrency(analysis.optimizedLoan.totalRepayment)}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      <p className="font-semibold mb-1">Closure Date:</p>
                      <p>{analysis.optimizedLoan.loanClosureDate?.toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Savings Cards */}
            {analysis?.isValid && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Summary</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-2">Interest Saved</p>
                    <p className="text-2xl font-bold gradient-text">{formatCurrency(analysis.savings.interestSaved)}</p>
                    <p className="text-xs text-gray-500 mt-2">{analysis.savings.percentageInterestReduction}% reduction</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
                    <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-2">Years Reduced</p>
                    <p className="text-2xl font-bold text-emerald-600">{analysis.savings.yearsReduced}</p>
                    <p className="text-xs text-gray-500 mt-2">{analysis.savings.monthsReduced} months</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                    <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-2">Yearly Commitment</p>
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(yearlyPrepayment)}</p>
                    <p className="text-xs text-gray-500 mt-2">Annual amount</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
                    <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-2">Total Prepayment</p>
                    <p className="text-2xl font-bold text-orange-600">{formatCurrency(analysis.savings.totalPrepaymentRequired)}</p>
                    <p className="text-xs text-gray-500 mt-2">Over loan period</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
