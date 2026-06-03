import { supabase } from './supabase'

export async function getProfile(userId) {
  return supabase
    .from('profiles')
    .select('full_name, avatar_url, created_at, updated_at')
    .eq('user_id', userId)
    .single()
}

export async function upsertProfile(profile) {
  return supabase
    .from('profiles')
    .upsert(profile)
    .select()
    .single()
}
