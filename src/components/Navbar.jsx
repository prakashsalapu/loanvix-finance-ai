import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, IndianRupee } from 'lucide-react'
import { useScrollPosition } from '../hooks/useScrollPosition'

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Features', href: '#features' },
  { name: 'Calculator', href: '#calculator' },
  { name: 'Analytics', href: '#analytics' },
  // { name: 'Schedule', href: '#schedule' },
  // { name: 'About', href: '#about' }
]

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const { scrollPosition } = useScrollPosition()

  const isScrolled = scrollPosition > 50

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map(link => link.href.slice(1))
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section)
        if (el && el.getBoundingClientRect().top <= 100) {
          setActiveSection(section)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 1024) setIsOpen(false) }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleNavClick = (href) => {
    setIsOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.nav
      role="navigation"
      aria-label="Main navigation"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-16',
        isScrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-md border-b border-gray-100'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); handleNavClick('#home') }}
            className="flex items-center gap-2 flex-shrink-0 rounded-lg"
            aria-label="LoanVix home"
          >
            <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center" aria-hidden="true">
              <IndianRupee className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">
              Loan<span className="gradient-text">Vix</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1" role="menubar">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.slice(1)
              return (
                <a
                  key={link.name}
                  href={link.href}
                  role="menuitem"
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium rounded-full transition-colors',
                    isActive ? 'text-white' : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 gradient-bg rounded-full"
                      transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </a>
              )
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden bg-white border-t border-gray-100 shadow-lg"
          >
            <nav className="px-4 py-3 space-y-1" aria-label="Mobile navigation">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.slice(1)
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'block px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                      isActive
                        ? 'gradient-bg text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    {link.name}
                  </a>
                )
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
