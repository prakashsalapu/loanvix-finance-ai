import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

const GoogleLogo = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.045 12.251c0-.813-.073-1.587-.21-2.333H12.31v4.427h6.21c-.267 1.44-1.066 2.66-2.278 3.48v2.888h3.683c2.163-1.995 3.408-4.93 3.408-8.462Z" fill="#4285F4"/>
    <path d="M12.31 24c2.97 0 5.463-.98 7.284-2.66l-3.683-2.888c-1.02.69-2.318 1.1-3.601 1.1-2.766 0-5.115-1.868-5.955-4.38H2.468v2.749C4.27 21.78 8.032 24 12.31 24Z" fill="#34A853"/>
    <path d="M6.354 14.171a7.341 7.341 0 0 1 0-4.688V6.734H2.468a11.992 11.992 0 0 0 0 10.536l3.886-2.099Z" fill="#FBBC05"/>
    <path d="M12.31 4.78c1.616 0 3.067.555 4.213 1.644l3.156-3.156C17.772 1.213 15.273 0 12.31 0 8.032 0 4.27 2.22 2.468 5.734l3.886 2.749c.84-2.512 3.189-4.38 5.956-4.38Z" fill="#EA4335"/>
  </svg>
)

export default function GoogleSignInButton() {
  const { signInWithGoogle } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGoogleSignIn() {
    setError('')
    setIsLoading(true)

    const { error } = await signInWithGoogle()
    setIsLoading(false)

    if (error) {
      setError(error.message || 'Unable to sign in with Google.')
    }
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <GoogleLogo />
        {isLoading ? 'Continuing with Google…' : 'Continue with Google'}
      </button>
      {error && <p className="text-center text-sm text-red-600">{error}</p>}
    </div>
  )
}
