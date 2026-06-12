import { motion } from 'framer-motion'
import { useInView } from '../hooks/useScrollPosition'
import { useCalculator } from '../context/CalculatorContext'
import { formatCurrency, getYearlySummary } from '../services/calculationService'
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import SectionHeader from '../components/common/SectionHeader'
import ChartContainer from '../components/common/ChartContainer'

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444']

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 text-sm">
      <p className="font-semibold text-gray-900 mb-1.5">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  )
}

export default function Analytics() {
  const [ref, isInView] = useInView()
  const { values, results } = useCalculator()

  const yearlySummary = getYearlySummary(results.schedule)

  const pieData = [
    { name: 'Principal', value: values.loanAmount },
    { name: 'Interest', value: results.totalInterest }
  ]

  const lineData = yearlySummary.map(y => ({
    name: `Yr ${y.year}`,
    principal: y.principal,
    interest: y.interest,
    balance: y.balance
  }))

  const barData = yearlySummary.slice(0, 10).map(y => ({
    name: `Y${y.year}`,
    principal: y.principal,
    interest: y.interest
  }))

  return (
    <section id="analytics" ref={ref} className="w-full rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8" aria-labelledby="analytics-heading">
      <div className="mx-auto w-full">

        <SectionHeader
          badge="Analytics"
          title={<>Visualise your <span className="gradient-text">loan journey</span></>}
          subtitle="Interactive charts to help you understand your repayment pattern and optimise your loan strategy."
          isInView={isInView}
        />

        <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
          {/* Pie Chart */}
          <ChartContainer
            title="Principal vs Interest"
            isInView={isInView}
            index={0}
            className="min-h-[360px]"
          >
            <div className="w-full h-[260px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={900}
                  >
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom" height={32}
                    formatter={(v) => <span className="text-sm text-gray-600">{v}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 sm:gap-8 mt-4">
              <div className="text-center">
                <p className="text-xs text-gray-500">Principal</p>
                <p className="text-base font-bold text-blue-600">{formatCurrency(values.loanAmount)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Interest</p>
                <p className="text-base font-bold text-emerald-600">{formatCurrency(results.totalInterest)}</p>
              </div>
            </div>
          </ChartContainer>

          {/* Line Chart */}
          <ChartContainer
            title="Outstanding Balance Over Time"
            isInView={isInView}
            index={1}
            className="min-h-[360px]"
          >
            <div className="w-full h-[260px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false}
                    tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone" dataKey="balance" name="Balance"
                    stroke="#2563eb" strokeWidth={2.5}
                    dot={false} activeDot={{ r: 5, fill: '#2563eb' }}
                    animationDuration={1200}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>

          {/* Bar Chart */}
          <ChartContainer
            title="Yearly Payment Distribution"
            subtitle="(first 10 years)"
            isInView={isInView}
            index={2}
            className="md:col-span-2 min-h-[360px]"
          >
            <div className="w-full h-[260px] sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false}
                    tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="top" height={32}
                    formatter={(v) => <span className="text-sm text-gray-600">{v}</span>}
                  />
                  <Bar dataKey="principal" name="Principal" fill="#2563eb" radius={[4, 4, 0, 0]} animationDuration={900} />
                  <Bar dataKey="interest" name="Interest" fill="#10b981" radius={[4, 4, 0, 0]} animationDuration={900} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
          {[
            { label: 'Total EMIs', value: values.tenure, raw: true },
            { label: 'Total Payment', value: results.totalPayment },
            { label: 'Interest Cost', value: results.totalInterest },
            { label: 'Interest %', value: `${((results.totalInterest / values.loanAmount) * 100).toFixed(1)}%`, raw: true }
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4 }}
              className="card p-4 sm:p-5 text-center border border-gray-100"
            >
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-gray-900">
                {stat.raw ? stat.value : formatCurrency(stat.value)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
