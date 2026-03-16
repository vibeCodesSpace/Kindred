'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/components/AuthProvider';
import { X, Loader2 } from 'lucide-react';
import { handleFirestoreError, OperationType } from '@/lib/error-handler';

export default function CreateCircleModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim()) return;

    setLoading(true);
    const path = 'communities';
    const userId = user.id || (user as any).uid;
    try {
      await addDoc(collection(db, 'communities'), {
        name,
        description,
        creatorId: userId,
        members: [userId],
        createdAt: serverTimestamp()
      });
      onClose();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-zinc-900">Create a New Circle</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-1">Circle Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Urban Gardeners, Philosophy Deep-Dive"
              className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-1">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this circle about? Who should join?"
              className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full bg-zinc-900 text-white py-3 rounded-xl font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Circle
          </button>
        </form>
      </div>
    </div>
  );
}
