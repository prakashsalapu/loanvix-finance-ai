import AuthLayout from '../components/auth/AuthLayout'
import RegisterForm from '../components/auth/RegisterForm'
import GoogleSignInButton from '../components/auth/GoogleSignInButton'

export default function Register() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start planning smarter and take control of your financial future."
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkText="Log in"
      backLink="/"
      backLinkText="← Back to Homepage"
    >
      <div className="space-y-6">
        <RegisterForm />

        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-px bg-slate-200" />
          <div className="relative mx-auto flex w-full max-w-sm items-center justify-center py-4 text-xs uppercase tracking-[0.35em] text-slate-400">
            or continue with
          </div>
        </div>

        <GoogleSignInButton />

        
      </div>
    </AuthLayout>
  )
}
