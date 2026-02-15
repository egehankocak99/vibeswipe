'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import Link from 'next/link'

// ─── Types ───────────────────────────────────────────────────────────
interface FeedCard {
  id: string
  cardType: 'venue' | 'event'
  matchScore: number
  // Venue fields
  name?: string
  venueType?: string
  rating?: number
  vibeScore?: number
  priceLevel?: string
  dressCode?: string
  ageRange?: string
  hasOutdoor?: boolean
  hasDanceFloor?: boolean
  hasLiveMusic?: boolean
  hasFood?: boolean
  instagramHandle?: string
  bestNights?: string[]
  popularTimes?: Record<string, string>
  // Event fields
  title?: string
  eventType?: string
  category?: string
  venueName?: string
  startDate?: string
  doorsOpen?: string
  dayOfWeek?: string
  isRecurring?: boolean
  priceMin?: number
  priceMax?: number
  isFree?: boolean
  artists?: string[]
  organizer?: string
  genre?: string
  hypeScore?: number
  sourcePlatform?: string
  discoveredBy?: string
  // Common
  neighborhood?: string
  city?: string
  country?: string
  description?: string
  imageUrl?: string
  tags?: string[]
  musicGenres?: string[]
  aiInsight?: string
}

// ─── Category config ─────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all', label: 'All', emoji: '✨' },
  { id: 'nightlife', label: 'Nightlife', emoji: '🌙' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'social', label: 'Social', emoji: '🗣️' },
  { id: 'sports', label: 'Sports', emoji: '🚴' },
  { id: 'wellness', label: 'Wellness', emoji: '🧘' },
  { id: 'food', label: 'Food', emoji: '🍳' },
  { id: 'arts', label: 'Arts', emoji: '🎭' },
  { id: 'learning', label: 'Learn', emoji: '📚' },
  { id: 'community', label: 'Community', emoji: '🤝' },
  { id: 'outdoor', label: 'Outdoor', emoji: '🌿' },
]

const EVENT_TYPE_EMOJIS: Record<string, string> = {
  'dj-set': '🎧', 'concert': '🎤', 'live-music': '🎹', 'themed-party': '🎉',
  'comedy': '😂', 'language-exchange': '🗣️', 'pub-quiz': '🧠', 'networking': '🤝',
  'yoga': '🧘', 'running': '🏃', 'cycling': '🚴', 'sports-meetup': '⚽',
  'cooking-class': '👨‍🍳', 'food-market': '🍽️', 'food-tasting': '🍷',
  'art-show': '🖼️', 'open-air-cinema': '🎬', 'workshop': '🛠️', 'market': '🛍️',
  'wellness-class': '💆', 'social-gathering': '👋', 'outdoor-adventure': '🏔️',
}

