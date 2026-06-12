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
  PanelLeftClose,
  PanelLeftOpen,
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

function Sidebar({ isCollapsed, onToggle, isMobileOpen, onClose, location, navigate, handleNavAction, handleLogout }) {
  const sidebarContent = (
    <>
      <div className={cn('flex items-center gap-3 border-b border-slate-200 pb-4', isCollapsed ? 'justify-center' : 'px-1')}>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
          <LayoutDashboard className="h-5 w-5" />
        </div>
        {!isCollapsed && (
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">LoanVix</p>
            <p className="truncate text-sm text-slate-500">Repayment workspace</p>
          </div>
        )}
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-1 text-sm text-slate-700">
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
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                isCollapsed && 'justify-center px-0'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <span
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl',
                  isActive ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              {!isCollapsed && <span className="truncate font-medium">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      <div className={cn('rounded-3xl border border-slate-200 bg-slate-50 p-4', isCollapsed && 'hidden')}>
        <p className="text-sm font-semibold text-slate-900">Focus mode</p>
        <p className="mt-2 text-sm text-slate-600">Review EMI plans, prepayment impact, and reports from a single premium workspace.</p>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className={cn(
          'mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50',
          isCollapsed && 'px-0'
        )}
      >
        <LogOut className="h-4 w-4" />
        {!isCollapsed && 'Logout'}
      </button>
    </>
  )

  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-slate-200 bg-white/95 px-4 py-4 backdrop-blur transition-all duration-300 lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
          isCollapsed ? 'lg:w-20 lg:px-3' : 'lg:w-[260px]'
        )}
      >
        {sidebarContent}
      </aside>

      <div className="fixed inset-y-0 left-0 z-40 hidden w-20 bg-transparent lg:block" />
      <button
        type="button"
        onClick={onToggle}
        className="fixed left-4 top-4 z-[60] hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:flex"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
      </button>
    </>
  )
}

function Header({ isCollapsed, isMobileOpen, onMobileToggle, onSidebarToggle, location, navigate, handleNavAction, handleLogout }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMobileToggle}
          className="rounded-full bg-slate-100 p-2 text-slate-700 transition hover:bg-slate-200 lg:hidden"
          aria-label={isMobileOpen ? 'Close navigation' : 'Open navigation'}
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div>
          <p className="text-sm font-semibold text-slate-900">LoanVix Dashboard</p>
          <p className="text-sm text-slate-500">Professional loan intelligence</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSidebarToggle}
          className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 lg:flex"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}

function MainContent({ children }) {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </div>
    </main>
  )
}

export default function LoanVixLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setIsMobileOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleNavAction = (item) => {
    setIsMobileOpen(false)

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
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="h-screen">
        <Sidebar
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed((value) => !value)}
          isMobileOpen={isMobileOpen}
          onClose={() => setIsMobileOpen(false)}
          location={location}
          navigate={navigate}
          handleNavAction={handleNavAction}
          handleLogout={handleLogout}
        />

        <div className={cn('flex h-screen flex-col transition-all duration-300', isCollapsed ? 'lg:ml-20' : 'lg:ml-[260px]')}>
          <Header
            isCollapsed={isCollapsed}
            isMobileOpen={isMobileOpen}
            onMobileToggle={() => setIsMobileOpen((value) => !value)}
            onSidebarToggle={() => setIsCollapsed((value) => !value)}
            location={location}
            navigate={navigate}
            handleNavAction={handleNavAction}
            handleLogout={handleLogout}
          />
          <MainContent>{children}</MainContent>
        </div>

        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
