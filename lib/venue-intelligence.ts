// ─── Venue Intelligence: Scoring, Matching & Recommendations ─────────

interface UserPreferences {
  vibeStyles: string[]
  goOutDays: string[]
  budgetLevel: string
  musicGenres: string[]
}

interface VenueForScoring {
  venueType: string
  priceLevel: string
  rating: number
  vibeScore: number
  tags: string[]
  bestNights: string[]
  musicGenres: string[]
  hasDanceFloor: boolean
  hasLiveMusic: boolean
  hasOutdoor: boolean
}

interface EventForScoring {
  eventType: string
  hypeScore: number
  priceMin: number
  priceMax: number
  isFree: boolean
  dayOfWeek: string
  genre: string
  musicGenres: string[]
  tags: string[]
  artists: string[]
}

/**
 * Score a venue card against user preferences (0-100)
 */
export function scoreVenueForUser(venue: VenueForScoring, prefs: UserPreferences): number {
  let score = 0
  let maxScore = 0

  // ── Vibe match (40 pts) ──
  maxScore += 40
  const vibeOverlap = venue.tags.filter(t => prefs.vibeStyles.includes(t)).length
  if (prefs.vibeStyles.length > 0 && venue.tags.length > 0) {
    score += Math.min(40, (vibeOverlap / Math.max(prefs.vibeStyles.length, 1)) * 40)
  } else {
    score += 20 // neutral
  }

  // ── Night match (20 pts) ──
  maxScore += 20
  const nightOverlap = venue.bestNights.filter(n => prefs.goOutDays.includes(n)).length
  if (prefs.goOutDays.length > 0 && venue.bestNights.length > 0) {
    score += Math.min(20, (nightOverlap / Math.max(prefs.goOutDays.length, 1)) * 20)
  } else {
    score += 10
  }

  // ── Budget match (15 pts) ──
  maxScore += 15
  const priceLevelMap: Record<string, number> = { '$': 1, '$$': 2, '$$$': 3, '$$$$': 4 }
  const venuePrice = priceLevelMap[venue.priceLevel] || 2
  const budgetMap: Record<string, number[]> = {
    budget: [1, 2],
    medium: [2, 3],
    premium: [3, 4],
    any: [1, 2, 3, 4],
  }
  const budgetRange = budgetMap[prefs.budgetLevel] || [1, 2, 3, 4]
  if (budgetRange.includes(venuePrice)) {
    score += 15
  } else {
    score += 5
  }

  // ── Music genre match (15 pts) ──
  maxScore += 15
  const genreOverlap = venue.musicGenres.filter(g => prefs.musicGenres.includes(g)).length
  if (prefs.musicGenres.length > 0 && venue.musicGenres.length > 0) {
    score += Math.min(15, (genreOverlap / Math.max(prefs.musicGenres.length, 1)) * 15)
  } else {
    score += 7
  }

  // ── Rating bonus (10 pts) ──
  maxScore += 10
  score += Math.min(10, (venue.rating / 5) * 10)

  return Math.round((score / maxScore) * 100)
}

/**
 * Score an event card against user preferences (0-100)
 */
export function scoreEventForUser(event: EventForScoring, prefs: UserPreferences): number {
  let score = 0
  let maxScore = 0

  // ── Genre match (30 pts) ──
  maxScore += 30
  const genreOverlap = event.musicGenres.filter(g => prefs.musicGenres.includes(g)).length
  if (prefs.musicGenres.length > 0 && event.musicGenres.length > 0) {
    score += Math.min(30, (genreOverlap / Math.max(prefs.musicGenres.length, 1)) * 30)
  } else {
    score += 15
  }

  // ── Day match (20 pts) ──
  maxScore += 20
  if (prefs.goOutDays.length > 0) {
    if (prefs.goOutDays.includes(event.dayOfWeek)) {
      score += 20
    }
  } else {
    score += 10
  }

  // ── Vibe/tag match (20 pts) ──
  maxScore += 20
  const tagOverlap = event.tags.filter(t => prefs.vibeStyles.includes(t)).length
  if (prefs.vibeStyles.length > 0) {
    score += Math.min(20, (tagOverlap / Math.max(prefs.vibeStyles.length, 1)) * 20)
  } else {
    score += 10
  }

  // ── Budget (15 pts) ──
  maxScore += 15
  if (event.isFree) {
    score += 15
  } else {
    const budgetCeiling: Record<string, number> = { budget: 20, medium: 50, premium: 200, any: 999 }
    const maxBudget = budgetCeiling[prefs.budgetLevel] || 999
    if (event.priceMax <= maxBudget) {
      score += 15
    } else if (event.priceMin <= maxBudget) {
      score += 8
    }
  }

  // ── Hype bonus (15 pts) ──
  maxScore += 15
  score += Math.min(15, (event.hypeScore / 100) * 15)

  return Math.round((score / maxScore) * 100)
}

/**
 * Get a short recommendation label for a venue score
 */
export function getVenueMatchLabel(score: number): { label: string; color: string } {
  if (score >= 85) return { label: 'Perfect Match', color: 'emerald' }
  if (score >= 70) return { label: 'Great Fit', color: 'violet' }
  if (score >= 50) return { label: 'Worth Trying', color: 'amber' }
  return { label: 'Explore', color: 'slate' }
}

export function getEventMatchLabel(score: number): { label: string; color: string } {
  if (score >= 85) return { label: '🔥 Must Go', color: 'rose' }
  if (score >= 70) return { label: 'Hot Pick', color: 'violet' }
  if (score >= 50) return { label: 'Check It Out', color: 'amber' }
  return { label: 'Discover', color: 'slate' }
}
