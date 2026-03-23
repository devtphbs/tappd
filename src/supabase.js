import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Authentication functions
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback)
}

// User settings functions
export async function getUserSettings(userId) {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  return { data, error }
}

export async function updateUserSettings(userId, settings) {
  const { data, error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: userId,
      ...settings,
      updated_at: new Date().toISOString()
    })
    .select()
    .single()
  
  return { data, error }
}

// Receipt functions for Supabase
export async function syncReceiptToSupabase(receipt) {
  const { data, error } = await supabase
    .from('receipts')
    .upsert({
      ...receipt,
      synced_at: new Date().toISOString()
    })
    .select()
    .single()
  
  return { data, error }
}

export async function getReceiptsFromSupabase(userId) {
  const { data, error } = await supabase
    .from('receipts')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
  
  return { data, error }
}
