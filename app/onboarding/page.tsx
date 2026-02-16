'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SUPPORTED_CITIES, NIGHTLIFE_CITIES, VIBE_STYLES, MUSIC_GENRES, DAYS_OF_WEEK, BUDGET_LEVELS } from '@/lib/nightlife-data'
import toast from 'react-hot-toast'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [city, setCity] = useState('')
  const [isVisitor, setIsVisitor] = useState(false)
  const [vibeStyles, setVibeStyles] = useState<string[]>([])
  const [goOutDays, setGoOutDays] = useState<string[]>(['friday', 'saturday'])
  const [budgetLevel, setBudgetLevel] = useState('medium')
  const [musicGenres, setMusicGenres] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const selectedCityInfo = NIGHTLIFE_CITIES.find(c => c.city === city)

  const toggleItem = (arr: string[], setter: (v: string[]) => void, item: string) => {
    setter(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item])
  }

  const handleComplete = async () => {
    if (!city) {
      toast.error('Please select a city')
      return
    }
    setLoading(true)

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `user_${Date.now()}@vibeswipe.app`,
          currentCity: city,
          currentCountry: selectedCityInfo?.country || '',
          isVisitor,
          vibeStyles,
          goOutDays,
          budgetLevel,
          musicGenres,
        }),
      })

      const data = await response.json()
      localStorage.setItem('vibeswipe_userId', data.userId)
      localStorage.setItem('vibeswipe_city', city)
      localStorage.setItem('vibeswipe_country', selectedCityInfo?.country || '')

      // Seed data
      await fetch('/api/seed', { method: 'POST' })

      toast.success('Profile created! Let\'s explore.')
      router.push('/swipe')
    } catch (error) {
      console.error('Onboarding error:', error)
      toast.error('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto min-h-screen max-w-[420px] relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -left-32 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.2),transparent_70%)]" />

        {/* Progress bar */}
        <div className="px-6 pt-6">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        <main className="px-6 pt-6 pb-8">
          {/* Step 1: City */}
          {step === 1 && (
            <div className="fade-in-up">
              <h1 className="text-2xl font-extrabold text-white mb-1">Where are you?</h1>
              <p className="text-sm text-gray-400 mb-6">We'll find the best local spots for you.</p>

              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 text-sm font-semibold text-white focus:border-purple-500 focus:outline-none appearance-none mb-4"
                style={{ fontSize: '16px' }}
              >
                <option value="" className="bg-[#1a1225]">Select your city...</option>
                {SUPPORTED_CITIES.map(c => (
                  <option key={c} value={c} className="bg-[#1a1225]">{c}</option>
                ))}
              </select>

              {city && (
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => setIsVisitor(false)}
                    className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all ${
                      !isVisitor ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 border border-white/10'
                    }`}
                  >
                    🏠 Local
                  </button>
                  <button
                    onClick={() => setIsVisitor(true)}
                    className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all ${
                      isVisitor ? 'bg-pink-600 text-white' : 'bg-white/5 text-gray-400 border border-white/10'
                    }`}
                  >
                    ✈️ Traveling
                  </button>
                </div>
              )}

              <button
                onClick={() => city ? setStep(2) : toast.error('Select a city')}
                className={`w-full rounded-2xl py-4 text-sm font-bold ${
                  city ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-white/5 text-gray-500'
                }`}
              >
                Next →
              </button>
            </div>
          )}

          {/* Step 2: Vibe */}
          {step === 2 && (
            <div className="fade-in-up">
              <h1 className="text-2xl font-extrabold text-white mb-1">What's your vibe?</h1>
              <p className="text-sm text-gray-400 mb-6">Pick all that match your style.</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {VIBE_STYLES.map(v => (
                  <button
                    key={v}
                    onClick={() => toggleItem(vibeStyles, setVibeStyles, v)}
                    className={`rounded-full px-3.5 py-2 text-xs font-bold transition-all ${
                      vibeStyles.includes(v)
                        ? 'bg-purple-600 text-white neon-purple'
                        : 'bg-white/5 text-gray-300 border border-white/10'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 rounded-2xl glass py-3.5 text-sm font-semibold text-gray-300">
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 py-3.5 text-sm font-bold text-white"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Music & Days */}
          {step === 3 && (
            <div className="fade-in-up">
              <h1 className="text-2xl font-extrabold text-white mb-1">Music & Schedule</h1>
              <p className="text-sm text-gray-400 mb-4">What genres do you like? When do you go out?</p>

              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2 mb-5">
                {MUSIC_GENRES.map(g => (
                  <button
                    key={g}
                    onClick={() => toggleItem(musicGenres, setMusicGenres, g)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                      musicGenres.includes(g)
                        ? 'bg-pink-600 text-white neon-pink'
                        : 'bg-white/5 text-gray-300 border border-white/10'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Go-out days</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {DAYS_OF_WEEK.map(d => (
                  <button
                    key={d}
                    onClick={() => toggleItem(goOutDays, setGoOutDays, d)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all capitalize ${
                      goOutDays.includes(d)
                        ? 'bg-blue-600 text-white neon-blue'
                        : 'bg-white/5 text-gray-300 border border-white/10'
                    }`}
                  >
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 rounded-2xl glass py-3.5 text-sm font-semibold text-gray-300">
                  ← Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 py-3.5 text-sm font-bold text-white"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Budget & Launch */}
          {step === 4 && (
            <div className="fade-in-up">
              <h1 className="text-2xl font-extrabold text-white mb-1">Almost there!</h1>
              <p className="text-sm text-gray-400 mb-6">Set your budget level.</p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {BUDGET_LEVELS.map(b => (
                  <button
                    key={b}
                    onClick={() => setBudgetLevel(b)}
                    className={`rounded-2xl py-4 text-sm font-bold capitalize transition-all ${
                      budgetLevel === b
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20'
                        : 'glass text-gray-300'
                    }`}
                  >
                    {b === 'budget' && '💰 '}
                    {b === 'medium' && '💎 '}
                    {b === 'premium' && '👑 '}
                    {b === 'any' && '🌍 '}
                    {b}
                  </button>
                ))}
              </div>

              {/* Summary */}
              <div className="rounded-2xl glass p-4 mb-6 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">City</span>
                  <span className="font-bold text-white">{city}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Status</span>
                  <span className="font-bold text-white">{isVisitor ? 'Visitor' : 'Local'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Vibes</span>
                  <span className="font-bold text-purple-300">{vibeStyles.length} selected</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Genres</span>
                  <span className="font-bold text-pink-300">{musicGenres.length} selected</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="flex-1 rounded-2xl glass py-3.5 text-sm font-semibold text-gray-300">
                  ← Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 py-3.5 text-sm font-bold text-white disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Start Swiping 🚀'}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
