import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { formatCurrency } from '../../services/calculationService'

/**
 * Comparison chart showing before/after EMI increase analysis
 * Displays tenure, total interest, and total repayment side by side
 */
export default function ComparisonChart({ analysis }) {
  if (!analysis?.isValid) {
    return null
  }

  const { currentLoan, optimizedLoan } = analysis

  // Prepare data for chart
  const chartData = [
    {
      name: 'Total Interest',
      current: currentLoan.totalInterest,
      optimized: optimizedLoan.totalInterest,
      difference: currentLoan.totalInterest - optimizedLoan.totalInterest
    },
    {
      name: 'Total Repayment',
      current: currentLoan.totalRepayment,
      optimized: optimizedLoan.totalRepayment,
      difference: currentLoan.totalRepayment - optimizedLoan.totalRepayment
    },
    {
      name: 'Tenure (Months)',
      current: currentLoan.tenure,
      optimized: optimizedLoan.tenure,
      difference: currentLoan.tenure - optimizedLoan.tenure
    }
  ]

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload) return null

    return (
      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-lg">
        <p className="text-gray-900 font-semibold text-sm">{payload[0]?.payload?.name}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-xs font-medium">
            {entry.name}: {
              entry.name === 'Tenure (Months)' 
                ? entry.value 
                : formatCurrency(entry.value)
            }
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Comparison Analysis</h3>
        <p className="text-sm text-gray-500">Current vs Optimized Loan Performance</p>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 60, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              angle={-15}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft', offset: 10 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="square"
            />
            <Bar dataKey="current" name="Current Loan" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="optimized" name="Optimized Loan" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Savings highlight */}
      <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Interest Saved</p>
          <p className="text-2xl font-bold gradient-text">{formatCurrency(analysis.savings.interestSaved)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Months Reduced</p>
          <p className="text-2xl font-bold text-emerald-600">{analysis.savings.monthsReduced}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Reduction %</p>
          <p className="text-2xl font-bold text-blue-600">{analysis.savings.percentageInterestReduction}%</p>
        </div>
      </div>
    </div>
  )
}
