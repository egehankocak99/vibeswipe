'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { MockEvent, getSavedEvents, unsaveEvent, CATEGORIES } from '@/lib/mock-data'

export default function SavedPage() {
  const [items, setItems] = useState<MockEvent[]>([])
  const [filter, setFilter] = useState('all')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setItems(getSavedEvents())
  }, [])

  const handleUnsave = (id: string) => {
    unsaveEvent(id)
    setItems(prev => prev.filter(e => e.id !== id))
  }

  const filtered = filter === 'all'
    ? items
    : items.filter(e => e.category === filter)

  // Get unique categories from saved items  
  const savedCategories = ['all', ...Array.from(new Set(items.map(e => e.category)))]

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  if (!mounted) return null

  return (
    <div className="min-h-screen flex flex-col pb-safe">
      {/* ── Header ── */}
      <header className="px-5 pt-5 pb-3 flex items-center justify-between sticky top-0 z-30 bg-[var(--bg)]/90 backdrop-blur-xl">
        <Link href="/swipe" className="text-[var(--text-secondary)] text-sm hover:text-white transition-colors">
          ← Back
        </Link>
        <h1 className="text-base font-semibold text-white">Saved</h1>
        <div className="w-12" />
      </header>

      {/* ── Filter pills ── */}
      {items.length > 0 && (
        <div className="px-5 py-2 overflow-x-auto hide-scrollbar">
          <div className="flex gap-1.5 min-w-max">
            {savedCategories.map(cat => {
              const catInfo = CATEGORIES.find(c => c.id === cat)
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    filter === cat
                      ? 'bg-white/10 text-white border border-white/15'
                      : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                  }`}
                >
                  {cat === 'all' ? `All (${items.length})` : `${catInfo?.emoji || ''} ${cat}`}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Content ── */}
      <div className="flex-1 px-5 py-3">
        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <div className="text-center fade-in-up">
              <div className="text-5xl mb-4">♡</div>
              <h2 className="text-lg font-semibold text-white mb-1">Nothing saved yet</h2>
              <p className="text-[var(--text-tertiary)] text-sm mb-6">
                Swipe right on events you like to save them here.
              </p>
              <Link href="/swipe" className="btn-primary">
                Start Exploring
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="glass-solid rounded-2xl overflow-hidden"
                >
                  <div className="flex gap-0">
                    {/* Color strip / mini coaster */}
                    <div
                      className="w-20 shrink-0 flex items-center justify-center relative"
                      style={{
                        background: `linear-gradient(145deg, ${event.gradientFrom}, ${event.gradientTo})`,
                      }}
                    >
                      <span className="text-3xl select-none" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' }}>
                        {event.emoji}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 p-3.5 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-white truncate">{event.title}</h3>
                          <p className="text-[var(--text-tertiary)] text-xs truncate">
                            {event.venueName} · {event.neighborhood}
                          </p>
                        </div>
                        <button
                          onClick={() => handleUnsave(event.id)}
                          className="shrink-0 w-7 h-7 rounded-full bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08] transition-colors"
                        >
                          <span className="text-xs">✕</span>
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="tag-pill text-[10px]">📅 {formatDate(event.startDate)}</span>
                        <span className="tag-pill text-[10px]">🕐 {event.doorsOpen}</span>
                        <span className={`tag-pill text-[10px] ${event.isFree ? 'bg-emerald-500/10 text-emerald-400' : ''}`}>
                          {event.isFree ? '🆓 Free' : `💰 €${event.priceMin}`}
                        </span>
                      </div>

                      <div className="flex gap-1 mt-2">
                        {event.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[var(--text-tertiary)] text-[10px]">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Bottom Nav ── */}
      <nav className="bottom-nav">
        <div className="flex justify-around max-w-sm mx-auto">
          <Link href="/swipe" className="nav-item">
            <span className="nav-icon">✦</span>
            <span>Explore</span>
          </Link>
          <Link href="/saved" className="nav-item active">
            <span className="nav-icon">♡</span>
            <span>Saved</span>
          </Link>
          <Link href="/alerts" className="nav-item">
            <span className="nav-icon">◎</span>
            <span>Alerts</span>
          </Link>
          <Link href="/preferences" className="nav-item">
            <span className="nav-icon">⚙</span>
            <span>Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
