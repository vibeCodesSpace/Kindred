'use client';

import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/components/AuthProvider';
import { Send, Loader2, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { handleFirestoreError, OperationType } from '@/lib/error-handler';
import { Message } from '@/lib/types';

export default function ChatRoom({ communityId }: { communityId: string }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    const path = `communities/${communityId}/messages`;
    const q = query(
      collection(db, 'communities', communityId, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path, user);
    });

    return () => unsubscribe();
  }, [communityId, user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;

    const text = newMessage;
    setNewMessage('');
    const path = `communities/${communityId}/messages`;
    const userId = user.id;
    const userName = user.user_metadata?.full_name || 'Anonymous';
    const userPhoto = user.user_metadata?.avatar_url || '';

    try {
      await addDoc(collection(db, 'communities', communityId, 'messages'), {
        text,
        senderId: userId,
        senderName: userName,
        senderPhoto: userPhoto,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path, user);
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-zinc-300" /></div>;

  const userId = user?.id;

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.senderId === userId ? 'flex-row-reverse' : ''}`}
          >
            {msg.senderPhoto ? (
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image 
                  src={msg.senderPhoto} 
                  alt="" 
                  fill 
                  className="rounded-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-zinc-400" />
              </div>
            )}
            <div className={`max-w-[70%] ${msg.senderId === userId ? 'items-end' : 'items-start'} flex flex-col`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-zinc-900">{msg.senderName}</span>
                <span className="text-[10px] text-zinc-400">
                  {msg.createdAt?.toDate ? formatDistanceToNow(msg.createdAt.toDate(), { addSuffix: true }) : 'just now'}
                </span>
              </div>
              <div
                className={`px-4 py-2 rounded-2xl text-sm ${
                  msg.senderId === userId
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-zinc-100 text-zinc-900 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-100 bg-zinc-50/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Share something meaningful..."
            className="flex-1 bg-white border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
