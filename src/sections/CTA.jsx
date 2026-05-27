import { motion } from 'framer-motion'
import { useInView } from '../hooks/useScrollPosition'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function CTA() {
  const [ref, isInView] = useInView()

  return (
    <section id="about" ref={ref} className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl gradient-bg p-8 sm:p-12 lg:p-16 text-center"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              Start Planning Today
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 sm:mb-6 text-balance leading-tight"
            >
              Ready to take control of
              <br />
              your financial future?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed"
            >
              Join thousands of users who have made smarter financial decisions with LoanVix.
              Calculate, analyse, and plan your loans with confidence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
            >
              <a
                href="#calculator"
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector('#calculator')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-white text-gray-900 font-semibold hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 w-full sm:w-auto justify-center"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="#features"
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors border border-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 w-full sm:w-auto justify-center"
              >
                Explore Features
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
