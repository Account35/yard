import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

import { requireEnv } from "./env";

const env = requireEnv();

/** The one typed Supabase client. Uses the public anon key only. */
export const supabase = createClient<Database>(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
