import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HelpCircle,
  Calculator,
  TrendingUp,
  DollarSign,
  Zap,
  BarChart3,
  CheckCircle,
  Shield,
  Copy,
  Download,
  Lock,
  FileText,
  CreditCard,
  AlertCircle,
  Gauge,
  Activity
} from 'lucide-react'
import { useInView } from '../hooks/useScrollPosition'
import SectionHeader from '../components/common/SectionHeader'
import ResponsiveCard from '../components/common/ResponsiveCard'

const faqData = [
  {
    icon: HelpCircle,
    question: 'What is LoanVix?',
    answer: 'LoanVix is a modern loan intelligence tool that helps users analyze EMIs, explore prepayment strategies, compare repayment scenarios, and understand their loan journey through interactive visualizations. Instead of just calculating EMIs, LoanVix provides actionable insights into interest savings, tenure reduction, and repayment optimization, empowering borrowers to make smarter financial decisions.'
  },
  {
    icon: Calculator,
    question: 'How is EMI calculated?',
    answer: 'EMI (Equated Monthly Installment) is calculated using the standard formula: EMI = [P × R × (1 + R)^N] / [(1 + R)^N - 1], where P is the principal amount, R is the monthly interest rate (annual rate ÷ 12), and N is the total number of months. LoanVix uses this proven formula to provide accurate EMI calculations that account for all loan parameters including rate of interest, loan tenure, and any additional charges.'
  },
  {
    icon: TrendingUp,
    question: 'What is a loan prepayment?',
    answer: 'Loan prepayment (or advance payment) is when you pay more than your scheduled EMI amount or pay a lump sum towards your loan principal before the due date. This reduces your outstanding loan balance and can significantly decrease the total interest you pay over the loan tenure. Many loans allow prepayment without penalty, making it an effective strategy to save on interest costs.'
  },
  {
    icon: DollarSign,
    question: 'How much interest can I save through prepayments?',
    answer: 'Interest savings from prepayments depend on factors like the additional amount paid, when you pay it, your interest rate, and remaining tenure. Using LoanVix\'s Prepayment Analyzer, you can simulate different prepayment scenarios to see exactly how much interest you\'ll save. Even small regular prepayments can result in substantial savings over time - often thousands of rupees on longer tenures.'
  },
  {
    icon: Zap,
    question: 'What happens if I increase my monthly EMI?',
    answer: 'Increasing your monthly EMI reduces the loan tenure faster and minimizes total interest paid. For example, if you increase your EMI by ₹5,000, you\'ll finish paying your loan years earlier and save significant interest. LoanVix\'s EMI Increase Calculator lets you explore different scenarios - see exactly how tenure reduction and interest savings change based on your additional EMI amount.'
  },
  {
    icon: BarChart3,
    question: 'Can LoanVix reduce my loan tenure?',
    answer: 'LoanVix doesn\'t directly reduce your loan tenure - only prepayments or EMI increases can do that. However, LoanVix helps you plan and visualize how to reduce tenure. Through our Prepayment Analyzer and EMI Increase Calculator, you can determine the exact prepayment amount or EMI increase needed to achieve your desired tenure reduction, and track your progress over time.'
  },
  {
    icon: CheckCircle,
    question: 'How accurate are LoanVix calculations?',
    answer: 'LoanVix uses industry-standard financial formulas verified by financial experts. Our calculations account for monthly compounding, varying interest rates, and precise day counts. We\'ve tested our results against multiple banking systems and financial calculators. However, actual calculations may vary slightly based on your lender\'s specific methodology, so always verify critical numbers with your lender.'
  },
  {
    icon: Shield,
    question: 'Does LoanVix store my financial data?',
    answer: 'No, LoanVix operates entirely in your browser. Your loan details, calculations, and financial information are never stored on our servers. All data remains on your device and is cleared when you close your browser. We don\'t track, sell, or share your financial information with any third parties. Your financial privacy is our top priority.'
  },
  {
    icon: Copy,
    question: 'Can I compare multiple loan scenarios?',
    answer: 'Yes! LoanVix\'s Scenario Comparison feature is perfect for this. You can create and compare multiple loan scenarios side-by-side with different parameters like principal amount, interest rate, tenure, prepayment strategies, or EMI increases. This helps you evaluate different loan options or strategies and choose the best path forward for your financial goals.'
  },
  {
    icon: Activity,
    question: 'Is LoanVix free to use?',
    answer: 'Yes, LoanVix is completely free! All our calculators, analytics tools, scenario comparison features, and prepayment analyzers are available at no cost. We don\'t charge any subscription fees, hidden charges, or premium tiers. Our goal is to make professional-grade loan planning tools accessible to everyone.'
  },
  {
    icon: FileText,
    question: 'What is an amortization schedule?',
    answer: 'An amortization schedule is a detailed month-by-month breakdown of your loan repayment. It shows each EMI payment, the portion going to principal, the portion going to interest, and your remaining loan balance after each payment. This schedule helps you understand exactly how your loan principal decreases over time and how interest is calculated each month. LoanVix generates detailed, exportable amortization schedules.'
  },
  {
    icon: Gauge,
    question: 'How does the Loan Prepayment Analyzer work?',
    answer: 'The Prepayment Analyzer simulates different prepayment strategies and shows their impact on your loan. You input your loan details and prepayment amounts, and the tool calculates how much tenure you\'ll save and how much interest you\'ll reduce. You can model lump-sum payments, regular monthly prepayments, or year-end bonuses - seeing exactly which strategy works best for your situation.'
  },
  {
    icon: Download,
    question: 'Can I export my reports?',
    answer: 'Yes! LoanVix lets you export your amortization schedule and analysis reports as PDF or CSV files. PDFs are formatted beautifully for sharing or printing, while CSV files are perfect for further analysis in Excel or other tools. You can export your full schedule, yearly breakdowns, or scenario comparison reports with just one click.'
  },
  {
    icon: CreditCard,
    question: 'Which types of loans are supported?',
    answer: 'LoanVix supports most fixed-rate and floating-rate personal loans, home loans (mortgages), auto loans, and business loans. Any loan with a fixed or variable interest rate and a defined tenure can be analyzed using our tools. We support different compounding frequencies and interest calculation methods used by various lenders. If you have a specific loan type in mind, our universal calculator should handle it.'
  },
  {
    icon: Lock,
    question: 'Is my data secure?',
    answer: 'Your data is secure because we don\'t store it. All calculations happen locally in your browser using encrypted client-side processing. We don\'t use any external APIs to transmit your financial data, and we never collect or store personal or financial information. Your device is the only place your data exists - once you close LoanVix, it\'s gone. No data, no risk.'
  }
]

