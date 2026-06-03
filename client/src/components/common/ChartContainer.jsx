import { motion } from 'framer-motion'
import ResponsiveCard from './ResponsiveCard'

export default function ChartContainer({
  title,
  subtitle,
  children,
  className = '',
  isInView,
  delay = 0,
  index = 0,
  ...props
}) {
  return (
    <ResponsiveCard 
      isInView={isInView}
      delay={delay}
      index={index}
      className={className}
      {...props}
    >
      {title && (
        <h3 className="text-base font-semibold text-gray-900 mb-5">
          {title}
          {subtitle && (
            <span className="text-xs text-gray-400 font-normal ml-2">{subtitle}</span>
          )}
        </h3>
      )}
      <div className="w-full overflow-x-auto -mx-5 sm:-mx-6 lg:-mx-7">
        <div className="px-5 sm:px-6 lg:px-7 min-w-min">
          {children}
        </div>
      </div>
    </ResponsiveCard>
  )
}
