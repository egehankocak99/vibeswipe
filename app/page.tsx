'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { SUPPORTED_CITIES, NIGHTLIFE_CITIES } from '@/lib/nightlife-data'
import toast from 'react-hot-toast'

export default function HomePage() {
  const router = useRouter()
  const [city, setCity] = useState('')
  const [isVisitor, setIsVisitor] = useState(false)

  const selectedCityInfo = NIGHTLIFE_CITIES.find(c => c.city === city)

  const handleQuickStart = async () => {
    if (!city) {
      toast.error('Pick a city first')
      return
    }

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `user_${Date.now()}@vibeswipe.app`,
          currentCity: city,
          currentCountry: selectedCityInfo?.country || '',
          isVisitor,
          vibeStyles: ['cocktail', 'live-music', 'rooftop'],
          goOutDays: ['friday', 'saturday'],
          budgetLevel: 'medium',
          musicGenres: ['house', 'techno', 'indie'],
        }),
      })
      const data = await response.json()
      localStorage.setItem('userId', data.userId)
      localStorage.setItem('city', city)
      localStorage.setItem('country', selectedCityInfo?.country || '')

      // Seed data
      await fetch('/api/seed', { method: 'POST' })

      router.push('/swipe')
    } catch (error) {
      console.error('Quick start error:', error)
      toast.error('Something went wrong. Try again.')
    }
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto min-h-screen max-w-[420px] relative overflow-hidden">
        {/* Background effects */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.25),transparent_70%)]" />
        <div className="pointer-events-none absolute top-48 -right-24 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.2),transparent_70%)]" />
        <div className="pointer-events-none absolute bottom-32 -left-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.15),transparent_70%)]" />

        <div className="h-12" />

        {/* Logo & header */}
        <header className="px-6 pt-4 pb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 mb-4">
            <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-xs font-semibold text-purple-300">AI-Powered Discovery</span>
          </div>
          <h1 className="text-4xl font-extrabold">
            <span className="gradient-text">VibeSwipe</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400 leading-relaxed">
            Find bars, clubs, events & concerts<br />
            wherever you are — swipe style.
          </p>
        </header>

        {/* Hero card preview */}
        <main className="px-6 space-y-5 pb-8">
          <section className="rounded-3xl glass p-5 fade-in-up">
            <div className="relative h-44 rounded-2xl overflow-hidden mb-4">
              <img
                src="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80"
                alt="Nightlife"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="rounded-full bg-purple-600/90 px-3 py-1 text-xs font-bold text-white">
                  🔥 Trending Tonight
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white">
                  92% match
                </span>
              </div>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-white">Berghain</h2>
                <p className="text-xs text-gray-400">Friedrichshain, Berlin</p>
              </div>
              <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
                ★ 4.8
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-purple-500/20 px-2.5 py-1 text-xs font-semibold text-purple-300">techno</span>
              <span className="rounded-full bg-pink-500/20 px-2.5 py-1 text-xs font-semibold text-pink-300">legendary</span>
              <span className="rounded-full bg-blue-500/20 px-2.5 py-1 text-xs font-semibold text-blue-300">late-night</span>
            </div>
          </section>

          {/* City selector */}
          <section className="rounded-3xl glass p-5 fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-sm font-bold text-white mb-3">Where are you?</h3>

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm font-semibold text-white focus:border-purple-500 focus:outline-none appearance-none"
              style={{ fontSize: '16px' }}
            >
              <option value="" className="bg-[#1a1225]">Select city...</option>
              {SUPPORTED_CITIES.map(c => (
                <option key={c} value={c} className="bg-[#1a1225]">{c}</option>
              ))}
            </select>

            {city && (
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => setIsVisitor(false)}
                  className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${
                    !isVisitor
                      ? 'bg-purple-600 text-white neon-purple'
                      : 'bg-white/5 text-gray-400 border border-white/10'
                  }`}
                >
                  🏠 I live here
                </button>
                <button
                  onClick={() => setIsVisitor(true)}
                  className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${
                    isVisitor
                      ? 'bg-pink-600 text-white neon-pink'
                      : 'bg-white/5 text-gray-400 border border-white/10'
                  }`}
                >
                  ✈️ Visiting
                </button>
              </div>
            )}
          </section>

          {/* CTA */}
          <section className="space-y-3 fade-in-up" style={{ animationDelay: '0.2s' }}>
            <button
              onClick={handleQuickStart}
              disabled={!city}
              className={`w-full rounded-2xl py-4 text-sm font-bold transition-all ${
                city
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 active:scale-[0.98]'
                  : 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed'
              }`}
            >
              {city ? `Explore ${city} →` : 'Select a city to start'}
            </button>

            <div className="flex gap-3">
              <Link
                href="/onboarding"
                className="flex-1 rounded-2xl glass py-3 text-center text-xs font-semibold text-gray-300 active:scale-[0.98] transition-transform"
              >
                Full Setup
              </Link>
              <Link
                href="/saved"
                className="flex-1 rounded-2xl glass py-3 text-center text-xs font-semibold text-gray-300 active:scale-[0.98] transition-transform"
              >
                My Saved
              </Link>
            </div>
          </section>

          {/* Features */}
          <section className="rounded-3xl glass p-5 fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-sm font-bold text-white mb-3">How it works</h3>
            <div className="space-y-3">
              {[
                { icon: '🎯', title: 'AI-Curated Feed', desc: 'Venues & events matched to your vibe' },
                { icon: '👆', title: 'Swipe to Discover', desc: 'Like, pass, or superlike — your call' },
                { icon: '🔔', title: 'Smart Alerts', desc: 'Get notified for events you\'ll love' },
                { icon: '🌍', title: 'Any City', desc: 'Works at home or while traveling' },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-lg">{f.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-white">{f.title}</div>
                    <div className="text-xs text-gray-400">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
