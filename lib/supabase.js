// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

// Always check for env variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(`
    Missing Supabase credentials! 
    Add these to your .env.local file:
    
    NEXT_PUBLIC_SUPABASE_URL=your-project-ref.supabase.co
    NEXT_PUBLIC_SUPABASE_KEY=your-anon-key
  `)
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})