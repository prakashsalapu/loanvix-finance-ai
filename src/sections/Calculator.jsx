import { motion } from 'framer-motion'
import { useInView } from '../hooks/useScrollPosition'
import { useCalculator } from '../context/CalculatorContext'
import { formatCurrency, formatTenure, validateInputs } from '../utils/calculations'
import { useMemo } from 'react'
import {
  RotateCcw, IndianRupee, Percent, Calendar, CreditCard, TrendingDown, Building2, AlertCircle
} from 'lucide-react'

const loanTypes = [
  { value: 'home', label: 'Home Loan' },
  { value: 'car', label: 'Car Loan' },
  { value: 'personal', label: 'Personal Loan' },
  { value: 'education', label: 'Education Loan' },
  { value: 'business', label: 'Business Loan' }
]

function FieldError({ message }) {
  if (!message) return null
  return (
    <p className="field-error" role="alert" aria-live="polite">
      <AlertCircle className="w-3 h-3" aria-hidden="true" />
      {message}
    </p>
  )
}

export default function Calculator() {
  const [ref, isInView] = useInView()
  const { values, updateValue, resetValues, results } = useCalculator()
  const errors = useMemo(() => validateInputs(values), [values])
  const hasErrors = Object.keys(errors).length > 0

  const principalPct = results.totalPayment > 0 ? (values.loanAmount / results.totalPayment) * 100 : 50
  const interestPct = results.totalPayment > 0 ? (results.totalInterest / results.totalPayment) * 100 : 50

  return (
    <section id="calculator" ref={ref} className="py-16 lg:py-24 bg-white" aria-labelledby="calc-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4 border border-blue-100">
            Calculator
          </span>
          <h2 id="calc-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-balance leading-tight">
            Calculate your <span className="gradient-text">EMI instantly</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-500">
            Enter your loan details and get accurate EMI calculations with a complete breakdown.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card p-5 sm:p-6 lg:p-7 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-7">
              <h3 className="text-lg font-semibold text-gray-900">Loan Details</h3>
              <button
                onClick={resetValues}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2 py-1"
                aria-label="Reset all fields to defaults"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                Reset
              </button>
            </div>

            <div className="space-y-6">
              {/* Loan Type */}
              <div>
                <label htmlFor="loanType" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="w-4 h-4 text-gray-400" aria-hidden="true" />
                  Loan Type
                </label>
                <select
                  id="loanType"
                  value={values.loanType}
                  onChange={(e) => updateValue('loanType', e.target.value)}
                  className="input"
                  aria-label="Select loan type"
                >
                  {loanTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              {/* Loan Amount */}
              <div>
                <label htmlFor="loanAmount" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <IndianRupee className="w-4 h-4 text-gray-400" aria-hidden="true" />
                  Loan Amount
                </label>
                <div className="relative">
                  <input
                    id="loanAmount"
                    type="number"
                    value={values.loanAmount}
                    onChange={(e) => updateValue('loanAmount', Number(e.target.value))}
                    className="input pl-8"
                    min="10000" max="100000000"
                    aria-describedby={errors.loanAmount ? 'loanAmount-error' : undefined}
                    aria-invalid={!!errors.loanAmount}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" aria-hidden="true">₹</span>
                </div>
                <input
                  type="range" value={values.loanAmount}
                  onChange={(e) => updateValue('loanAmount', Number(e.target.value))}
                  min="10000" max="10000000" step="10000"
                  className="w-full mt-3"
                  aria-label="Loan amount slider"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>₹10K</span>
                  <span className="font-semibold text-blue-600">{formatCurrency(values.loanAmount)}</span>
                  <span>₹1Cr</span>
                </div>
                <div id="loanAmount-error"><FieldError message={errors.loanAmount} /></div>
              </div>

              {/* Interest Rate */}
              <div>
                <label htmlFor="interestRate" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Percent className="w-4 h-4 text-gray-400" aria-hidden="true" />
                  Interest Rate (% p.a.)
                </label>
                <div className="relative">
                  <input
                    id="interestRate"
                    type="number" value={values.interestRate}
                    onChange={(e) => updateValue('interestRate', Number(e.target.value))}
                    className="input pr-8"
                    min="0.5" max="30" step="0.1"
                    aria-describedby={errors.interestRate ? 'interestRate-error' : undefined}
                    aria-invalid={!!errors.interestRate}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" aria-hidden="true">%</span>
                </div>
                <input
                  type="range" value={values.interestRate}
                  onChange={(e) => updateValue('interestRate', Number(e.target.value))}
                  min="0.5" max="30" step="0.1"
                  className="w-full mt-3"
                  aria-label="Interest rate slider"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0.5%</span>
                  <span className="font-semibold text-blue-600">{values.interestRate}%</span>
                  <span>30%</span>
                </div>
                <div id="interestRate-error"><FieldError message={errors.interestRate} /></div>
              </div>

              {/* Tenure */}
              <div>
                <label htmlFor="tenure" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 text-gray-400" aria-hidden="true" />
                  Loan Tenure (Months)
                </label>
                <input
                  id="tenure"
                  type="number" value={values.tenure}
                  onChange={(e) => updateValue('tenure', Number(e.target.value))}
                  className="input"
                  min="1" max="360"
                  aria-describedby={errors.tenure ? 'tenure-error' : undefined}
                  aria-invalid={!!errors.tenure}
                />
                <input
                  type="range" value={values.tenure}
                  onChange={(e) => updateValue('tenure', Number(e.target.value))}
                  min="1" max="360"
                  className="w-full mt-3"
                  aria-label="Tenure slider"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1 month</span>
                  <span className="font-semibold text-blue-600">{formatTenure(values.tenure)}</span>
                  <span>30 years</span>
                </div>
                <div id="tenure-error"><FieldError message={errors.tenure} /></div>
              </div>

              {/* Processing Fee */}
              <div>
                <label htmlFor="processingFee" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <CreditCard className="w-4 h-4 text-gray-400" aria-hidden="true" />
                  Processing Fee (%)
                </label>
                <div className="relative">
                  <input
                    id="processingFee"
                    type="number" value={values.processingFee}
                    onChange={(e) => updateValue('processingFee', Number(e.target.value))}
                    className="input pr-8"
                    min="0" max="5" step="0.1"
                    aria-describedby={errors.processingFee ? 'processingFee-error' : undefined}
                    aria-invalid={!!errors.processingFee}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" aria-hidden="true">%</span>
                </div>
                <div id="processingFee-error"><FieldError message={errors.processingFee} /></div>
              </div>

              {/* Prepayment */}
              <div>
                <label htmlFor="prepayment" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <TrendingDown className="w-4 h-4 text-gray-400" aria-hidden="true" />
                  Yearly Prepayment
                  <span className="text-xs text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    id="prepayment"
                    type="number" value={values.prepaymentAmount}
                    onChange={(e) => updateValue('prepaymentAmount', Number(e.target.value))}
                    className="input pl-8"
                    min="0" placeholder="0"
                    aria-describedby={errors.prepaymentAmount ? 'prepayment-error' : undefined}
                    aria-invalid={!!errors.prepaymentAmount}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" aria-hidden="true">₹</span>
                </div>
                <div id="prepayment-error"><FieldError message={errors.prepaymentAmount} /></div>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-5 sm:space-y-6"
          >
            {/* EMI Hero Card */}
            <div className="card gradient-bg p-5 sm:p-6 lg:p-7 text-white" aria-label="Monthly EMI result">
              {hasErrors ? (
                <div className="py-4 text-center opacity-80">
                  <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-60" aria-hidden="true" />
                  <p className="font-medium">Please fix the errors in the form to see results.</p>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium opacity-80 mb-1">Monthly EMI</p>
                  <motion.div
                    initial={{ scale: 0.92, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl lg:text-5xl font-bold tracking-tight text-white"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {formatCurrency(results.emi)}
                  </motion.div>
                  <p className="text-sm opacity-70 mt-2">
                    {formatTenure(values.tenure)} at {values.interestRate}% p.a.
                  </p>
                </>
              )}
            </div>

            {/* Summary grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { label: 'Principal Amount', value: formatCurrency(values.loanAmount), color: 'text-gray-900' },
                { label: 'Total Interest', value: formatCurrency(results.totalInterest), color: 'text-emerald-600' },
                { label: 'Processing Fee', value: formatCurrency(results.processingFeeAmount), color: 'text-gray-900' },
                { label: 'Total Payment', value: formatCurrency(results.totalPayment), color: 'text-blue-600' }
              ].map((item) => (
                <div key={item.label} className="card p-4 sm:p-5 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
            

            {/* Breakdown bar */}
            <div className="card p-5 border border-gray-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Payment Breakdown</h4>
              <div
                className="relative h-4 rounded-full overflow-hidden bg-gray-100"
                role="img"
                aria-label={`Principal ${principalPct.toFixed(1)}%, Interest ${interestPct.toFixed(1)}%`}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${principalPct}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="absolute left-0 top-0 h-full bg-blue-500 rounded-l-full"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${interestPct}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
                  className="absolute top-0 h-full bg-emerald-500 rounded-r-full"
                  style={{ left: `${principalPct}%` }}
                />
              </div>
              <div className="flex justify-between mt-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" aria-hidden="true" />
                  <span>Principal ({principalPct.toFixed(1)}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" aria-hidden="true" />
                  <span>Interest ({interestPct.toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
