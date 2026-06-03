import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LayoutDashboard, Calculator, FileText, User, Settings2, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const dashboardNav = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Calculators', hash: '#loan-tools', icon: Calculator },
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

  const handleNavAction = (item) => {
    setIsOpen(false)
    if (item.to) {
      navigate(item.to)
      return
    }
    document.querySelector(item.hash)?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="lg:flex lg:min-h-screen">
        <aside className="hidden lg:flex w-80 shrink-0 flex-col border-r border-slate-200 bg-white px-6 py-8">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-6">
            <div className="w-11 h-11 rounded-2xl gradient-bg flex items-center justify-center text-white">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">LoanVix Dashboard</p>
              <p className="text-sm text-slate-500">Your workspace for loan analytics</p>
            </div>
          </div>

          <nav className="mt-8 flex flex-col gap-2 text-sm text-slate-700">
            {dashboardNav.map((item) => {
              const Icon = item.icon
              const isActive = item.to ? location.pathname === item.to : false
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavAction(item)}
                  className={cn(
                    'flex items-center gap-3 rounded-3xl px-4 py-3 text-left transition',
                    isActive ? 'bg-slate-900 text-white shadow-sm' : 'hover:bg-slate-50'
                  )}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="mt-auto pt-6">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex-1">
          <div className="border-b border-slate-200 bg-white/90 px-4 py-4 lg:hidden">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">LoanVix Dashboard</p>
                <p className="text-sm text-slate-500">Your workspace for loan analytics</p>
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
            {isOpen && (
              <nav className="mt-4 space-y-2">
                {dashboardNav.map((item) => {
                  const Icon = item.icon
                  const isActive = item.to ? location.pathname === item.to : false
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleNavAction(item)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm transition',
                        isActive ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      )}
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </nav>
            )}
          </div>

          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