// ─── SwipeCard ───────────────────────────────────────────────────────
function SwipeCard({
  card,
  onSwipe,
  isTop,
}: {
  card: FeedCard
  onSwipe: (dir: 'left' | 'right' | 'up') => void
  isTop: boolean
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useTransform(x, [-300, 0, 300], [-25, 0, 25])
  const likeOpacity = useTransform(x, [0, 100], [0, 1])
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0])
  const superOpacity = useTransform(y, [-100, 0], [1, 0])

  const [showDetails, setShowDetails] = useState(false)

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y < -120) return onSwipe('up')
    if (info.offset.x > 120) return onSwipe('right')
    if (info.offset.x < -120) return onSwipe('left')
  }

  const isVenue = card.cardType === 'venue'
  const cardTitle = isVenue ? card.name : card.title
  const cardSubtitle = isVenue
    ? `${card.venueType} · ${card.neighborhood}`
    : `${card.venueName} · ${card.neighborhood}`
  const topScore = isVenue ? card.vibeScore : card.hypeScore
  const typeEmoji = !isVenue ? (EVENT_TYPE_EMOJIS[card.eventType || ''] || '📌') : ''

  // Format date nicely
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  // Price display
  const priceDisplay = () => {
    if (card.isFree) return 'Free'
    if (isVenue && card.priceLevel) return card.priceLevel
    if (card.priceMin !== undefined && card.priceMax !== undefined) {
      if (card.priceMin === card.priceMax) return `€${card.priceMin}`
      return `€${card.priceMin}–${card.priceMax}`
    }
    return ''
  }

  // Source badge color
  const sourceBadgeColor = () => {
    if (card.discoveredBy === 'ai_scout') return 'bg-purple-500/30 text-purple-300 border-purple-500/40'
    if (card.sourcePlatform?.includes('Resident Advisor')) return 'bg-rose-500/30 text-rose-300 border-rose-500/40'
    return 'bg-white/10 text-white/60 border-white/20'
  }

  return (
    <motion.div
      className={`absolute inset-0 ${isTop ? 'z-10 cursor-grab active:cursor-grabbing' : 'z-0'}`}
      style={{ x, y, rotate }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      initial={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.7 }}
      animate={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.7 }}
      exit={{ x: 0, opacity: 0, transition: { duration: 0.2 } }}
    >
      <div
        className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl"
        onClick={() => isTop && setShowDetails(!showDetails)}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${card.imageUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600'})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Swipe indicators */}
        <motion.div
          className="absolute top-8 right-8 border-4 border-emerald-400 rounded-xl px-4 py-2 z-20"
          style={{ opacity: likeOpacity }}
        >
          <span className="text-emerald-400 font-bold text-2xl">LIKE</span>
        </motion.div>
        <motion.div
          className="absolute top-8 left-8 border-4 border-rose-400 rounded-xl px-4 py-2 z-20"
          style={{ opacity: nopeOpacity }}
        >
          <span className="text-rose-400 font-bold text-2xl">NOPE</span>
        </motion.div>
        <motion.div
          className="absolute top-8 left-1/2 -translate-x-1/2 border-4 border-cyan-400 rounded-xl px-4 py-2 z-20"
          style={{ opacity: superOpacity }}
        >
          <span className="text-cyan-400 font-bold text-2xl">SUPER ⭐</span>
        </motion.div>

        {/* Top badges */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
            isVenue ? 'bg-fuchsia-500/30 text-fuchsia-300 border-fuchsia-500/40' : 'bg-cyan-500/30 text-cyan-300 border-cyan-500/40'
          }`}>
            {isVenue ? '📍 Venue' : `${typeEmoji} ${card.eventType?.replace(/-/g, ' ')}`}
          </span>
          {card.discoveredBy === 'ai_scout' && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${sourceBadgeColor()}`}>
              🤖 AI Scout
            </span>
          )}
        </div>

        {/* Match score */}
        {card.matchScore > 0 && (
          <div className="absolute top-4 right-4 z-10">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
              card.matchScore >= 80 ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300' :
              card.matchScore >= 60 ? 'bg-amber-500/30 border-amber-400 text-amber-300' :
              'bg-white/10 border-white/20 text-white/60'
            }`}>
              {card.matchScore}%
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          {/* Category pill */}
          {!isVenue && card.category && (
            <div className="mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/70 text-[11px] uppercase tracking-wider font-medium">
                {CATEGORIES.find(c => c.id === card.category)?.emoji} {card.category}
              </span>
            </div>
          )}

          <h2 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">{cardTitle}</h2>
          <p className="text-white/70 text-sm mb-3">{cardSubtitle}</p>

          {/* Event-specific info */}
          {!isVenue && (
            <div className="flex flex-wrap gap-2 mb-3">
              {card.startDate && (
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white/80 text-xs">
                  📅 {formatDate(card.startDate)}
                </span>
              )}
              {card.doorsOpen && (
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white/80 text-xs">
                  🕐 {card.doorsOpen}
                </span>
              )}
              {priceDisplay() && (
                <span className={`px-2.5 py-1 rounded-lg text-xs ${
                  card.isFree ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/80'
                }`}>
                  {card.isFree ? '🆓' : '💰'} {priceDisplay()}
                </span>
              )}
              {card.isRecurring && (
                <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-xs">
                  🔄 Recurring
                </span>
              )}
            </div>
          )}

          {/* Venue-specific info */}
          {isVenue && (
            <div className="flex flex-wrap gap-2 mb-3">
              {card.rating && (
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs">
                  ⭐ {card.rating.toFixed(1)}
                </span>
              )}
              {priceDisplay() && (
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white/80 text-xs">
                  {priceDisplay()}
                </span>
              )}
              {card.hasDanceFloor && (
                <span className="px-2.5 py-1 rounded-lg bg-fuchsia-500/20 text-fuchsia-300 text-xs">💃 Dance floor</span>
              )}
              {card.hasOutdoor && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs">🌿 Outdoor</span>
              )}
            </div>
          )}

          {/* Artists / Performers */}
          {card.artists && card.artists.length > 0 && card.artists[0] !== '' && (
            <p className="text-white/60 text-xs mb-2">
              🎤 {card.artists.slice(0, 3).join(' · ')}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {(card.tags || []).slice(0, 5).map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded-full bg-white/10 text-white/60 text-[11px]">
                #{tag}
              </span>
            ))}
          </div>

          {/* AI Insight */}
          {card.aiInsight && (
            <p className="text-white/50 text-xs italic">
              🤖 {card.aiInsight}
            </p>
          )}

          {/* Expanded details */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3 pt-3 border-t border-white/10 overflow-hidden"
              >
                {card.description && (
                  <p className="text-white/70 text-sm mb-2">{card.description}</p>
                )}
                {card.sourcePlatform && (
                  <p className="text-white/40 text-xs">
                    Source: {card.sourcePlatform}
                    {card.discoveredBy === 'ai_scout' && ' · Discovered by AI Scout 🤖'}
                  </p>
                )}
                {isVenue && card.bestNights && card.bestNights.length > 0 && (
                  <p className="text-white/50 text-xs mt-1">
                    🌙 Best nights: {card.bestNights.join(', ')}
                  </p>
                )}
                {card.musicGenres && card.musicGenres.length > 0 && (
                  <p className="text-white/50 text-xs mt-1">
                    🎵 {card.musicGenres.join(', ')}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main swipe page ─────────────────────────────────────────────────
export default function SwipePage() {
  const [feed, setFeed] = useState<FeedCard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [city, setCity] = useState('')
  const [userId, setUserId] = useState('')
  const [swipeCount, setSwipeCount] = useState(0)
  const [lastAction, setLastAction] = useState<{ action: string; card: string } | null>(null)

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('vibeswipe_userId')
    const storedCity = localStorage.getItem('vibeswipe_city')
    if (storedUser) setUserId(storedUser)
    if (storedCity) setCity(storedCity)
  }, [])

  // Fetch feed
  const fetchFeed = useCallback(async () => {
    if (!city) return
    setLoading(true)
    try {
      const params = new URLSearchParams({ city })
      if (userId) params.set('userId', userId)
      if (activeCategory !== 'all') params.set('category', activeCategory)

      const res = await fetch(`/api/feed?${params}`)
      const data = await res.json()
      setFeed(data.feed || [])
      setCurrentIndex(0)
    } catch (err) {
      console.error('Failed to fetch feed:', err)
    } finally {
      setLoading(false)
    }
  }, [city, userId, activeCategory])

  useEffect(() => {
    fetchFeed()
  }, [fetchFeed])

  // Handle swipe
  const handleSwipe = async (dir: 'left' | 'right' | 'up') => {
    const card = feed[currentIndex]
    if (!card) return

    const action = dir === 'right' ? 'like' : dir === 'up' ? 'superlike' : 'pass'
    setLastAction({ action, card: (card.name || card.title) || '' })
    setSwipeCount(prev => prev + 1)

    // Record swipe
    try {
      await fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || 'anonymous',
          cardId: card.id,
          cardType: card.cardType,
          action,
        }),
      })
    } catch (err) {
      console.error('Failed to record swipe:', err)
    }

    setTimeout(() => setLastAction(null), 1500)
    setCurrentIndex(prev => prev + 1)
  }

  // ─── No city set ─────────────────────────────────────────────────────
  if (!city) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📍</div>
          <h1 className="text-2xl font-bold text-white mb-3">Set your city first</h1>
          <p className="text-white/60 mb-6">Complete onboarding to start swiping on events and venues in your city.</p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold hover:from-purple-500 hover:to-fuchsia-500 transition-all"
          >
            Get Started →
          </Link>
        </div>
      </div>
    )
  }

  // ─── Loading ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">🤖</div>
          <p className="text-white/60 text-sm">AI Scout is finding things to do in {city}...</p>
        </div>
      </div>
    )
  }

  // ─── No cards left ───────────────────────────────────────────────────
  const currentCard = feed[currentIndex]
  const nextCard = feed[currentIndex + 1]

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex flex-col">
        {/* Header */}
        <header className="px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            VibeSwipe
          </Link>
          <div className="flex gap-3">
            <Link href="/saved" className="text-white/60 hover:text-white text-sm">❤️ Saved</Link>
            <Link href="/alerts" className="text-white/60 hover:text-white text-sm">🔔 Alerts</Link>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-3">You&apos;ve seen it all!</h2>
            <p className="text-white/60 mb-2">
              {swipeCount > 0
                ? `You swiped through ${swipeCount} cards. Nice!`
                : 'No events found for this category.'}
            </p>
            <p className="text-white/40 text-sm mb-6">Our AI scouts are finding more events. Check back soon!</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={fetchFeed}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-medium hover:from-purple-500 hover:to-fuchsia-500 transition-all"
              >
                Refresh Feed
              </button>
              <Link
                href="/saved"
                className="px-5 py-2.5 rounded-xl bg-white/10 text-white font-medium hover:bg-white/15 transition-all"
              >
                View Saved
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex flex-col">
      {/* Header */}
      <header className="px-4 py-3 flex items-center justify-between shrink-0">
        <Link href="/" className="text-lg font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
          VibeSwipe
        </Link>
        <div className="flex items-center gap-1.5 text-white/50 text-xs">
          <span>📍 {city}</span>
          <span>·</span>
          <span>{feed.length - currentIndex} left</span>
        </div>
        <div className="flex gap-3">
          <Link href="/saved" className="text-white/60 hover:text-white text-sm">❤️</Link>
          <Link href="/alerts" className="text-white/60 hover:text-white text-sm">🔔</Link>
        </div>
      </header>

      {/* Category filters */}
      <div className="px-4 py-2 shrink-0 overflow-x-auto scrollbar-none">
        <div className="flex gap-2 min-w-max">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70'
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards stack */}
      <div className="flex-1 relative px-4 py-2 min-h-0">
        <div className="relative w-full h-full max-w-md mx-auto" style={{ minHeight: '480px' }}>
          <AnimatePresence>
            {nextCard && (
              <SwipeCard key={nextCard.id} card={nextCard} onSwipe={() => {}} isTop={false} />
            )}
            {currentCard && (
              <SwipeCard key={currentCard.id} card={currentCard} onSwipe={handleSwipe} isTop={true} />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 py-4 shrink-0">
        <div className="flex items-center justify-center gap-5 max-w-xs mx-auto">
          <button
            onClick={() => handleSwipe('left')}
            className="w-14 h-14 rounded-full bg-white/5 border border-rose-500/30 flex items-center justify-center hover:bg-rose-500/10 transition-all active:scale-90"
            aria-label="Pass"
          >
            <span className="text-2xl">✕</span>
          </button>

          <button
            onClick={() => handleSwipe('up')}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25 active:scale-90"
            aria-label="Super like"
          >
            <span className="text-3xl">⭐</span>
          </button>

          <button
            onClick={() => handleSwipe('right')}
            className="w-14 h-14 rounded-full bg-white/5 border border-emerald-500/30 flex items-center justify-center hover:bg-emerald-500/10 transition-all active:scale-90"
            aria-label="Like"
          >
            <span className="text-2xl">❤️</span>
          </button>
        </div>
      </div>

      {/* Last action toast */}
      <AnimatePresence>
        {lastAction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm font-medium shadow-lg z-50 ${
              lastAction.action === 'like' ? 'bg-emerald-500/90 text-white' :
              lastAction.action === 'superlike' ? 'bg-cyan-500/90 text-white' :
              'bg-white/10 text-white/70 backdrop-blur-xl'
            }`}
          >
            {lastAction.action === 'like' && `❤️ Liked ${lastAction.card}`}
            {lastAction.action === 'superlike' && `⭐ Super liked ${lastAction.card}`}
            {lastAction.action === 'pass' && `Passed on ${lastAction.card}`}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
