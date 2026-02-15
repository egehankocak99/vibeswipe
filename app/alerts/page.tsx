'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface Alert {
  id: string
  alertType: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
  eventCardId?: string
  venueCardId?: string
  eventCard?: {
    title: string; eventType: string; category: string; venueName: string; city: string
    startDate: string; imageUrl: string; discoveredBy: string
  }
  venueCard?: {
    name: string; venueType: string; city: string; imageUrl: string
  }
}

const ALERT_ICONS: Record<string, string> = {
  'new-event': '🎉', 'price-drop': '💰', 'trending': '🔥', 'reminder': '⏰',
  'ai-discovery': '🤖', 'new-venue': '📍', 'sold-out-warning': '⚠️',
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('vibeswipe_userId')
    if (stored) setUserId(stored)
  }, [])

  useEffect(() => {
    if (!userId) return
    fetchAlerts()
  }, [userId])

  const fetchAlerts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/alerts?userId=${userId}`)
      const data = await res.json()
      setAlerts(data.alerts || [])
    } catch (err) {
      console.error('Failed to fetch alerts:', err)
    }
    setLoading(false)
  }

  const markRead = async (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, isRead: true } : a))
  }

  const unreadCount = alerts.filter(a => !a.isRead).length

  const formatTime = (d: string) => {
    const diff = Date.now() - new Date(d).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    return `${days}d ago`
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🔔</div>
          <h1 className="text-xl font-bold text-white mb-3">Sign in to see alerts</h1>
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
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-white">Alerts</h1>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-purple-500 text-white text-xs font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="w-12" /> {/* Spacer */}
      </header>

      {/* AI Scout Status */}
      <div className="px-4 py-3">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 flex items-center justify-center">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <h3 className="text-white font-medium text-sm">AI Scout Active</h3>
              <p className="text-white/40 text-xs">Monitoring 200+ accounts across Instagram &amp; TikTok</p>
            </div>
            <div className="ml-auto">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Alerts list */}
      <div className="px-4 pb-24">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-white/40 text-sm animate-pulse">Loading alerts...</div>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔕</div>
            <h2 className="text-white font-semibold mb-2">No alerts yet</h2>
            <p className="text-white/40 text-sm mb-6">
              Like events in your feed and we&apos;ll alert you about similar ones,<br />
              price drops, and trending happenings.
            </p>

            {/* Sample alerts preview */}
            <div className="space-y-2 max-w-sm mx-auto">
              <p className="text-white/30 text-xs uppercase tracking-wider mb-3">What you&apos;ll get:</p>
              {[
                { icon: '🤖', text: 'AI Scout found a language exchange in your city' },
                { icon: '🔥', text: 'Trending: Beach yoga is blowing up this weekend' },
                { icon: '💰', text: 'Price drop: Cooking class now €10 off' },
                { icon: '🎉', text: 'New event matching your vibes: Pub Quiz Night' },
              ].map((sample, i) => (
                <div key={i} className="glass rounded-xl p-3 flex items-center gap-3 opacity-50">
                  <span className="text-lg">{sample.icon}</span>
                  <span className="text-white/50 text-xs text-left">{sample.text}</span>
                </div>
              ))}
            </div>

            <Link
              href="/swipe"
              className="inline-block mt-6 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-sm font-medium"
            >
              Start Swiping →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {alerts.map((alert, i) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => markRead(alert.id)}
                  className={`glass rounded-2xl p-4 cursor-pointer transition-all ${
                    !alert.isRead ? 'border border-purple-500/30 shadow-lg shadow-purple-500/10' : 'opacity-70'
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Icon or image */}
                    {alert.eventCard?.imageUrl || alert.venueCard?.imageUrl ? (
                      <div
                        className="w-12 h-12 rounded-xl bg-cover bg-center shrink-0"
                        style={{ backgroundImage: `url(${alert.eventCard?.imageUrl || alert.venueCard?.imageUrl})` }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                        <span className="text-2xl">{ALERT_ICONS[alert.alertType] || '📌'}</span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`text-sm font-medium truncate ${alert.isRead ? 'text-white/70' : 'text-white'}`}>
                          {alert.title}
                        </h3>
                        <span className="text-white/30 text-[10px] shrink-0">{formatTime(alert.createdAt)}</span>
                      </div>
                      <p className="text-white/50 text-xs mt-0.5 line-clamp-2">{alert.message}</p>

                      {/* Related card info */}
                      {alert.eventCard && (
                        <div className="flex gap-1.5 mt-2">
                          <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/40 text-[10px]">
                            {alert.eventCard.category}
                          </span>
                          {alert.eventCard.discoveredBy === 'ai_scout' && (
                            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[10px]">
                              🤖 AI Scout
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Unread dot */}
                    {!alert.isRead && (
                      <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0 mt-2" />
                    )}
                  </div>
                </motion.div>
              ))}
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
          <Link href="/saved" className="flex flex-col items-center gap-1 text-white/40 hover:text-white/60">
            <span className="text-lg">❤️</span>
            <span className="text-[10px]">Saved</span>
          </Link>
          <Link href="/alerts" className="flex flex-col items-center gap-1 text-purple-400">
            <span className="text-lg">🔔</span>
            <span className="text-[10px] font-medium">Alerts</span>
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
