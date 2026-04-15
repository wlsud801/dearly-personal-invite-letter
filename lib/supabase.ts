import { createClient } from '@supabase/supabase-js'

export type Message = {
  id: string
  text: string
  from_name: string
  password?: string
  created_at: string
}

export function createSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
