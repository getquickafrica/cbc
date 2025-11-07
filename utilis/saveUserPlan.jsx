// /utils/saveUserPlan.js
import { supabase } from '@/lib/supabaseClient';

/**
 * Create or update the user's plan safely.
 * Returns { data, error } from Supabase.
 */
export async function saveUserPlan(userId, plan) {
  if (!userId) throw new Error('userId required');

  // Option A: use upsert with onConflict (simple)
  const { data, error } = await supabase
    .from('user_plans')
    .upsert(
      {
        user_id: userId,
        plan,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString() // safe for inserts
      },
      { onConflict: 'user_id' } // requires user_id to be unique (you already created that constraint)
    );



  return { data, error };
}
