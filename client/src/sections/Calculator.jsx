import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useInView } from '../hooks/useScrollPosition'
import { useCalculator } from '../context/CalculatorContext'
import { formatCurrency, formatTenure, validateInputs } from '../services/calculationService'
import { loanConfigurations } from '../data/loanConfigurations'

import {
  RotateCcw,
  IndianRupee,
  Percent,
  Calendar,
  CreditCard,
  TrendingDown,
  Building2,
  AlertCircle
} from 'lucide-react'

const loanTypes = [
  { value: 'home', label: 'Home Loan' },
  { value: 'car', label: 'Car Loan' },
  { value: 'bike', label: 'Bike Loan' },
  { value: 'personal', label: 'Personal Loan' },
  { value: 'education', label: 'Education Loan' },
  { value: 'business', label: 'Business Loan' }
]

function FieldError({ message }) {
  if (!message) return null

  return (
    <p className="field-error flex items-center gap-1 text-red-500 text-xs mt-1">
      <AlertCircle className="w-3 h-3" />
      {message}
    </p>
  )
}

export default function Calculator() {
  const [ref, isInView] = useInView()

  const {
    values,
    updateValue,
    resetValues,
    results
  } = useCalculator()

  const errors = useMemo(() => validateInputs(values), [values])

  const hasErrors = Object.keys(errors).length > 0

  const config = loanConfigurations[values.loanType]

  const principalPct =
    results.totalPayment > 0
      ? (values.loanAmount / results.totalPayment) * 100
      : 50

  const interestPct =
    results.totalPayment > 0
      ? (results.totalInterest / results.totalPayment) * 100
      : 50

  const handleLoanTypeChange = (type) => {
    const selected = loanConfigurations[type]

    updateValue('loanType', type)
    updateValue('loanAmount', selected.defaultAmount)
    updateValue('interestRate', selected.defaultInterest)
    updateValue('tenure', selected.defaultTenure)
  }

  return (
    <section
      id="calculator"
      ref={ref}
      className="w-full rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8"
    >
      <div className="mx-auto w-full">

        {/* HEADER */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4 border border-blue-100">
            Calculator
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Calculate your{' '}
            <span className="gradient-text">
              EMI instantly
            </span>
          </h2>

          <p className="text-base sm:text-lg text-gray-500">
            Enter your loan details and get accurate EMI calculations with a complete breakdown.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">

          {/* LEFT SIDE */}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="card p-5 sm:p-6 lg:p-7 border border-gray-100"
          >

            <div className="flex items-center justify-between mb-7">
              <h3 className="text-lg font-semibold text-gray-900">
                Loan Details
              </h3>

              <button
                onClick={resetValues}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>

            <div className="space-y-6">

              {/* LOAN TYPE */}

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  Loan Type
                </label>

                <select
                  value={values.loanType}
                  onChange={(e) => handleLoanTypeChange(e.target.value)}
                  className="input"
                >
                  {loanTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* LOAN AMOUNT */}

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <IndianRupee className="w-4 h-4 text-gray-400" />
                  Loan Amount
                </label>

                <div className="relative">
                  <input
                    type="number"
                    value={values.loanAmount || ''}
                    onChange={(e) =>
                      updateValue('loanAmount', Number(e.target.value))
                    }
                    className="input"
                    min={config.minAmount}
                    max={config.maxAmount}
                  />

                </div>

                <input
                  type="range"
                  value={values.loanAmount || ''}
                  onChange={(e) =>
                    updateValue('loanAmount', Number(e.target.value))
                  }
                  min={config.minAmount}
                  max={config.maxAmount}
                  step="10000"
                  className="w-full mt-3"
                />

                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{formatCurrency(config.minAmount)}</span>

                  <span className="font-semibold text-blue-600">
                    {formatCurrency(values.loanAmount)}
                  </span>

                  <span>{formatCurrency(config.maxAmount)}</span>
                </div>

                <FieldError message={errors.loanAmount} />
              </div>

              {/* INTEREST RATE */}

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Percent className="w-4 h-4 text-gray-400" />
                  Interest Rate (% p.a.)
                </label>

                <div className="relative">
                  <input
                    type="number"
                    value={values.interestRate}
                    onChange={(e) =>
                      updateValue('interestRate', Number(e.target.value))
                    }
                    className="input pr-8"
                    min={config.minInterest}
                    max={config.maxInterest}
                    step="0.01"
                  />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    %
                  </span>
                </div>

                <input
                  type="range"
                  value={values.interestRate}
                  onChange={(e) =>
                    updateValue('interestRate', Number(e.target.value))
                  }
                  min={config.minInterest}
                  max={config.maxInterest}
                  step="0.01"
                  className="w-full mt-3"
                />

                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{config.minInterest}%</span>

                  <span className="font-semibold text-blue-600">
                    {values.interestRate}%
                  </span>

                  <span>{config.maxInterest}%</span>
                </div>

                <FieldError message={errors.interestRate} />
              </div>

              {/* TENURE */}

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  Loan Tenure (Months)
                </label>

                <input
                  type="number"
                  value={values.tenure}
                  onChange={(e) =>
                    updateValue('tenure', Number(e.target.value))
                  }
                  className="input"
                  min={config.minTenure}
                  max={config.maxTenure}
                />

                <input
                  type="range"
                  value={values.tenure}
                  onChange={(e) =>
                    updateValue('tenure', Number(e.target.value))
                  }
                  min={config.minTenure}
                  max={config.maxTenure}
                  className="w-full mt-3"
                />

                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{config.minTenure} months</span>

                  <span className="font-semibold text-blue-600">
                    {formatTenure(values.tenure)}
                  </span>

                  <span>{formatTenure(config.maxTenure)}</span>
                </div>

                <FieldError message={errors.tenure} />
              </div>

              {/* PREPAYMENT - Hidden */}
              {/* 
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <TrendingDown className="w-4 h-4 text-gray-400" />
                  Yearly Prepayment
                </label>

                <div className="relative">
                  <input
                    type="number"
                    value={values.prepaymentAmount}
                    onChange={(e) =>
                      updateValue('prepaymentAmount', Number(e.target.value))
                    }
                    className="input"
                    min="0"
                  />
                </div>

                <FieldError message={errors.prepaymentAmount} />
              </div> */}

            </div>
          </motion.div>

          {/* RIGHT SIDE */}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="space-y-5 sm:space-y-6"
          >

            {/* EMI CARD */}

            <div className="gradient-bg rounded-2xl shadow-lg p-5 sm:p-6 lg:p-7 text-white">

              <p className="text-sm font-medium opacity-80 mb-1">
                Monthly EMI
              </p>

              <div className="text-4xl lg:text-5xl font-bold tracking-tight">
                {formatCurrency(results.emi)}
              </div>

              <p className="text-sm opacity-70 mt-2">
                {formatTenure(values.tenure)} at {values.interestRate}% p.a.
              </p>

            </div>

            {/* SUMMARY */}

            <div className="grid grid-cols-2 gap-3 sm:gap-4">

              <div className="card p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">
                  Principal Amount
                </p>

                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(values.loanAmount)}
                </p>
              </div>

              <div className="card p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">
                  Total Interest
                </p>

                <p className="text-lg font-bold text-emerald-600">
                  {formatCurrency(results.totalInterest)}
                </p>
              </div>

              <div className="card p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">
                  Total Tenure
                </p>

                <p className="text-lg font-bold text-gray-900">
                  {formatTenure(values.tenure)}
                </p>
              </div>

              <div className="card p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">
                  Total Payment
                </p>

                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency(results.totalPayment)}
                </p>
              </div>

            </div>

            {/* BREAKDOWN */}

            <div className="card p-5 border border-gray-100">

              <h4 className="text-sm font-semibold text-gray-700 mb-4">
                Payment Breakdown
              </h4>

              <div className="relative h-4 rounded-full overflow-hidden bg-gray-100">

                <div
                  className="absolute left-0 top-0 h-full bg-blue-500"
                  style={{ width: `${principalPct}%` }}
                />

                <div
                  className="absolute top-0 h-full bg-emerald-500"
                  style={{
                    width: `${interestPct}%`,
                    left: `${principalPct}%`
                  }}
                />

              </div>

              <div className="flex justify-between mt-3 text-sm text-gray-600">

                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span>
                    Principal ({principalPct.toFixed(1)}%)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span>
                    Interest ({interestPct.toFixed(1)}%)
                  </span>
                </div>

              </div>

            </div>

          </motion.div>

        </div>
      </div>
    </section>
  )
}