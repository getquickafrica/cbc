'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);
  const router = useRouter();

  // Check session when app starts
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };
    getSession();

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // If user logs in, check if they have a plan
  useEffect(() => {
    const checkPlan = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('user_plans')
        .select('plan')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') console.error(error);

      if (!data) {
        // user has no plan → redirect to pricing
        router.push('/pricing');
      } else {
        setPlan(data.plan);
      }
    };

    checkPlan();
  }, [user]);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/pricing` },
    });
    if (error) console.error('Google sign-in error:', error.message);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error);
    router.push('/');
  };

  const value = {
    user,
    session,
    loading,
    plan,
    signInWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
