import { motion } from 'framer-motion'
import { IndianRupee } from 'lucide-react'
import { Link } from 'react-router-dom'

function LogoMark() {
  return (
    <Link to="" className=" pointer-events-none inline-flex items-center gap-2 rounded-full transition hover:opacity-90">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-600 to-cyan-500 text-white shadow-lg shadow-sky-700/20">
        <IndianRupee className="h-5 w-5" />
      </div>
      <span className="text-lg font-bold ">
        Loan<span className="gradient-text">Vix</span>
      </span>
    </Link>
  )
}

export default function AuthLayout({ title, subtitle, children, footerText, footerCta, footerLink, footerLinkText, backLink, backLinkText }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="relative overflow-hidden">
      <div className="mx-auto grid min-h-screen w-full max-w-[1800px] grid-cols-1 md:grid-cols-[0.95fr_1.05fr] xl:grid-cols-[1fr_1fr]">
          <motion.section
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="relative hidden flex-col justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-sky-700 px-10 py-12 text-white md:flex"
          >
            <div className="pointer-events-none absolute -right-20 top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl animate-[pulse_10s_ease-in-out_infinite]" />
            <div className="pointer-events-none absolute -left-16 top-36 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl" />
            <div className="pointer-events-none absolute right-10 bottom-12 h-52 w-52 rounded-full bg-slate-200/10 blur-2xl" />
            {backLink && backLinkText && (
              <Link
                to={backLink}
                className="absolute right-6 top-6 z-20 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:text-white hover:bg-white/20"
              >
                {backLinkText}
              </Link>
            )}
            <div className="relative z-10 flex flex-col items-center justify-center gap-10 text-center">
              <div className="space-y-8 max-w-2xl">
                <div className="mx-auto inline-flex items-center gap-3 rounded-3xl bg-white/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-100 ring-1 ring-white/20 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.8)]">
                  <LogoMark />
                </div>
                <div className="space-y-6">
                  <h1 className="text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl">
                    Hello,<br />
                    Future Planner! <span className="inline-block">👋</span>
                  </h1>
                  <p className="max-w-xl text-base leading-8 text-slate-200/90 sm:text-lg">
                    LoanVix is your AI Financial Planner and Smart Loan Calculator.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    'AI-Powered Insights',
                    'Smart Loan Calculations',
                    'Plan. Save. Achieve.'
                  ].map((item) => (
                    <div key={item} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_25px_80px_-60px_rgba(14,165,233,0.85)] backdrop-blur-sm">
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
             
            </div>
          </motion.section>

          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="relative flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 lg:px-10"
          >
            <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-sky-100/70 to-transparent blur-3xl" />
            <div className="absolute right-8 top-24 hidden h-24 w-24 rounded-full bg-slate-900/10 blur-2xl lg:block" />
            <div className="absolute left-8 bottom-24 hidden h-24 w-24 rounded-full bg-cyan-100/50 blur-2xl lg:block" />
            <div className="relative w-full max-w-xl rounded-[2rem] bg-white/95 px-6 py-8 shadow-2xl shadow-slate-200/40 ring-1 ring-slate-900/5 backdrop-blur-sm sm:px-8 sm:py-10">
              <div className="absolute right-0 top-0 -z-10 hidden h-44 w-44 rounded-full bg-sky-500/10 blur-3xl lg:block" />
              <div className="absolute left-0 bottom-0 -z-10 hidden h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl lg:block" />
              
              <div className="absolute right-10 bottom-14 hidden h-28 w-28 rounded-full bg-cyan-100/20 blur-xl lg:block" />
              <div className="mb-10 space-y-4">

                <div>
                  <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{subtitle}</p>
                </div>
              </div>
              {children}
              {footerText && (
                <div className="mt-10 text-center text-sm text-slate-600 sm:text-base">
                  {footerText}{' '}
                  <Link
                    to={footerLink}
                    className="font-semibold text-slate-900 transition hover:text-sky-600"
                  >
                    {footerLinkText}
                  </Link>
                </div>
              )}
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  )
}
