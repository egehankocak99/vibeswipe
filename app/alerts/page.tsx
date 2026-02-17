'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Mock alerts for demo
const MOCK_ALERTS = [
  {
    id: '1',
    type: 'ai-discovery',
    icon: '🤖',
    title: 'New event matching your vibes',
    message: 'Silent Disco at the Gallery was just added — 93% match for you.',
    time: '2h ago',
    isRead: false,
    accentColor: '#a78bfa',
  },
  {
    id: '2',
    type: 'trending',
    icon: '🔥',
    title: 'Trending near you',
    message: 'Midnight Ramen Market is blowing up — 200+ people interested.',
    time: '4h ago',
    isRead: false,
    accentColor: '#f97316',
  },
  {
    id: '3',
    type: 'price-drop',
    icon: '💰',
    title: 'Price drop',
    message: 'Techno Boat Party tickets dropped from €45 to €30.',
    time: '6h ago',
    isRead: true,
    accentColor: '#22c55e',
  },
  {
    id: '4',
    type: 'reminder',
    icon: '⏰',
    title: 'Coming up tomorrow',
    message: 'Moonlit Jazz on the Rooftop starts at 8 PM. Don\'t forget!',
    time: '1d ago',
    isRead: true,
    accentColor: '#f59e0b',
  },
  {
    id: '5',
    type: 'new-event',
    icon: '🎉',
    title: 'Just announced',
    message: 'A new Wine & Life Drawing session was added for next Thursday.',
    time: '1d ago',
    isRead: true,
    accentColor: '#ec4899',
  },
]

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const markRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a))
  }

  const markAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, isRead: true })))
  }

  const unreadCount = alerts.filter(a => !a.isRead).length

  if (!mounted) return null

  return (
    <div className="min-h-screen flex flex-col pb-safe">
      {/* ── Header ── */}
      <header className="px-5 pt-5 pb-3 flex items-center justify-between sticky top-0 z-30 bg-[var(--bg)]/90 backdrop-blur-xl">
        <Link href="/swipe" className="text-[var(--text-secondary)] text-sm hover:text-white transition-colors">
          ← Back
        </Link>
        <div className="flex items-center gap-2">
          <h1 className="text-base font-semibold text-white">Alerts</h1>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-[var(--accent)] text-white text-[10px] font-bold min-w-[18px] text-center">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 ? (
          <button
            onClick={markAllRead}
            className="text-[var(--accent)] text-xs font-medium"
          >
            Read all
          </button>
        ) : (
          <div className="w-12" />
        )}
      </header>

      {/* ── AI Scout Status ── */}
      <div className="px-5 py-3">
        <div className="glass-solid rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center">
            <span className="text-lg">🤖</span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-white">AI Scout Active</h3>
            <p className="text-[var(--text-tertiary)] text-xs">Monitoring events in your city</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-soft" />
        </div>
      </div>

      {/* ── Alerts List ── */}
      <div className="px-5 flex-1">
        <div className="space-y-2">
          {alerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              onClick={() => markRead(alert.id)}
              className={`glass-solid rounded-2xl p-4 cursor-pointer transition-all ${
                !alert.isRead ? 'border-l-2' : ''
              }`}
              style={!alert.isRead ? { borderLeftColor: alert.accentColor } : {}}
            >
              <div className="flex gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: `${alert.accentColor}15`,
                  }}
                >
                  <span className="text-lg">{alert.icon}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`text-sm font-medium truncate ${!alert.isRead ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
                      {alert.title}
                    </h3>
                    <span className="text-[var(--text-tertiary)] text-[10px] shrink-0">{alert.time}</span>
                  </div>
                  <p className="text-[var(--text-tertiary)] text-xs mt-0.5 line-clamp-2">
                    {alert.message}
                  </p>
                </div>

                {!alert.isRead && (
                  <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={{ background: alert.accentColor }} />
                )}
              </div>
            </motion.div>
          ))}
        </div>
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
          <Link href="/alerts" className="nav-item active">
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
