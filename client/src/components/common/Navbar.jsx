import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, IndianRupee, LayoutDashboard, User, LogOut, Settings2 } from 'lucide-react'
import { useScrollPosition } from '../../hooks/useScrollPosition'
import { useAuth } from '../../hooks/useAuth'

const publicNavLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Features', href: '#features' },
  { name: 'FAQ', href: '#faq' }
]

const authNavLinks = [
  { name: 'Dashboard', to: '/dashboard' },
  { name: 'Profile', to: '/profile' }
]

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const { scrollPosition } = useScrollPosition()
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, signOut } = useAuth()

  const isScrolled = scrollPosition > 50
  const navLinks = isAuthenticated ? authNavLinks : publicNavLinks

  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('')
      return
    }

    const handleScroll = () => {
      const sections = publicNavLinks.map(link => link.href.slice(1))
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section)
        if (el && el.getBoundingClientRect().top <= 100) {
          setActiveSection(section)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location.pathname])

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 1024) setIsOpen(false) }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleNavClick = (href) => {
    setIsOpen(false)

    if (location.pathname !== '/') {
      navigate({ pathname: '/', hash: href })
      return
    }

    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
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
          <button
            type="button"
            onClick={() => handleNavClick('#home')}
            className="flex items-center gap-2 flex-shrink-0 rounded-lg"
            aria-label="LoanVix home"
          >
            <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center" aria-hidden="true">
              <IndianRupee className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">
              Loan<span className="gradient-text">Vix</span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-4" role="menubar">
            {navLinks.map((link) => {
              const isActive = link.to ? location.pathname === link.to : activeSection === link.href.slice(1)
              return link.to ? (
                <Link
                  key={link.name}
                  to={link.to}
                  role="menuitem"
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
                </Link>
              ) : (
                <button
                  key={link.name}
                  type="button"
                  onClick={() => handleNavClick(link.href)}
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
                </button>
              )
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            )}
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
            <nav className="px-3 py-2 space-y-1" aria-label="Mobile navigation">
              {navLinks.map((link) => {
                const isActive = link.to ? location.pathname === link.to : activeSection === link.href.slice(1)
                return link.to ? (
                  <Link
                    key={link.name}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'block rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                      isActive ? 'gradient-bg text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <button
                    key={link.name}
                    type="button"
                    onClick={() => handleNavClick(link.href)}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'w-full text-left rounded-lg px-4 py-3 text-sm font-medium transition-colors active:scale-95',
                      isActive ? 'gradient-bg text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    {link.name}
                  </button>
                )
              })}
            </nav>
            <div className="border-t border-slate-100 px-4 py-4">
              {!isAuthenticated ? (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block rounded-full bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block rounded-full border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false)
                    handleLogout()
                  }}
                  className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
