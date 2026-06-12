import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BarChart3,
  Calculator,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Repeat2,
  Settings2,
  Sparkles,
  User,
  X
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const dashboardNav = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Calculators', hash: '#loan-tools', icon: Calculator },
  { label: 'Repayments', hash: '#repayment-analysis', icon: Repeat2 },
  { label: 'EMI Analyzer', hash: '#loan-tools', icon: BarChart3 },
  { label: 'Prepayment Analyzer', hash: '#loan-tools', icon: Sparkles },
  { label: 'Reports', hash: '#reports', icon: FileText },
  { label: 'Profile', to: '/profile', icon: User },
  { label: 'Settings', to: '/settings', icon: Settings2 }
]

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname, location.hash])

  const handleNavAction = (item) => {
    setIsOpen(false)

    if (item.to) {
      navigate(item.to)
      return
    }

    if (location.pathname !== '/dashboard') {
      navigate({ pathname: '/dashboard', hash: item.hash })
      return
    }

    document.querySelector(item.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      <div className="min-h-screen lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-200 bg-white/95 px-5 py-6 backdrop-blur lg:sticky lg:top-0 lg:flex lg:h-screen">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-bg text-white shadow-lg shadow-sky-500/20">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">LoanVix Dashboard</p>
              <p className="text-sm text-slate-500">Your workspace for loan analytics</p>
            </div>
          </div>

          <nav className="mt-8 flex flex-1 flex-col gap-1 text-sm text-slate-700">
            {dashboardNav.map((item) => {
              const Icon = item.icon
              const isActive = item.to
                ? location.pathname === item.to
                : location.pathname === '/dashboard' && (location.hash === item.hash || (!location.hash && item.hash === '#loan-tools'))

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavAction(item)}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all duration-200',
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  <span className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-2xl',
                    isActive ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'
                  )}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Focus mode</p>
            <p className="mt-2 text-sm text-slate-600">Stay aligned with faster EMI review, prepayment planning, and export-ready reports.</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </aside>

        <div className="flex min-h-screen flex-col overflow-x-hidden">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">LoanVix Dashboard</p>
                <p className="text-sm text-slate-500">Smart loan intelligence</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-full bg-slate-100 p-2 text-slate-700 transition hover:bg-slate-200"
                aria-label={isOpen ? 'Close dashboard navigation' : 'Open dashboard navigation'}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </header>

          <AnimatePresence>
            {isOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
                  onClick={() => setIsOpen(false)}
                />
                <motion.aside
                  initial={{ x: -320, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -320, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                  className="fixed inset-y-0 left-0 z-50 flex w-[85%] max-w-xs flex-col border-r border-slate-200 bg-white px-5 py-6 shadow-2xl lg:hidden"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-5">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">LoanVix Dashboard</p>
                      <p className="text-sm text-slate-500">Navigation</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="rounded-full bg-slate-100 p-2 text-slate-700"
                      aria-label="Close dashboard navigation"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <nav className="mt-6 flex flex-col gap-1">
                    {dashboardNav.map((item) => {
                      const Icon = item.icon
                      const isActive = item.to
                        ? location.pathname === item.to
                        : location.pathname === '/dashboard' && (location.hash === item.hash || (!location.hash && item.hash === '#loan-tools'))

                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => handleNavAction(item)}
                          className={cn(
                            'flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition',
                            isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                          )}
                        >
                          <span className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-2xl',
                            isActive ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'
                          )}>
                            <Icon className="h-5 w-5" />
                          </span>
                          <span className="font-medium">{item.label}</span>
                        </button>
                      )
                    })}
                  </nav>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-auto flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
