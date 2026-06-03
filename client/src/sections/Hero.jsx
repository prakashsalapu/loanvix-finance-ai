import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useInView, useAnimatedCounter } from '../hooks/useScrollPosition'

export default function Hero() {
  const [ref, isInView] = useInView()
  const { count: usersCount, animate: animateUsers } = useAnimatedCounter(46000, 1800)
  const { count: loansCount, animate: animateLoans } = useAnimatedCounter(2320000000, 1800)

  useEffect(() => {
    if (isInView) {
      animateUsers()
      animateLoans()
    }
  }, [isInView, animateUsers, animateLoans])

  return (
    <section
      id="home"
      ref={ref}
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-4 sm:pt-16 lg:pt-20"
      aria-labelledby="hero-heading"
    >
      {/* Subtle background blobs  -  pointer-events disabled, aria-hidden */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 -left-32 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-12 lg:pt-16 pb-16 sm:pb-20 lg:pb-24 relative z-10 w-full">
        <div className="text-center max-w-4xl mx-auto">

          {/* BADGE */}

<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.5 }}
  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-6"
>

  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

  Calculate Any Loan Instantly

</motion.div>        

          {/* Heading  -  clamp font size to prevent overflow on small screens */}
          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="font-bold text-gray-900 leading-tight mb-6 sm:mb-7 text-balance"
            style={{ fontSize: 'clamp(2rem, 5.5vw, 4.5rem)' }}
          >
            Financial Planning
            <br />
            <span className="gradient-text">Made Simple</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2 sm:px-0"
          >
            Calculate EMIs, visualise loan analytics, and plan your finances with our
            comprehensive loan calculator. Make informed decisions for a better financial future.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16"
          >
            <Link
              to="/register"
              className="btn btn-primary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 w-full sm:w-auto"
            >
              Start Calculating
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="btn btn-secondary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 w-full sm:w-auto"
            >
              Learn More
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
            role="list"
            aria-label="Key statistics"
          >
            {[
              { label: 'Active Users', value: `${(usersCount / 1000).toFixed(0)}K+` },
              { label: 'Loans Calculated', value: `₹${(loansCount / 10000000).toFixed(0)}Cr+` },
              { label: 'EMI Calculations', value: '1M+' },
              { label: 'User Satisfaction', value: '99%' }
            ].map((stat) => (
              <div key={stat.label} className="text-center" role="listitem">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-1 sm:mb-2" aria-label={stat.value}>
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 text-balance">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
