import { useMemo, useContext } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Check } from 'lucide-react'
import { CalculatorContext } from '../context/CalculatorContext'
import { generateScenarios, formatScenarioComparison, getComparisonPercentages } from '../services/scenarioComparison'
import { formatCurrency } from '../services/calculationService'

/**
 * Scenario Comparison Component
 * Displays side-by-side comparison of multiple optimization strategies
 */
export default function ScenarioComparison() {
  const { values, results } = useContext(CalculatorContext)

  const isCalculatorValid = useMemo(() => {
    return (
      results?.emi > 0 &&
      values?.loanAmount > 0 &&
      values?.interestRate >= 0 &&
      values?.tenure > 0
    )
  }, [results, values])

  // Generate all scenarios with default parameters
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
      2000, // Default EMI increase
      100000 // Default yearly prepayment
    )
  }, [values.loanAmount, values.interestRate, values.tenure, results.emi, results.totalInterest, isCalculatorValid])

  if (!isCalculatorValid || !scenarioData) {
    return null
  }

  const { scenarios, bestScenario } = scenarioData

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-4">
            <BarChart3 className="w-4 h-4" />
            Strategy Comparison
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Compare All <span className="gradient-text">Scenarios</span>
          </h2>
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
            Evaluate multiple optimization strategies side-by-side to find the approach that works best for your financial situation.
          </p>
        </motion.div>

        {/* Scenarios Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {scenarios.map((scenario, idx) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true, margin: '-100px' }}
              className={`rounded-2xl border p-6 shadow-sm transition-all ${
                scenario.id === bestScenario && scenario.id !== 'current'
                  ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 ring-2 ring-emerald-500/20'
                  : 'bg-white border-gray-100'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{scenario.name}</h3>
                  <p className="text-sm text-gray-500">{scenario.description}</p>
                </div>
                {scenario.id === bestScenario && scenario.id !== 'current' && (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                    <Check className="w-4 h-4" />
                    Best
                  </div>
                )}
              </div>

              {/* Metrics Grid */}
              <div className="space-y-4 mb-6">
                {/* EMI */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600 font-medium">Monthly EMI</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(scenario.metrics.emi)}</p>
                </div>

                {/* Tenure */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600 font-medium">Tenure</p>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{(scenario.metrics.tenure / 12).toFixed(1)} years</p>
                    {scenario.savings.monthsReduced > 0 && (
                      <p className="text-xs text-emerald-600 font-medium">-{scenario.savings.monthsReduced} months</p>
                    )}
                  </div>
                </div>

                {/* Total Interest */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600 font-medium">Total Interest</p>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(scenario.metrics.totalInterest)}</p>
                    {scenario.savings.interestSaved > 0 && (
                      <p className="text-xs text-emerald-600 font-medium">Save {formatCurrency(scenario.savings.interestSaved)}</p>
                    )}
                  </div>
                </div>

                {/* Total Repayment */}
                <div className={`flex items-center justify-between p-3 rounded-lg ${
                  scenario.id === bestScenario && scenario.id !== 'current'
                    ? 'bg-emerald-100/40 border border-emerald-200'
                    : 'bg-blue-50 border border-blue-200'
                }`}>
                  <p className="text-sm font-medium text-gray-600">Total Repayment</p>
                  <p className={`text-lg font-bold ${
                    scenario.id === bestScenario && scenario.id !== 'current'
                      ? 'text-emerald-600'
                      : 'text-blue-600'
                  }`}>
                    {formatCurrency(scenario.metrics.totalRepayment)}
                  </p>
                </div>

                {/* Yearly Prepayment (if applicable) */}
                {scenario.metrics.yearlyPrepayment && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-200">
                    <p className="text-sm text-purple-900 font-medium">Yearly Prepayment</p>
                    <p className="text-lg font-bold text-purple-600">{formatCurrency(scenario.metrics.yearlyPrepayment)}</p>
                  </div>
                )}
              </div>

              {/* Savings Summary */}
              {scenario.id !== 'current' && scenario.savings.interestSaved > 0 && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-3">Savings vs Current</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-600">{formatCurrency(scenario.savings.interestSaved)}</p>
                      <p className="text-xs text-gray-500 mt-1">Interest Saved</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-600">{scenario.savings.yearsReduced}</p>
                      <p className="text-xs text-gray-500 mt-1">Years Reduced</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true, margin: '-100px' }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold text-gray-600">Scenario</th>
                  <th className="px-6 py-4 text-right text-xs uppercase tracking-wider font-semibold text-gray-600">EMI</th>
                  <th className="px-6 py-4 text-right text-xs uppercase tracking-wider font-semibold text-gray-600">Tenure</th>
                  <th className="px-6 py-4 text-right text-xs uppercase tracking-wider font-semibold text-gray-600">Total Interest</th>
                  <th className="px-6 py-4 text-right text-xs uppercase tracking-wider font-semibold text-gray-600">Interest Saved</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((scenario, idx) => (
                  <tr
                    key={scenario.id}
                    className={`border-b border-gray-100 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } ${scenario.id === bestScenario && scenario.id !== 'current' ? 'bg-emerald-50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{scenario.name}</p>
                        <p className="text-sm text-gray-500">{scenario.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(scenario.metrics.emi)}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-gray-900">{(scenario.metrics.tenure / 12).toFixed(1)} yrs</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(scenario.metrics.totalInterest)}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className={`font-bold ${
                        scenario.savings.interestSaved > 0
                          ? 'text-emerald-600'
                          : 'text-gray-500'
                      }`}>
                        {scenario.savings.interestSaved > 0 ? `₹${(scenario.savings.interestSaved / 100000).toFixed(1)}L` : '-'}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Best Strategy Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mt-12 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-3">Why is this the best strategy?</h3>
          <p className="text-gray-600 leading-relaxed">
            The <strong>{scenarios.find(s => s.id === bestScenario)?.name}</strong> strategy delivers the maximum interest savings of{' '}
            <strong>{formatCurrency(scenarios.find(s => s.id === bestScenario)?.savings.interestSaved)}</strong> and reduces your loan
            duration by <strong>{scenarios.find(s => s.id === bestScenario)?.savings.yearsReduced} years</strong>. This analysis is based
            on your current loan parameters and assumes consistent monthly EMI/prepayment amounts.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
