export default function AuthCard({ children }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40">
      <div className="mb-8 space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-sky-600">LoanVix</p>
        <h2 className="text-3xl font-semibold text-slate-900">Secure account access</h2>
        <p className="mx-auto max-w-xl text-sm leading-7 text-slate-600">
          Fast, responsive authentication built with Supabase and designed to feel native to LoanVix.
        </p>
      </div>
      {children}
    </div>
  )
}
