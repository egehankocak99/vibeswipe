import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    // Get liked venues
    const likedVenueSwipes = await prisma.swipe.findMany({
      where: { userId, action: { in: ['like', 'superlike'] }, venueCardId: { not: null } },
      include: { venueCard: true },
      orderBy: { createdAt: 'desc' },
    })

    // Get liked events
    const likedEventSwipes = await prisma.swipe.findMany({
      where: { userId, action: { in: ['like', 'superlike'] }, eventCardId: { not: null } },
      include: { eventCard: true },
      orderBy: { createdAt: 'desc' },
    })

    const venues = likedVenueSwipes
      .filter(s => s.venueCard)
      .map(s => ({
        ...s.venueCard!,
        tags: JSON.parse(s.venueCard!.tags || '[]'),
        imageUrls: JSON.parse(s.venueCard!.imageUrls || '[]'),
        bestNights: JSON.parse(s.venueCard!.bestNights || '[]'),
        musicGenres: JSON.parse(s.venueCard!.musicGenres || '[]'),
        popularTimes: JSON.parse(s.venueCard!.popularTimes || '{}'),
        swipeAction: s.action,
        swipedAt: s.createdAt,
        cardType: 'venue',
      }))

    const events = likedEventSwipes
      .filter(s => s.eventCard)
      .map(s => ({
        ...s.eventCard!,
        tags: JSON.parse(s.eventCard!.tags || '[]'),
        imageUrls: JSON.parse(s.eventCard!.imageUrls || '[]'),
        artists: JSON.parse(s.eventCard!.artists || '[]'),
        musicGenres: JSON.parse(s.eventCard!.musicGenres || '[]'),
        swipeAction: s.action,
        swipedAt: s.createdAt,
        cardType: 'event',
      }))

    return NextResponse.json({
      venues,
      events,
      total: venues.length + events.length,
    })
  } catch (error) {
    console.error('Saved error:', error)
    return NextResponse.json({ error: 'Failed to load saved items' }, { status: 500 })
  }
}
