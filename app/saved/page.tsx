'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface SavedItem {
  id: string
  cardType: 'venue' | 'event'
  action: 'like' | 'superlike'
  createdAt: string
  // Venue
  venue?: {
    id: string; name: string; venueType: string; neighborhood: string; city: string
    imageUrl: string; rating: number; vibeScore: number; priceLevel: string; tags: string
    musicGenres: string; bestNights: string; aiInsight: string
  }
  // Event
  event?: {
    id: string; title: string; eventType: string; category: string; venueName: string
    neighborhood: string; city: string; imageUrl: string; startDate: string; doorsOpen: string
    priceMin: number; priceMax: number; isFree: boolean; artists: string; genre: string
    tags: string; hypeScore: number; sourcePlatform: string; discoveredBy: string
    isRecurring: boolean; organizer: string; aiInsight: string
  }
}

const CATEGORY_EMOJIS: Record<string, string> = {
  nightlife: '🌙', music: '🎵', social: '🗣️', sports: '🚴', wellness: '🧘',
  food: '🍳', arts: '🎭', learning: '📚', community: '🤝', outdoor: '🌿',
}

export default function SavedPage() {
  const [items, setItems] = useState<SavedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'all' | 'events' | 'venues'>('all')
  const [userId, setUserId] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('vibeswipe_userId')
    if (stored) setUserId(stored)
  }, [])

  useEffect(() => {
    if (!userId) return
    fetchSaved()
  }, [userId])

  const fetchSaved = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/saved?userId=${userId}`)
      const data = await res.json()
      setItems([
        ...(data.venues || []).map((s: any) => ({ ...s, cardType: 'venue' as const })),
        ...(data.events || []).map((s: any) => ({ ...s, cardType: 'event' as const })),
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    } catch (err) {
      console.error('Failed to fetch saved:', err)
    }
    setLoading(false)
  }

  const filtered = items.filter(item => {
    if (tab === 'all') return true
    if (tab === 'events') return item.cardType === 'event'
    return item.cardType === 'venue'
  })

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  const parseTags = (t: string) => {
    try { return JSON.parse(t) } catch { return [] }
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-5xl mb-4">❤️</div>
          <h1 className="text-xl font-bold text-white mb-3">Sign in to see saved items</h1>
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
        <h1 className="text-lg font-bold text-white">Saved</h1>
        <Link href="/alerts" className="text-white/60 hover:text-white text-sm">🔔</Link>
      </header>

      {/* Tabs */}
      <div className="px-4 py-3 flex gap-2">
        {(['all', 'events', 'venues'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              tab === t
                ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-500/25'
                : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
          >
            {t === 'all' ? `All (${items.length})` : t === 'events' ? `Events (${items.filter(i => i.cardType === 'event').length})` : `Venues (${items.filter(i => i.cardType === 'venue').length})`}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-white/40 text-sm animate-pulse">Loading saved items...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🫥</div>
            <p className="text-white/60 mb-2">Nothing saved yet</p>
            <p className="text-white/40 text-sm">Swipe right on events and venues you like!</p>
            <Link href="/swipe" className="inline-block mt-4 text-purple-400 hover:text-purple-300 text-sm">
              Start swiping →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map((item, i) => {
                const isVenue = item.cardType === 'venue'
                const v = item.venue
                const e = item.event
                const title = isVenue ? v?.name : e?.title
                const subtitle = isVenue ? `${v?.venueType} · ${v?.neighborhood}` : `${e?.venueName} · ${e?.neighborhood}`
                const img = isVenue ? v?.imageUrl : e?.imageUrl
                const tags = parseTags(isVenue ? v?.tags || '[]' : e?.tags || '[]')
                const catEmoji = e?.category ? CATEGORY_EMOJIS[e.category] || '📌' : ''

                return (
                  <motion.div
                    key={item.id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass rounded-2xl overflow-hidden"
                  >
                    <div className="flex gap-3 p-3">
                      {/* Image */}
                      <div
                        className="w-20 h-20 rounded-xl bg-cover bg-center shrink-0"
                        style={{ backgroundImage: `url(${img || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200'})` }}
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="text-white font-semibold text-sm truncate">{title}</h3>
                            <p className="text-white/50 text-xs truncate">{subtitle}</p>
                          </div>
                          <span className={`shrink-0 text-lg ${item.action === 'superlike' ? '' : ''}`}>
                            {item.action === 'superlike' ? '⭐' : '❤️'}
                          </span>
                        </div>

                        {/* Event meta */}
                        {!isVenue && e && (
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {e.category && (
                              <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/50 text-[10px]">
                                {catEmoji} {e.category}
                              </span>
                            )}
                            {e.startDate && (
                              <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/50 text-[10px]">
                                📅 {formatDate(e.startDate)}
                              </span>
                            )}
                            {e.isFree && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">
                                🆓 Free
                              </span>
                            )}
                            {e.discoveredBy === 'ai_scout' && (
                              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[10px]">
                                🤖 AI
                              </span>
                            )}
                          </div>
                        )}

                        {/* Venue meta */}
                        {isVenue && v && (
                          <div className="flex gap-1.5 mt-1.5">
                            {v.rating > 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px]">
                                ⭐ {v.rating}
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/50 text-[10px]">
                              {v.priceLevel}
                            </span>
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {tags.slice(0, 3).map((tag: string) => (
                            <span key={tag} className="text-white/30 text-[10px]">#{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 bg-gray-950/90 backdrop-blur-xl border-t border-white/5 px-6 py-3 z-40">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/swipe" className="flex flex-col items-center gap-1 text-white/40 hover:text-white/60">
            <span className="text-lg">🃏</span>
            <span className="text-[10px]">Swipe</span>
          </Link>
          <Link href="/saved" className="flex flex-col items-center gap-1 text-purple-400">
            <span className="text-lg">❤️</span>
            <span className="text-[10px] font-medium">Saved</span>
          </Link>
          <Link href="/alerts" className="flex flex-col items-center gap-1 text-white/40 hover:text-white/60">
            <span className="text-lg">🔔</span>
            <span className="text-[10px]">Alerts</span>
          </Link>
          <Link href="/preferences" className="flex flex-col items-center gap-1 text-white/40 hover:text-white/60">
            <span className="text-lg">⚙️</span>
            <span className="text-[10px]">Prefs</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
