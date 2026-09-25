import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL } from '@/lib/supabase/url'

const supabaseKey = process.env.SUPABASE_KEY

export function getSupabaseServerClient() {
  return createClient(SUPABASE_URL, supabaseKey as string)
}