export default function FAQ() {
  const [ref, isInView] = useInView()
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [showAll, setShowAll] = useState(false)

  const toggleAccordion = useCallback((index) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }, [expandedIndex])

  const memoizedFaqData = useMemo(() => faqData, [])
  
  const displayedFaqData = useMemo(() => {
    return showAll ? memoizedFaqData : memoizedFaqData.slice(0, 5)
  }, [memoizedFaqData, showAll])

  return (
    <section 
      id="faq" 
      ref={ref} 
      className="py-16 lg:py-24 bg-white"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          badge="FAQ"
          title={<>Frequently Asked <span className="gradient-text">Questions</span></>}
          subtitle="Everything you need to know about loans, EMIs, prepayments, and LoanVix tools."
          isInView={isInView}
        />

        <div className="space-y-3 sm:space-y-4">
          {displayedFaqData.map((item, index) => {
            const IconComponent = item.icon
            const isExpanded = expandedIndex === index

            return (
              <motion.div
                key={index}
                initial={false}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  duration: 0.3,
                  delay: isInView ? index * 0.05 : 0
                }}
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleAccordion(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      toggleAccordion(index)
                    }
                  }}
                  className="group cursor-pointer"
                  aria-expanded={isExpanded}
                  aria-controls={`faq-answer-${index}`}
                >
                  <motion.div
                    className="card p-3 sm:p-4 lg:p-6 border border-gray-100 transition-all duration-300 hover:border-blue-200 hover:shadow-md focus-within:ring-2 focus-within:ring-blue-500 outline-none"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-start gap-2 sm:gap-3 lg:gap-4">
                      <div 
                        className="flex-shrink-0 mt-0.5 sm:mt-1 w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl gradient-bg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                        aria-hidden="true"
                      >
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 sm:gap-3">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
                            {item.question}
                          </h3>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
                            className="flex-shrink-0 mt-1"
                            aria-hidden="true"
                          >
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-500 transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                              />
                            </svg>
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key="faq-answer"
                          id={`faq-answer-${index}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ 
                            opacity: 1, 
                            height: 'auto',
                            transition: {
                              height: {
                                duration: 0.3,
                                type: 'spring',
                                stiffness: 300,
                                damping: 30
                              },
                              opacity: {
                                duration: 0.2,
                                delay: 0.1
                              }
                            }
                          }}
                          exit={{ 
                            opacity: 0, 
                            height: 0,
                            transition: {
                              height: {
                                duration: 0.3,
                                type: 'spring',
                                stiffness: 300,
                                damping: 30
                              },
                              opacity: {
                                duration: 0.15
                              }
                            }
                          }}
                          className="overflow-hidden"
                        >
                          <p className="pt-3 sm:pt-4 text-sm sm:text-base text-gray-600 leading-relaxed border-t border-gray-100 mt-3 sm:mt-4">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Show More Button */}
        {!showAll && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="flex justify-center mt-8 sm:mt-10"
          >
            <button
              onClick={() => setShowAll(true)}
              className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg font-semibold text-white gradient-bg hover:shadow-lg transition-shadow active:scale-95"
              aria-label="Show more FAQ items"
            >
              Show More
            </button>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 sm:mt-12 lg:mt-16 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-50 to-green-50 border border-blue-100"
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Didn't find your answer?</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                If you have additional questions or need support, our tools are designed to be self-explanatory. Try exploring the calculator, checking the detailed amortization schedule, or comparing different scenarios to find the insights you need.
              </p>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                All calculations are performed locally on your device with no data stored or transmitted.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
