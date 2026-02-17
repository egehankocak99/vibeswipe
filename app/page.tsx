'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MOCK_EVENTS } from '@/lib/mock-data'

const CITIES = [
  'Barcelona', 'Berlin', 'Amsterdam', 'London', 'Paris', 'Lisbon',
  'Prague', 'Budapest', 'Athens', 'Milan', 'Rome', 'Copenhagen',
  'Istanbul', 'Dublin', 'New York', 'Tokyo', 'Bangkok', 'Seoul',
]

export default function HomePage() {
  const router = useRouter()
  const [city, setCity] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('vibeswipe_city')
    if (stored) setCity(stored)
  }, [])

  const handleStart = () => {
    if (!city) return
    localStorage.setItem('vibeswipe_city', city)
    localStorage.setItem('vibeswipe_userId', `demo_${Date.now()}`)
    router.push('/swipe')
  }

  // Preview card from mock data
  const preview = MOCK_EVENTS[0]

  if (!mounted) return null

  return (
    <div className="min-h-screen flex flex-col px-6 pt-safe">
      {/* ── Floating ambient blobs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-purple-600/5 blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-48 h-48 rounded-full bg-fuchsia-600/5 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-36 h-36 rounded-full bg-blue-600/4 blur-3xl" />
      </div>

      {/* ── Header ── */}
      <header className="pt-12 pb-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="gradient-text">VibeSwipe</span>
          </h1>
          <p className="mt-2 text-[var(--text-tertiary)] text-sm">
            Discover what&apos;s happening around you
          </p>
        </motion.div>
      </header>

      {/* ── Preview Coaster Card ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="relative z-10 mb-6"
      >
        <div className="coaster-card coaster-texture overflow-hidden">
          <div
            className="coaster-illustration h-44 relative"
            style={{
              background: `linear-gradient(145deg, ${preview.gradientFrom}, ${preview.gradientTo})`,
            }}
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute w-20 h-20 rounded-full bg-white/[0.06] top-4 right-8 blur-md" />
              <div className="absolute w-12 h-12 rounded-full bg-white/[0.04] bottom-6 left-6 blur-sm" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl float select-none" style={{ filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.3))' }}>
                {preview.emoji}
              </span>
            </div>

            {/* Badge */}
            <div className="absolute bottom-3 left-4">
              <span className="px-2.5 py-1 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white/80 text-[11px] font-medium">
                🔥 Preview
              </span>
            </div>
            <div className="absolute top-3 right-4">
              <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center">
                <span className="text-white text-[11px] font-bold">{preview.matchScore}%</span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--surface)] p-4">
            <h3 className="font-bold text-white text-base">{preview.title}</h3>
            <p className="text-[var(--text-secondary)] text-xs mt-0.5">
              {preview.venueName} · {preview.neighborhood}
            </p>
            <div className="flex gap-1.5 mt-2.5">
              {preview.tags.slice(0, 3).map(tag => (
                <span key={tag} className="tag-pill">#{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── City Selector ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="relative z-10 mb-4"
      >
        <div className="glass-solid rounded-2xl p-5">
          <label className="text-sm font-semibold text-white mb-3 block">
            Where are you?
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-xl bg-white/[0.04] border border-[var(--border)] px-4 py-3 text-sm text-white focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/30 appearance-none transition-all"
            style={{ fontSize: '16px' }}
          >
            <option value="" className="bg-[var(--surface)]">Select your city...</option>
            {CITIES.map(c => (
              <option key={c} value={c} className="bg-[var(--surface)]">{c}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* ── CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="relative z-10 space-y-3 mb-8"
      >
        <button
          onClick={handleStart}
          disabled={!city}
          className={`w-full py-4 rounded-2xl text-sm font-semibold transition-all ${
            city
              ? 'btn-primary w-full'
              : 'bg-white/[0.03] text-[var(--text-tertiary)] border border-[var(--border)] cursor-not-allowed'
          }`}
        >
          {city ? `Explore ${city}` : 'Select a city to start'}
        </button>

        <div className="flex gap-2.5">
          <Link
            href="/onboarding"
            className="flex-1 btn-ghost text-center text-xs"
          >
            Full Setup
          </Link>
          <Link
            href="/saved"
            className="flex-1 btn-ghost text-center text-xs"
          >
            My Saved
          </Link>
        </div>
      </motion.div>

      {/* ── How It Works ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="relative z-10 glass-solid rounded-2xl p-5 mb-8"
      >
        <h3 className="text-sm font-semibold text-white mb-4">How it works</h3>
        <div className="space-y-4">
          {[
            { icon: '✦', title: 'Curated Feed', desc: 'Events matched to your taste' },
            { icon: '👆', title: 'Swipe to Discover', desc: 'Save, skip, or love — your call' },
            { icon: '◎', title: 'Smart Alerts', desc: 'Never miss what matters to you' },
            { icon: '🌍', title: 'Any City', desc: 'Explore at home or while traveling' },
          ].map((f, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                <span className="text-sm">{f.icon}</span>
              </div>
              <div>
                <div className="text-xs font-semibold text-white">{f.title}</div>
                <div className="text-xs text-[var(--text-tertiary)]">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
