import AuthLayout from '../components/auth/AuthLayout'
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm'

export default function ForgotPassword() {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we’ll send you a secure password reset link."
      footerText="Remembered your password?"
      footerLink="/login"
      footerLinkText="Sign in"
      backLink="/"
      backLinkText="← Back to Homepage"
    >
      <div className="space-y-6">
        <ForgotPasswordForm />
      </div>
    </AuthLayout>
  )
}
