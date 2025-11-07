'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Handle OAuth callback & redirect the user to the homepage
    async function handleCallback() {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error('Error getting session:', error);

      // Wait a bit to ensure Supabase has updated the session
      setTimeout(() => {
        router.push('/');
      }, 500);
    }

    handleCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-semibold">Finishing sign-in, please wait...</p>
    </div>
  );
}
