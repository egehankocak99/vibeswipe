import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scoreVenueForUser, scoreEventForUser } from '@/lib/venue-intelligence'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const city = searchParams.get('city')
    const feedType = searchParams.get('type') || 'all' // "venues" | "events" | "all"
    const category = searchParams.get('category') || '' // "nightlife" | "social" | "sports" | "food" | "arts" | "learning" | etc.

    let userPrefs = {
      vibeStyles: [] as string[],
      goOutDays: ['friday', 'saturday'] as string[],
      budgetLevel: 'any',
      musicGenres: [] as string[],
    }
    let userCity = city || ''

    // Load user preferences
    if (userId) {
      const profile = await prisma.profile.findUnique({ where: { userId } })
      if (profile) {
        userCity = userCity || profile.currentCity
        userPrefs = {
          vibeStyles: JSON.parse(profile.vibeStyles || '[]'),
          goOutDays: JSON.parse(profile.goOutDays || '[]'),
          budgetLevel: profile.budgetLevel,
          musicGenres: JSON.parse(profile.musicGenres || '[]'),
        }
      }
    }

    if (!userCity) {
      return NextResponse.json({ venues: [], events: [], message: 'Set your city first' })
    }

    // Get swiped IDs to exclude
    const swipedVenueIds = userId
      ? (await prisma.swipe.findMany({
          where: { userId, venueCardId: { not: null } },
          select: { venueCardId: true },
        })).map(s => s.venueCardId!)
      : []

    const swipedEventIds = userId
      ? (await prisma.swipe.findMany({
          where: { userId, eventCardId: { not: null } },
          select: { eventCardId: true },
        })).map(s => s.eventCardId!)
      : []

    // Fetch venues
    let venues: any[] = []
    if (feedType === 'venues' || feedType === 'all') {
      const rawVenues = await prisma.venueCard.findMany({
        where: {
          city: userCity,
          id: { notIn: swipedVenueIds },
        },
        take: 30,
        orderBy: { vibeScore: 'desc' },
      })

      venues = rawVenues.map(v => {
        const matchScore = scoreVenueForUser(
          {
            venueType: v.venueType,
            priceLevel: v.priceLevel,
            rating: v.rating,
            vibeScore: v.vibeScore,
            tags: JSON.parse(v.tags || '[]'),
            bestNights: JSON.parse(v.bestNights || '[]'),
            musicGenres: JSON.parse(v.musicGenres || '[]'),
            hasDanceFloor: v.hasDanceFloor,
            hasLiveMusic: v.hasLiveMusic,
            hasOutdoor: v.hasOutdoor,
          },
          userPrefs
        )
        return {
          ...v,
          tags: JSON.parse(v.tags || '[]'),
          imageUrls: JSON.parse(v.imageUrls || '[]'),
          bestNights: JSON.parse(v.bestNights || '[]'),
          musicGenres: JSON.parse(v.musicGenres || '[]'),
          popularTimes: JSON.parse(v.popularTimes || '{}'),
          sourceData: JSON.parse(v.sourceData || '[]'),
          openingHours: JSON.parse(v.openingHours || '{}'),
          bestDaysToVisit: JSON.parse(v.bestDaysToVisit || '[]'),
          mustTryItems: JSON.parse(v.mustTryItems || '[]'),
          tips: JSON.parse(v.tips || '[]'),
          matchScore,
          cardType: 'venue',
        }
      })
    }

    // Fetch events
    let events: any[] = []
    if (feedType === 'events' || feedType === 'all') {
      const rawEvents = await prisma.eventCard.findMany({
        where: {
          city: userCity,
          id: { notIn: swipedEventIds },
          startDate: { gte: new Date() },
          ...(category ? { category } : {}),
        },
        take: 30,
        orderBy: { startDate: 'asc' },
      })

      events = rawEvents.map(e => {
        const matchScore = scoreEventForUser(
          {
            eventType: e.eventType,
            hypeScore: e.hypeScore,
            priceMin: e.priceMin,
            priceMax: e.priceMax,
            isFree: e.isFree,
            dayOfWeek: e.dayOfWeek,
            genre: e.genre,
            musicGenres: JSON.parse(e.musicGenres || '[]'),
            tags: JSON.parse(e.tags || '[]'),
            artists: JSON.parse(e.artists || '[]'),
          },
          userPrefs
        )
        return {
          ...e,
          tags: JSON.parse(e.tags || '[]'),
          imageUrls: JSON.parse(e.imageUrls || '[]'),
          artists: JSON.parse(e.artists || '[]'),
          musicGenres: JSON.parse(e.musicGenres || '[]'),
          matchScore,
          cardType: 'event',
        }
      })
    }

    // Interleave venues and events, sorted by match score
    const feed = [...venues, ...events].sort((a, b) => b.matchScore - a.matchScore)

    return NextResponse.json({
      feed,
      venues,
      events,
      city: userCity,
      count: feed.length,
    })
  } catch (error) {
    console.error('Feed error:', error)
    return NextResponse.json({ error: 'Failed to load feed' }, { status: 500 })
  }
}
