'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/components/AuthProvider';
import Hero from '@/components/Hero';
import { Users, Plus, Loader2, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { researchAppIdeas } from '@/lib/research';
import CreateCircleModal from '@/components/CreateCircleModal';

export default function Home() {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [researching, setResearching] = useState(false);
  const [researchResult, setResearchResult] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setCommunities([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'communities'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCommunities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => {
      console.error("Firestore error:", err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleResearch = async () => {
    setResearching(true);
    try {
      const result = await researchAppIdeas();
      setResearchResult(result);
    } catch (error) {
      console.error("Research failed:", error);
    } finally {
      setResearching(false);
    }
  };

  return (
    <main className="min-h-screen pb-20">
      <Hero />

      <CreateCircleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900">Active Circles</h2>
            <p className="text-zinc-600 mt-1">Join a community and start connecting.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleResearch}
              disabled={researching}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors disabled:opacity-50"
            >
              {researching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              AI Research Trends
            </button>
            {user && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Circle
              </button>
            )}
          </div>
        </div>

        {researchResult && (
          <div className="mb-12 p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
            <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI Connection Insights
            </h3>
            <div className="prose prose-emerald max-w-none text-emerald-800 text-sm whitespace-pre-wrap">
              {researchResult}
            </div>
            <button 
              onClick={() => setResearchResult(null)}
              className="mt-4 text-xs font-bold text-emerald-600 uppercase tracking-wider hover:text-emerald-700"
            >
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <Link
                key={community.id}
                href={`/communities/${community.id}`}
                className="group p-6 bg-white rounded-2xl border border-zinc-200 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/5 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                    <Users className="w-6 h-6 text-zinc-600 group-hover:text-emerald-600" />
                  </div>
                  <span className="text-xs font-medium text-zinc-400 bg-zinc-50 px-2 py-1 rounded-md">
                    {community.members?.length || 0} members
                  </span>
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">{community.name}</h3>
                <p className="text-zinc-600 text-sm line-clamp-2">{community.description}</p>
                <div className="mt-6 flex items-center text-sm font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                  Join Discussion →
                </div>
              </Link>
            ))}
            {communities.length === 0 && (
              <div className="col-span-full py-20 text-center bg-zinc-100/50 rounded-3xl border-2 border-dashed border-zinc-200">
                <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <p className="text-zinc-500 font-medium">No circles found. Be the first to create one!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
