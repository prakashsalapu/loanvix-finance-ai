import { motion } from 'framer-motion'

export default function ResponsiveCard({
  children,
  className = '',
  isInView,
  delay = 0,
  whileHover = true,
  index = 0,
  animate = true,
  ...props
}) {
  const baseClasses = 'card p-5 sm:p-6 lg:p-7 border border-gray-100'
  
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 24 } : { opacity: 1, y: 0 }}
      animate={animate && isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: delay || index * 0.07 }}
      whileHover={whileHover ? { y: -3 } : {}}
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
