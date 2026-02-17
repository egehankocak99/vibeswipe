'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const CITIES = [
  'Barcelona', 'Berlin', 'Amsterdam', 'London', 'Paris', 'Lisbon',
  'Prague', 'Budapest', 'Athens', 'Milan', 'Rome', 'Copenhagen',
  'Istanbul', 'Dublin', 'New York', 'Tokyo', 'Bangkok', 'Seoul',
]

const VIBES = [
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

const MUSIC = [
  'techno', 'house', 'hip-hop', 'jazz', 'indie', 'latin',
  'rock', 'pop', 'r&b', 'electronic', 'acoustic', 'world',
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [city, setCity] = useState('')
  const [vibes, setVibes] = useState<string[]>([])
  const [genres, setGenres] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('vibeswipe_city')
    if (stored) setCity(stored)
  }, [])

  const toggle = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]

  const handleFinish = () => {
    if (!city) return
    localStorage.setItem('vibeswipe_city', city)
    localStorage.setItem('vibeswipe_userId', `demo_${Date.now()}`)
    localStorage.setItem('vibeswipe_vibes', JSON.stringify(vibes))
    localStorage.setItem('vibeswipe_genres', JSON.stringify(genres))
    router.push('/swipe')
  }

  const totalSteps = 3

  return (
    <div className="min-h-screen flex flex-col px-6 pt-safe">
      {/* ── Progress ── */}
      <div className="pt-6 pb-2">
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${
                i + 1 <= step
                  ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500'
                  : 'bg-white/[0.06]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Steps ── */}
      <div className="flex-1 pt-6 pb-8">
        <AnimatePresence mode="wait">
          {/* Step 1: City */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl font-bold text-white mb-1">Where are you?</h1>
              <p className="text-[var(--text-secondary)] text-sm mb-8">
                We&apos;ll find events happening near you.
              </p>

              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl bg-white/[0.04] border border-[var(--border)] px-4 py-3.5 text-sm text-white focus:border-[var(--accent)] focus:outline-none appearance-none mb-6"
                style={{ fontSize: '16px' }}
              >
                <option value="" className="bg-[var(--surface)]">Select city...</option>
                {CITIES.map(c => (
                  <option key={c} value={c} className="bg-[var(--surface)]">{c}</option>
                ))}
              </select>

              <button
                onClick={() => city && setStep(2)}
                disabled={!city}
                className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all ${
                  city
                    ? 'btn-primary w-full'
                    : 'bg-white/[0.03] text-[var(--text-tertiary)] border border-[var(--border)] cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </motion.div>
          )}

          {/* Step 2: Vibes */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl font-bold text-white mb-1">What&apos;s your vibe?</h1>
              <p className="text-[var(--text-secondary)] text-sm mb-6">
                Pick all that resonate with you.
              </p>

              <div className="grid grid-cols-3 gap-2 mb-8">
                {VIBES.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setVibes(toggle(vibes, v.id))}
                    className={`flex flex-col items-center gap-1.5 p-3.5 rounded-2xl text-center transition-all ${
                      vibes.includes(v.id)
                        ? 'bg-white/[0.08] border border-[var(--accent)]/30 text-white'
                        : 'bg-white/[0.02] border border-[var(--border)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                    }`}
                  >
                    <span className="text-xl">{v.emoji}</span>
                    <span className="text-[11px] font-medium">{v.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 btn-ghost"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 btn-primary"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Music */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl font-bold text-white mb-1">Music taste</h1>
              <p className="text-[var(--text-secondary)] text-sm mb-6">
                This helps us find the right events for you.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {MUSIC.map(g => (
                  <button
                    key={g}
                    onClick={() => setGenres(toggle(genres, g))}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                      genres.includes(g)
                        ? 'bg-white/[0.1] text-white border border-white/20'
                        : 'bg-white/[0.02] text-[var(--text-tertiary)] border border-[var(--border)] hover:text-[var(--text-secondary)]'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              {/* Summary */}
              <div className="glass-solid rounded-xl p-4 mb-6 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-tertiary)]">City</span>
                  <span className="text-white font-medium">{city}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-tertiary)]">Vibes</span>
                  <span className="text-[var(--accent)] font-medium">{vibes.length} selected</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-tertiary)]">Genres</span>
                  <span className="text-[var(--accent)] font-medium">{genres.length} selected</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 btn-ghost"
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  className="flex-1 btn-primary"
                >
                  Start Swiping
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
