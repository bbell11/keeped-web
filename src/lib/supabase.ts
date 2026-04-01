import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

/**
 * Returns a Supabase client using the service role key.
 * Server-side only — this key must never be sent to the browser.
 * Used for trusted insertions (e.g. waitlist) where no RLS policy is needed.
 */
export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error(
        "Supabase environment variables are not configured. " +
          "Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set."
      );
    }

    _supabase = createClient(url, key, {
      auth: {
        // Service role client — no session persistence needed
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return _supabase;
}
