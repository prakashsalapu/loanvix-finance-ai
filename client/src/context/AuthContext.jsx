import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../services/supabase'
import * as authService from '../services/authService'
import * as profileService from '../services/profileService'

export const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const initializedRef = useRef(false)

  async function syncProfile(user) {
    if (!user) {
      setProfile(null)
      return
    }

    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      ''

    const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || null
    const profileData = {
      user_id: user.id,
      full_name: fullName,
      avatar_url: avatarUrl
    }

    const { data, error } = await profileService.upsertProfile(profileData)
    if (error) {
      console.warn('Failed to sync user profile', error)
      return
    }

    setProfile(data)
  }

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    let subscription

    async function initializeAuth() {
      let sessionData = null
      const { data } = await supabase.auth.getSession()
      sessionData = data.session

      setSession(sessionData)
      setUser(sessionData?.user ?? null)
      setLoading(false)

      if (sessionData?.user) {
        await syncProfile(sessionData.user)
      }

      const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          await syncProfile(session.user)
        } else {
          setProfile(null)
        }
      })

      subscription = listener.subscription
    }

    initializeAuth()

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const displayName = useMemo(() => {
    if (profile?.full_name) return profile.full_name
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name
    if (user?.user_metadata?.name) return user.user_metadata.name
    if (user?.email) return user.email.split('@')[0]
    return ''
  }, [profile, user])

  const avatarUrl = useMemo(() => {
    return profile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture || ''
  }, [profile, user])

  const value = useMemo(
    () => ({
      user,
      profile,
      displayName,
      avatarUrl,
      session,
      loading,
      isAuthenticated: Boolean(user),
      signUpWithEmail: authService.signUpWithEmail,
      resendVerificationEmail: authService.resendVerificationEmail,
      signInWithEmail: authService.signInWithEmail,
      signInWithGoogle: authService.signInWithGoogle,
      sendPasswordResetEmail: authService.sendPasswordResetEmail,
      updatePassword: authService.updatePassword,
      signOut: authService.signOut
    }),
    [user, profile, displayName, avatarUrl, session, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
