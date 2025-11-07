
'use client';
import { supabase } from '@/lib/supabaseClient';


export async function checkUserAndPlan(user, loading, router) {
  if (loading) return; // Wait for auth to finish loading

  // 🔹 If user not signed in
  if (!user) {
    router.push('/auth');
    return;
  }

  // 🔹 Check if user has a plan in Supabase
  const { data, error } = await supabase
    .from('user_plans')
    .select('plan')
    .eq('user_id', user.id)
    .single();

  // 🔹 Redirect if no plan or error
  if (error || !data?.plan) {
    router.push('/pricing');
    return;
  }

  // ✅ All good — user can continue
  return true;
}
