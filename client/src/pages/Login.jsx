import AuthLayout from '../components/auth/AuthLayout'
import LoginForm from '../components/auth/LoginForm'
import GoogleSignInButton from '../components/auth/GoogleSignInButton'

export default function Login() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account and continue building your smarter loan strategy."
      footerText="New to LoanVix?"
      footerLink="/register"
      footerLinkText="Create an account"
      backLink="/"
      backLinkText="← Back to Homepage"
    >
      <div className="space-y-6">
        <LoginForm />
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-px bg-slate-200" />
          <div className="relative mx-auto flex w-full max-w-sm items-center justify-center text-xs uppercase tracking-[0.35em] text-slate-400">
            or continue with
          </div>
        </div>
        <GoogleSignInButton />
      </div>
    </AuthLayout>
  )
}
