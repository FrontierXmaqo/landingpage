import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yhpsidiipdassknsggcz.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY

export function getSupabaseServerClient() {
  return createClient(supabaseUrl, supabaseKey as string)
}
