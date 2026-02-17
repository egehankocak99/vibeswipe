'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const VIBE_OPTIONS = [
  { id: 'chill', emoji: '😌', label: 'Chill' },
  { id: 'energetic', emoji: '⚡', label: 'Energetic' },
  { id: 'underground', emoji: '🕳️', label: 'Underground' },
  { id: 'romantic', emoji: '🕯️', label: 'Romantic' },
  { id: 'social', emoji: '💬', label: 'Social' },
  { id: 'creative', emoji: '🎨', label: 'Creative' },
  { id: 'foodie', emoji: '🍳', label: 'Foodie' },
  { id: 'sporty', emoji: '🏃', label: 'Active' },
  { id: 'cultural', emoji: '🏛️', label: 'Cultural' },
  { id: 'outdoor', emoji: '🌿', label: 'Outdoor' },
  { id: 'wild', emoji: '🔥', label: 'Wild' },
  { id: 'wellness', emoji: '🧘', label: 'Mindful' },
]

const CATEGORY_OPTIONS = [
  { id: 'nightlife', emoji: '🌙', label: 'Nightlife' },
  { id: 'music', emoji: '🎵', label: 'Music' },
  { id: 'social', emoji: '💬', label: 'Social' },
  { id: 'food', emoji: '🍜', label: 'Food' },
  { id: 'arts', emoji: '🎨', label: 'Arts' },
  { id: 'sports', emoji: '🏃', label: 'Sports' },
  { id: 'wellness', emoji: '🧘', label: 'Wellness' },
  { id: 'outdoor', emoji: '🌿', label: 'Outdoor' },
]

export default function PreferencesPage() {
  const [city, setCity] = useState('')
  const [vibes, setVibes] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [budget, setBudget] = useState('any')
  const [saved, setSaved] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedCity = localStorage.getItem('vibeswipe_city')
    const storedVibes = localStorage.getItem('vibeswipe_vibes')
    if (storedCity) setCity(storedCity)
    if (storedVibes) {
      try { setVibes(JSON.parse(storedVibes)) } catch {}
    }
  }, [])

  const toggle = (arr: string[], setter: (v: string[]) => void, item: string) => {
    setter(arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item])
  }

  const handleSave = () => {
    localStorage.setItem('vibeswipe_vibes', JSON.stringify(vibes))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = '/'
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen flex flex-col pb-safe">
      {/* ── Header ── */}
      <header className="px-5 pt-5 pb-3 flex items-center justify-between sticky top-0 z-30 bg-[var(--bg)]/90 backdrop-blur-xl">
        <Link href="/swipe" className="text-[var(--text-secondary)] text-sm hover:text-white transition-colors">
          ← Back
        </Link>
        <h1 className="text-base font-semibold text-white">Settings</h1>
        <div className="w-12" />
      </header>

      <div className="flex-1 px-5 py-4 space-y-7">
        {/* ── City ── */}
        <section>
          <h2 className="text-sm font-semibold text-white mb-2">📍 Your City</h2>
          <div className="glass-solid rounded-xl p-4 flex items-center justify-between">
            <span className="text-[var(--text-secondary)] text-sm">{city || 'Not set'}</span>
            <Link href="/onboarding" className="text-[var(--accent)] text-xs font-medium">
              Change
            </Link>
          </div>
        </section>

        {/* ── Categories ── */}
        <section>
          <h2 className="text-sm font-semibold text-white mb-1">✦ Favorite Categories</h2>
          <p className="text-[var(--text-tertiary)] text-xs mb-3">We&apos;ll prioritize these in your feed</p>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORY_OPTIONS.map(cat => (
              <button
                key={cat.id}
                onClick={() => toggle(categories, setCategories, cat.id)}
                className={`p-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  categories.includes(cat.id)
                    ? 'bg-white/[0.08] text-white border border-[var(--accent)]/20'
                    : 'glass-solid text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                }`}
              >
                <span>{cat.emoji}</span>
                <span className="text-xs">{cat.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Vibes ── */}
        <section>
          <h2 className="text-sm font-semibold text-white mb-2">🎭 Your Vibes</h2>
          <div className="flex flex-wrap gap-2">
            {VIBE_OPTIONS.map(v => (
              <button
                key={v.id}
                onClick={() => toggle(vibes, setVibes, v.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  vibes.includes(v.id)
                    ? 'bg-white/[0.1] text-white border border-white/15'
                    : 'text-[var(--text-tertiary)] border border-[var(--border)] hover:text-[var(--text-secondary)]'
                }`}
              >
                {v.emoji} {v.label}
              </button>
            ))}
          </div>
        </section>

        {/* ── Budget ── */}
        <section>
          <h2 className="text-sm font-semibold text-white mb-2">💰 Budget</h2>
          <div className="flex gap-2">
            {[
              { id: 'budget', label: '€', desc: 'Budget' },
              { id: 'mid', label: '€€', desc: 'Mid' },
              { id: 'premium', label: '€€€', desc: 'Premium' },
              { id: 'any', label: '∞', desc: 'Any' },
            ].map(b => (
              <button
                key={b.id}
                onClick={() => setBudget(b.id)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-3 rounded-xl text-xs transition-all ${
                  budget === b.id
                    ? 'bg-white/[0.08] text-white border border-[var(--accent)]/20'
                    : 'glass-solid text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                }`}
              >
                <span className="text-sm font-medium">{b.label}</span>
                <span className="text-[10px]">{b.desc}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── AI Scout ── */}
        <section>
          <h2 className="text-sm font-semibold text-white mb-2">🤖 AI Scout</h2>
          <div className="glass-solid rounded-xl p-4 space-y-3">
            {[
              { label: 'Smart notifications', enabled: true },
              { label: 'Trending alerts', enabled: true },
              { label: 'Price drop alerts', enabled: true },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)] text-sm">{item.label}</span>
                <div className={`w-9 h-5 rounded-full relative transition-colors ${
                  item.enabled ? 'bg-emerald-500/40' : 'bg-white/10'
                }`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${
                    item.enabled ? 'right-0.5 bg-emerald-400' : 'left-0.5 bg-white/30'
                  }`} />
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-[var(--border)]">
              <p className="text-[var(--text-tertiary)] text-xs">
                Our AI finds events matching your taste in {city || 'your city'}.
              </p>
            </div>
          </div>
        </section>

        {/* ── Save ── */}
        <motion.button
          onClick={handleSave}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${
            saved
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
              : 'btn-primary w-full'
          }`}
        >
          {saved ? '✓ Saved' : 'Save Preferences'}
        </motion.button>

        {/* ── Logout ── */}
        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-xl text-sm text-[var(--text-tertiary)] hover:text-rose-400 transition-colors"
        >
          Log Out
        </button>
      </div>

      {/* ── Bottom Nav ── */}
      <nav className="bottom-nav">
        <div className="flex justify-around max-w-sm mx-auto">
          <Link href="/swipe" className="nav-item">
            <span className="nav-icon">✦</span>
            <span>Explore</span>
          </Link>
          <Link href="/saved" className="nav-item">
            <span className="nav-icon">♡</span>
            <span>Saved</span>
          </Link>
          <Link href="/alerts" className="nav-item">
            <span className="nav-icon">◎</span>
            <span>Alerts</span>
          </Link>
          <Link href="/preferences" className="nav-item active">
            <span className="nav-icon">⚙</span>
            <span>Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
