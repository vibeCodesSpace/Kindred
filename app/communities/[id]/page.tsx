'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { useAuth } from '@/components/AuthProvider';
import ChatRoom from '@/components/ChatRoom';
import { Users, Sparkles, Loader2, MessageSquare, Calendar, Info } from 'lucide-react';
import { getDeepConnectionPrompts } from '@/lib/gemini';
import ReactMarkdown from 'react-markdown';

import { handleFirestoreError, OperationType } from '@/lib/error-handler';

export default function CommunityPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [community, setCommunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPrompts, setGeneratingPrompts] = useState(false);
  const [prompts, setPrompts] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !user) {
      setLoading(false);
      return;
    }
    const path = `communities/${id}`;
    const unsubscribe = onSnapshot(doc(db, 'communities', id as string), (doc) => {
      if (doc.exists()) {
        setCommunity({ id: doc.id, ...doc.data() });
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
    return () => unsubscribe();
  }, [id, user]);

  const joinCommunity = async () => {
    if (!user || !id) return;
    const path = `communities/${id}`;
    const userId = user.id || (user as any).uid;
    try {
      await updateDoc(doc(db, 'communities', id as string), {
        members: arrayUnion(userId)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const generatePrompts = async () => {
    if (!community) return;
    setGeneratingPrompts(true);
    try {
      const result = await getDeepConnectionPrompts([community.name, community.description]);
      setPrompts(result ?? null);
    } catch (error) {
      console.error("Failed to generate prompts:", error);
    } finally {
      setGeneratingPrompts(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-zinc-300" /></div>;
  if (!community) return <div className="text-center py-20">Circle not found.</div>;

  const userId = user?.id || (user as any)?.uid;
  const isMember = userId && community.members?.includes(userId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Info & AI Prompts */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">{community.name}</h1>
            <p className="text-zinc-600 text-sm mb-6">{community.description}</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-zinc-500">
                <Users className="w-4 h-4" />
                <span>{community.members?.length || 0} members</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-500">
                <Calendar className="w-4 h-4" />
                <span>Created {new Date(community.createdAt?.seconds * 1000).toLocaleDateString()}</span>
              </div>
            </div>

            {!isMember && user && (
              <button
                onClick={joinCommunity}
                className="w-full mt-8 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
              >
                Join this Circle
              </button>
            )}
          </div>

          <div className="bg-emerald-900 text-white p-6 rounded-3xl shadow-xl shadow-emerald-900/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                Deep Connection
              </h3>
              <button
                onClick={generatePrompts}
                disabled={generatingPrompts}
                className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md transition-colors disabled:opacity-50"
              >
                {generatingPrompts ? 'Thinking...' : 'Refresh'}
              </button>
            </div>
            <p className="text-emerald-100/70 text-xs mb-4">
              AI-generated prompts to foster deeper conversations in this circle.
            </p>
            
            {prompts ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{prompts}</ReactMarkdown>
              </div>
            ) : (
              <div className="py-8 text-center border border-white/10 rounded-2xl">
                <button
                  onClick={generatePrompts}
                  className="text-sm font-bold text-emerald-400 hover:text-emerald-300"
                >
                  Generate Icebreakers
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Chat & Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 mb-2 px-2">
            <MessageSquare className="w-5 h-5 text-zinc-400" />
            <h2 className="font-bold text-zinc-900">Circle Discussion</h2>
          </div>
          
          {isMember ? (
            <ChatRoom communityId={id as string} />
          ) : (
            <div className="bg-zinc-100 rounded-3xl p-12 text-center border-2 border-dashed border-zinc-200">
              <Info className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-zinc-900 mb-2">Members Only</h3>
              <p className="text-zinc-500 max-w-xs mx-auto mb-6">
                Join this circle to participate in the discussion and see deep connection prompts.
              </p>
              {!user && (
                <p className="text-sm text-zinc-400">Please sign in to join.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
