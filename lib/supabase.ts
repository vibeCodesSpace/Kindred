import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    // Return a dummy client or handle the error gracefully for build-time
    // In production, these should be present.
    console.warn('Supabase environment variables are missing');
  }
  
  return createBrowserClient(
    url || '',
    key || ''
  );
};
