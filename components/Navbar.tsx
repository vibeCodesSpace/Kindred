'use client';

import { useAuth } from './AuthProvider';
import { LogIn, LogOut, Users, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const { user, signInWithGoogle, signOut } = useAuth();

  const userPhoto = user?.user_metadata?.avatar_url;

  return (
    <nav className="border-b border-black/5 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900">Kindred</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/" className="text-zinc-600 hover:text-zinc-900 font-medium text-sm flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Circles
                </Link>
                <div className="h-8 w-px bg-zinc-200 mx-2" />
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
                {userPhoto && (
                  <div className="relative w-8 h-8">
                    <Image 
                      src={userPhoto} 
                      alt="Profile" 
                      fill 
                      className="rounded-full border border-zinc-200 object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Join Kindred
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
