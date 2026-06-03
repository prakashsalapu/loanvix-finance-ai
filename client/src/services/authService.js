import { supabase } from './supabase'

const defaultVerificationRedirect = `${window.location.origin}/verify-email`
const defaultResetRedirect = `${window.location.origin}/reset-password`

export async function signUpWithEmail(fullName, email, password) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: defaultVerificationRedirect
    }
  })
}

export async function resendVerificationEmail(email, password) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: defaultVerificationRedirect
    }
  })
}

export async function signInWithEmail(email, password) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`
    }
  })
}

export async function sendPasswordResetEmail(email) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: defaultResetRedirect
  })
}

export async function updatePassword(password) {
  return supabase.auth.updateUser({ password })
}

export async function getCurrentSession() {
  return supabase.auth.getSession()
}

export async function getCurrentUser() {
  return supabase.auth.getUser()
}

export async function signOut() {
  return supabase.auth.signOut()
}
