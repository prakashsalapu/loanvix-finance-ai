import { motion } from 'framer-motion'
import {
  Calculator,
  PieChart,
  BarChart3,
  Wallet,
  FileSpreadsheet,
  Smartphone
} from 'lucide-react'
import { useInView } from '../hooks/useScrollPosition'
import SectionHeader from '../components/common/SectionHeader'
import ResponsiveCard from '../components/common/ResponsiveCard'

const features = [
  {
    icon: Calculator,
    title: 'EMI Calculation',
    description: 'Calculate accurate EMIs instantly with a proven formula that accounts for all loan parameters.'
  },
  {
    icon: PieChart,
    title: 'Loan Breakdown',
    description: 'Visualise principal and interest components with intuitive pie charts and interactive graphs.'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Comprehensive analytics with year-wise breakdowns and payment trend visualisations.'
  },
  {
    icon: Wallet,
    title: 'Prepayment Tracking',
    description: 'Instantly see how prepayments reduce your tenure and total interest cost.'
  },
  {
    icon: FileSpreadsheet,
    title: 'PDF & CSV Export',
    description: 'Download your full amortisation schedule as a formatted PDF or CSV for your records.'
  },
  {
    icon: Smartphone,
    title: 'Fully Responsive',
    description: 'Seamlessly use LoanVix across mobile, tablet, and desktop with a touch-friendly UI.'
  }
]

export default function Features() {
  const [ref, isInView] = useInView()

  return (
    <section id="features" ref={ref} className="pt-8 sm:pt-16 lg:pt-24 pb-16 lg:pb-24 bg-gray-50" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader
          badge="Features"
          title={<>Everything you need for <span className="gradient-text">smart loan planning</span></>}
          subtitle="Our comprehensive toolkit helps you make informed financial decisions with powerful calculators and insightful analytics."
          isInView={isInView}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((feature, index) => (
            <ResponsiveCard
              key={index}
              isInView={isInView}
              index={index}
              className="group focus-within:ring-2 focus-within:ring-blue-500"
              role="article"
            >
              <div
                className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform"
                aria-hidden="true"
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{feature.description}</p>
            </ResponsiveCard>
          ))}
        </div>
      </div>
    </section>
  )
}
