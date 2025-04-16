import { createClient } from "@supabase/supabase-js"

// Add type safety and error handling for environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// You can also add a typed version if you have database types
// import { Database } from '@/types/supabase';
// export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
