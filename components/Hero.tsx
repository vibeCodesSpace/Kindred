'use client';

import { motion } from 'motion/react';
import { Sparkles, Users, MessageCircle, MapPin } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.emerald.100),white)] opacity-20" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Combatting Digital Isolation
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
              Find your <span className="text-emerald-600">Kindred</span> spirits.
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-600">
              In a world of digital noise, we help you find genuine human connection. Join local circles, engage in deep conversations, and rediscover the joy of shared experiences.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 transition-all">
                Explore Circles
              </button>
              <button className="text-sm font-semibold leading-6 text-zinc-900 flex items-center gap-1 hover:gap-2 transition-all">
                How it works <span aria-hidden="true">→</span>
              </button>
            </div>
          </motion.div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            { icon: Users, title: 'Local Circles', desc: 'Join small groups based on shared values and interests.' },
            { icon: MessageCircle, title: 'Deep Prompts', desc: 'AI-guided conversation starters to skip the small talk.' },
            { icon: MapPin, title: 'Real Meetups', desc: 'Turn digital connections into real-world friendships.' }
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex flex-col items-center p-6 bg-zinc-50 rounded-2xl border border-zinc-100"
            >
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-zinc-200 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 text-center">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
