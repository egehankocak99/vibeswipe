'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const VIBE_OPTIONS = [
  'chill', 'energetic', 'underground', 'mainstream', 'romantic', 'wild',
  'social', 'cultural', 'outdoor', 'sporty', 'wellness', 'creative', 'foodie',
]

const CATEGORY_OPTIONS = [
  { id: 'nightlife', emoji: '🌙', label: 'Nightlife' },
  { id: 'music', emoji: '🎵', label: 'Music' },
  { id: 'social', emoji: '🗣️', label: 'Social' },
  { id: 'sports', emoji: '🚴', label: 'Sports' },
  { id: 'wellness', emoji: '🧘', label: 'Wellness' },
  { id: 'food', emoji: '🍳', label: 'Food' },
  { id: 'arts', emoji: '🎭', label: 'Arts' },
  { id: 'learning', emoji: '📚', label: 'Learning' },
  { id: 'community', emoji: '🤝', label: 'Community' },
  { id: 'outdoor', emoji: '🌿', label: 'Outdoor' },
]

export default function PreferencesPage() {
  const [userId, setUserId] = useState('')
  const [city, setCity] = useState('')
  const [vibes, setVibes] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [budget, setBudget] = useState('any')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('vibeswipe_userId')
    const storedCity = localStorage.getItem('vibeswipe_city')
    if (storedUser) setUserId(storedUser)
    if (storedCity) setCity(storedCity)

    if (storedUser) {
      fetch(`/api/preferences?userId=${storedUser}`)
        .then(r => r.json())
        .then(data => {
          if (data.profile) {
            setVibes(JSON.parse(data.profile.vibeStyles || '[]'))
            setBudget(data.profile.budgetLevel || 'any')
          }
        })
        .catch(() => {})
    }
  }, [])

  const toggleVibe = (v: string) => setVibes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])
  const toggleCat = (c: string) => setCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])

  const handleSave = async () => {
    if (!userId) return
    setSaving(true)
    try {
      await fetch('/api/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, vibeStyles: vibes, budgetLevel: budget }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Failed to save:', err)
    }
    setSaving(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('vibeswipe_userId')
    localStorage.removeItem('vibeswipe_city')
    window.location.href = '/'
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-5xl mb-4">⚙️</div>
          <h1 className="text-xl font-bold text-white mb-3">Sign in first</h1>
          <Link href="/onboarding" className="text-purple-400 hover:text-purple-300 text-sm">
            Complete onboarding →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      {/* Header */}
      <header className="px-4 py-3 flex items-center justify-between sticky top-0 z-30 bg-gray-950/80 backdrop-blur-xl border-b border-white/5">
        <Link href="/swipe" className="text-white/60 hover:text-white text-sm">← Back</Link>
        <h1 className="text-lg font-bold text-white">Preferences</h1>
        <div className="w-12" />
      </header>

      <div className="px-4 py-6 pb-28 max-w-md mx-auto space-y-8">
        {/* City */}
        <div>
          <h2 className="text-white font-semibold mb-2">📍 Your City</h2>
          <div className="glass rounded-xl p-4 flex items-center justify-between">
            <span className="text-white/80">{city || 'Not set'}</span>
            <Link href="/onboarding" className="text-purple-400 text-xs">Change</Link>
          </div>
        </div>

        {/* Favorite categories */}
        <div>
          <h2 className="text-white font-semibold mb-2">✨ Favorite Categories</h2>
          <p className="text-white/40 text-xs mb-3">We&apos;ll prioritize these in your feed</p>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORY_OPTIONS.map(cat => (
              <button
                key={cat.id}
                onClick={() => toggleCat(cat.id)}
                className={`p-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  categories.includes(cat.id)
                    ? 'bg-gradient-to-r from-purple-600/40 to-fuchsia-600/40 text-white border border-purple-500/40'
                    : 'glass text-white/50 hover:text-white/70'
                }`}
              >
                <span>{cat.emoji}</span> {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vibes */}
        <div>
          <h2 className="text-white font-semibold mb-2">🎭 Your Vibes</h2>
          <div className="flex flex-wrap gap-2">
            {VIBE_OPTIONS.map(v => (
              <button
                key={v}
                onClick={() => toggleVibe(v)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  vibes.includes(v)
                    ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white'
                    : 'bg-white/5 text-white/40 hover:bg-white/10'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div>
          <h2 className="text-white font-semibold mb-2">💰 Budget Level</h2>
          <div className="flex gap-2">
            {['budget', 'mid', 'premium', 'any'].map(b => (
              <button
                key={b}
                onClick={() => setBudget(b)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  budget === b
                    ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white'
                    : 'glass text-white/40 hover:text-white/60'
                }`}
              >
                {b === 'budget' ? '💵' : b === 'mid' ? '💵💵' : b === 'premium' ? '💵💵💵' : '🤷'} {b}
              </button>
            ))}
          </div>
        </div>

        {/* AI Scout Settings */}
        <div>
          <h2 className="text-white font-semibold mb-2">🤖 AI Scout</h2>
          <div className="glass rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-sm">Instagram monitoring</span>
              <div className="w-10 h-5 rounded-full bg-emerald-500/50 relative">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-emerald-400" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-sm">TikTok monitoring</span>
              <div className="w-10 h-5 rounded-full bg-emerald-500/50 relative">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-emerald-400" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-sm">Smart notifications</span>
              <div className="w-10 h-5 rounded-full bg-emerald-500/50 relative">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-emerald-400" />
              </div>
            </div>
            <p className="text-white/30 text-xs pt-1 border-t border-white/5">
              Our AI scouts follow 200+ accounts and hashtags in {city || 'your city'} to find events you&apos;ll love.
            </p>
          </div>
        </div>

        {/* Save button */}
        <motion.button
          onClick={handleSave}
          disabled={saving}
          whileTap={{ scale: 0.97 }}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
            saved
              ? 'bg-emerald-600 text-white'
              : 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white hover:from-purple-500 hover:to-fuchsia-500'
          }`}
        >
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Preferences'}
        </motion.button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-xl bg-white/5 text-rose-400 text-sm hover:bg-white/10 transition-all"
        >
          Log Out
        </button>
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 bg-gray-950/90 backdrop-blur-xl border-t border-white/5 px-6 py-3 z-40">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/swipe" className="flex flex-col items-center gap-1 text-white/40 hover:text-white/60">
            <span className="text-lg">🃏</span>
            <span className="text-[10px]">Swipe</span>
          </Link>
          <Link href="/saved" className="flex flex-col items-center gap-1 text-white/40 hover:text-white/60">
            <span className="text-lg">❤️</span>
            <span className="text-[10px]">Saved</span>
          </Link>
          <Link href="/alerts" className="flex flex-col items-center gap-1 text-white/40 hover:text-white/60">
            <span className="text-lg">🔔</span>
            <span className="text-[10px]">Alerts</span>
          </Link>
          <Link href="/preferences" className="flex flex-col items-center gap-1 text-purple-400">
            <span className="text-lg">⚙️</span>
            <span className="text-[10px] font-medium">Prefs</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
