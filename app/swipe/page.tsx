'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import Link from 'next/link'
import {
  MockEvent,
  MOCK_EVENTS,
  CATEGORIES,
  getUnswipedEvents,
  markSwiped,
  saveEvent,
  resetSwipes,
} from '@/lib/mock-data'

// ─── Coaster Card Component ─────────────────────────────────────────
function CoasterCard({
  event,
  onSwipe,
  isTop,
}: {
  event: MockEvent
  onSwipe: (dir: 'left' | 'right' | 'up') => void
  isTop: boolean
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18])
  const likeOpacity = useTransform(x, [0, 80], [0, 1])
  const nopeOpacity = useTransform(x, [-80, 0], [1, 0])
  const superOpacity = useTransform(y, [-80, 0], [1, 0])

  const [expanded, setExpanded] = useState(false)

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100
    if (info.offset.y < -threshold) return onSwipe('up')
    if (info.offset.x > threshold) return onSwipe('right')
    if (info.offset.x < -threshold) return onSwipe('left')
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  const priceLabel = event.isFree
    ? 'Free'
    : event.priceMin === event.priceMax
    ? `€${event.priceMin}`
    : `€${event.priceMin}–€${event.priceMax}`

  return (
    <motion.div
      className={`absolute inset-0 ${isTop ? 'z-10 cursor-grab active:cursor-grabbing' : 'z-0'}`}
      style={{ x, y, rotate }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      initial={{ scale: isTop ? 1 : 0.94, opacity: isTop ? 1 : 0.5 }}
      animate={{ scale: isTop ? 1 : 0.94, opacity: isTop ? 1 : 0.5 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      whileDrag={{ scale: 1.02 }}
    >
      <div
        className="coaster-card coaster-texture w-full h-full flex flex-col"
        onClick={() => isTop && setExpanded(!expanded)}
      >
        {/* ── Illustration Area ── */}
        <div
          className="coaster-illustration relative flex-shrink-0"
          style={{
            height: expanded ? '42%' : '58%',
            background: `linear-gradient(145deg, ${event.gradientFrom}, ${event.gradientTo})`,
            transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Decorative shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute w-32 h-32 rounded-full opacity-10"
              style={{
                background: event.gradientTo,
                top: '10%',
                right: '-8%',
                filter: 'blur(20px)',
              }}
            />
            <div
              className="absolute w-24 h-24 rounded-full opacity-[0.07]"
              style={{
                background: '#fff',
                bottom: '15%',
                left: '5%',
                filter: 'blur(15px)',
              }}
            />
            <div
              className="absolute w-16 h-16 rounded-full opacity-[0.05]"
              style={{
                background: '#fff',
                top: '40%',
                right: '25%',
                filter: 'blur(10px)',
              }}
            />
            {/* Small decorative dots */}
            <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 rounded-full bg-white/10" />
            <div className="absolute top-[35%] right-[18%] w-1 h-1 rounded-full bg-white/15" />
            <div className="absolute bottom-[25%] left-[40%] w-2 h-2 rounded-full bg-white/[0.07]" />
            <div className="absolute top-[55%] left-[70%] w-1 h-1 rounded-full bg-white/10" />
          </div>

          {/* Central emoji illustration */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="select-none float"
              style={{ fontSize: '5rem', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))' }}
            >
              {event.emoji}
            </span>
          </div>

          {/* Swipe indicators */}
          <motion.div
            className="absolute top-6 right-6 rounded-2xl px-4 py-2 z-20 border-2 border-emerald-400/80 bg-emerald-400/10 backdrop-blur-md"
            style={{ opacity: likeOpacity }}
          >
            <span className="text-emerald-400 font-bold text-lg tracking-wide">SAVE</span>
          </motion.div>
          <motion.div
            className="absolute top-6 left-6 rounded-2xl px-4 py-2 z-20 border-2 border-white/30 bg-white/5 backdrop-blur-md"
            style={{ opacity: nopeOpacity }}
          >
            <span className="text-white/70 font-bold text-lg tracking-wide">SKIP</span>
          </motion.div>
          <motion.div
            className="absolute top-6 left-1/2 -translate-x-1/2 rounded-2xl px-4 py-2 z-20 border-2 border-amber-400/80 bg-amber-400/10 backdrop-blur-md"
            style={{ opacity: superOpacity }}
          >
            <span className="text-amber-400 font-bold text-lg tracking-wide">LOVE ★</span>
          </motion.div>

          {/* Category pill */}
          <div className="absolute top-5 left-5 z-10">
            <div className="px-3 py-1 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
              <span className="text-white/80 text-xs font-medium">
                {CATEGORIES.find(c => c.id === event.category)?.emoji} {event.category}
              </span>
            </div>
          </div>

          {/* Match score */}
          <div className="absolute top-5 right-5 z-10">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center border-2 bg-black/20 backdrop-blur-md"
              style={{ borderColor: `${event.accentColor}80` }}
            >
              <span className="text-white text-xs font-bold">{event.matchScore}%</span>
            </div>
          </div>

          {/* Trending badge */}
          {event.isTrending && (
            <div className="absolute bottom-4 left-5 z-10">
              <div className="px-2.5 py-1 rounded-full bg-orange-500/20 backdrop-blur-md border border-orange-400/20">
                <span className="text-orange-300 text-[11px] font-semibold">🔥 Trending</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Info Area ── */}
        <div className="flex-1 bg-[var(--surface)] p-5 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle top gradient from illustration */}
          <div
            className="absolute top-0 left-0 right-0 h-16 opacity-10"
            style={{
              background: `linear-gradient(to bottom, ${event.gradientTo}, transparent)`,
            }}
          />

          <div className="relative z-10">
            <h2 className="text-xl font-bold text-white leading-tight mb-1">{event.title}</h2>
            <p className="text-[var(--text-secondary)] text-sm mb-3">
              {event.venueName} · {event.neighborhood}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className="tag-pill">📅 {formatDate(event.startDate)}</span>
              <span className="tag-pill">🕐 {event.doorsOpen}</span>
              <span className={`tag-pill ${event.isFree ? 'bg-emerald-500/10 text-emerald-400' : ''}`}>
                {event.isFree ? '🆓' : '💰'} {priceLabel}
              </span>
              {event.isRecurring && <span className="tag-pill">🔄 Weekly</span>}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {event.tags.slice(0, 4).map(tag => (
                <span key={tag} className="text-[var(--text-tertiary)] text-[11px]">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Artists */}
            {event.artists.length > 0 && event.artists[0] !== '' && (
              <p className="text-[var(--text-secondary)] text-xs mb-2">
                🎤 {event.artists.join(' · ')}
              </p>
            )}

            {/* Expanded: AI insight + description */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-3">
                    {event.description}
                  </p>
                  <div
                    className="rounded-xl p-3 mb-2"
                    style={{ background: `${event.accentColor}10`, border: `1px solid ${event.accentColor}15` }}
                  >
                    <p className="text-xs leading-relaxed" style={{ color: `${event.accentColor}cc` }}>
                      🤖 {event.aiInsight}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom hint */}
          <div className="relative z-10 flex items-center justify-center pt-1">
            <span className="text-[var(--text-tertiary)] text-[10px]">
              {expanded ? 'tap to collapse' : 'tap for details'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Swipe Page ─────────────────────────────────────────────────
export default function SwipePage() {
  const [feed, setFeed] = useState<MockEvent[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeCategory, setActiveCategory] = useState('all')
  const [swipeCount, setSwipeCount] = useState(0)
  const [lastAction, setLastAction] = useState<{ action: string; title: string } | null>(null)
  const [city, setCity] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const storedCity = localStorage.getItem('vibeswipe_city')
    setCity(storedCity || '')
    setLoaded(true)
  }, [])

  const loadFeed = useCallback(() => {
    const events = getUnswipedEvents(activeCategory)
    setFeed(events)
    setCurrentIndex(0)
  }, [activeCategory])

  useEffect(() => {
    if (loaded) loadFeed()
  }, [loaded, loadFeed])

  const handleSwipe = (dir: 'left' | 'right' | 'up') => {
    const card = feed[currentIndex]
    if (!card) return

    const action = dir === 'right' ? 'save' : dir === 'up' ? 'love' : 'skip'

    // Save on right or up
    if (dir === 'right' || dir === 'up') {
      saveEvent(card.id)
    }
    markSwiped(card.id)

    setLastAction({ action, title: card.title })
    setSwipeCount(prev => prev + 1)

    setTimeout(() => setLastAction(null), 1800)
    setCurrentIndex(prev => prev + 1)
  }

  const handleReset = () => {
    resetSwipes()
    loadFeed()
    setSwipeCount(0)
  }

  // ── Loading ──
  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center fade-in">
          <div className="text-4xl mb-3 pulse-soft">✨</div>
          <p className="text-[var(--text-tertiary)] text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  // ── No city ──
  if (!city) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center fade-in-up">
          <div className="text-5xl mb-4">📍</div>
          <h1 className="text-xl font-bold text-white mb-2">Pick your city first</h1>
          <p className="text-[var(--text-secondary)] text-sm mb-6">
            Set up your profile so we can curate events for you.
          </p>
          <Link href="/onboarding" className="btn-primary">
            Get Started
          </Link>
        </div>
      </div>
    )
  }

  const currentCard = feed[currentIndex]
  const nextCard = feed[currentIndex + 1]

  // ── All swiped ──
  if (!currentCard) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-5 pt-4 pb-2 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold gradient-text">VibeSwipe</Link>
          <div className="flex gap-2">
            <Link href="/saved" className="nav-icon text-lg">❤️</Link>
            <Link href="/alerts" className="nav-icon text-lg">🔔</Link>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center fade-in-up">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-xl font-bold text-white mb-2">You&apos;ve seen it all!</h2>
            <p className="text-[var(--text-secondary)] text-sm mb-1">
              {swipeCount > 0
                ? `${swipeCount} events explored`
                : 'No events in this category'}
            </p>
            <p className="text-[var(--text-tertiary)] text-xs mb-6">
              New events are added daily.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={handleReset} className="btn-primary">
                Reset & Explore Again
              </button>
              <Link href="/saved" className="btn-ghost">
                View Saved
              </Link>
            </div>
          </div>
        </div>

        <BottomNav active="swipe" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Header ── */}
      <header className="px-5 pt-4 pb-2 flex items-center justify-between shrink-0 z-20">
        <Link href="/" className="text-lg font-bold gradient-text">VibeSwipe</Link>
        <div className="flex items-center gap-1 text-[var(--text-tertiary)] text-xs">
          <span>📍 {city}</span>
          <span className="mx-1">·</span>
          <span>{feed.length - currentIndex} left</span>
        </div>
        <div className="flex gap-2">
          <Link href="/saved" className="text-lg opacity-50 hover:opacity-80 transition-opacity">❤️</Link>
          <Link href="/alerts" className="text-lg opacity-50 hover:opacity-80 transition-opacity">🔔</Link>
        </div>
      </header>

      {/* ── Category Pills ── */}
      <div className="px-4 py-2 shrink-0 overflow-x-auto hide-scrollbar z-20">
        <div className="flex gap-1.5 min-w-max">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-white/10 text-white border border-white/15'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Card Stack ── */}
      <div className="flex-1 relative px-4 py-2 min-h-0 z-10">
        <div className="relative w-full h-full max-w-[380px] mx-auto" style={{ minHeight: '520px' }}>
          <AnimatePresence>
            {nextCard && (
              <CoasterCard key={nextCard.id} event={nextCard} onSwipe={() => {}} isTop={false} />
            )}
            {currentCard && (
              <CoasterCard key={currentCard.id} event={currentCard} onSwipe={handleSwipe} isTop={true} />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="px-5 py-3 shrink-0 z-20">
        <div className="flex items-center justify-center gap-4 max-w-[280px] mx-auto">
          <button
            onClick={() => handleSwipe('left')}
            className="w-14 h-14 rounded-full glass-solid flex items-center justify-center hover:bg-[var(--surface-hover)] transition-all active:scale-90"
            aria-label="Skip"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-white/40">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <button
            onClick={() => handleSwipe('up')}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{
              background: `linear-gradient(135deg, ${currentCard.gradientFrom}, ${currentCard.gradientTo})`,
              boxShadow: `0 4px 20px ${currentCard.accentColor}30`,
            }}
            aria-label="Love"
          >
            <span className="text-2xl">⭐</span>
          </button>

          <button
            onClick={() => handleSwipe('right')}
            className="w-14 h-14 rounded-full glass-solid flex items-center justify-center hover:bg-[var(--surface-hover)] transition-all active:scale-90"
            aria-label="Save"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Floating Action Toast ── */}
      <AnimatePresence>
        {lastAction && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50"
          >
            <div className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-xl border ${
              lastAction.action === 'save'
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                : lastAction.action === 'love'
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/20'
                : 'bg-white/5 text-white/40 border-white/10'
            }`}>
              {lastAction.action === 'save' && `❤️ Saved`}
              {lastAction.action === 'love' && `⭐ Loved`}
              {lastAction.action === 'skip' && `Skipped`}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav active="swipe" />
    </div>
  )
}

// ─── Bottom Nav Component ────────────────────────────────────────────
function BottomNav({ active }: { active: string }) {
  return (
    <nav className="bottom-nav">
      <div className="flex justify-around max-w-sm mx-auto">
        <Link href="/swipe" className={`nav-item ${active === 'swipe' ? 'active' : ''}`}>
          <span className="nav-icon">✦</span>
          <span>Explore</span>
        </Link>
        <Link href="/saved" className={`nav-item ${active === 'saved' ? 'active' : ''}`}>
          <span className="nav-icon">♡</span>
          <span>Saved</span>
        </Link>
        <Link href="/alerts" className={`nav-item ${active === 'alerts' ? 'active' : ''}`}>
          <span className="nav-icon">◎</span>
          <span>Alerts</span>
        </Link>
        <Link href="/preferences" className={`nav-item ${active === 'prefs' ? 'active' : ''}`}>
          <span className="nav-icon">⚙</span>
          <span>Settings</span>
        </Link>
      </div>
    </nav>
  )
}
