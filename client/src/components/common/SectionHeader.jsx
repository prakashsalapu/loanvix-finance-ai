import { motion } from 'framer-motion'

export default function SectionHeader({ 
  badge, 
  title, 
  subtitle, 
  isInView,
  className = '' 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={`text-center max-w-3xl mx-auto mb-12 ${className}`}
    >
      {badge && (
        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4 border border-blue-100">
          {badge}
        </span>
      )}
      {title && (
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-balance leading-tight">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
