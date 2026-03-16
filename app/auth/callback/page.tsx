'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.search);
      if (error) {
        console.error('Error exchanging code:', error.message);
      }
      
      if (window.opener) {
        window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
        window.close();
      } else {
        router.push('/');
      }
    };

    handleCallback();
  }, [router, supabase.auth]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-zinc-600 font-medium">Completing sign in...</p>
      </div>
    </div>
  );
}
