import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const alerts = await prisma.alert.findMany({
      where: { userId },
      include: { venueCard: true, eventCard: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    const formattedAlerts = alerts.map(a => ({
      id: a.id,
      alertType: a.alertType,
      message: a.message,
      triggered: a.triggered,
      triggeredAt: a.triggeredAt,
      targetCity: a.targetCity,
      targetGenre: a.targetGenre,
      targetArtist: a.targetArtist,
      createdAt: a.createdAt,
      venue: a.venueCard
        ? {
            id: a.venueCard.id,
            name: a.venueCard.name,
            venueType: a.venueCard.venueType,
            imageUrl: a.venueCard.imageUrl,
            neighborhood: a.venueCard.neighborhood,
          }
        : null,
      event: a.eventCard
        ? {
            id: a.eventCard.id,
            title: a.eventCard.title,
            eventType: a.eventCard.eventType,
            imageUrl: a.eventCard.imageUrl,
            startDate: a.eventCard.startDate,
            venueName: a.eventCard.venueName,
            artists: JSON.parse(a.eventCard.artists || '[]'),
          }
        : null,
    }))

    return NextResponse.json({ alerts: formattedAlerts })
  } catch (error) {
    console.error('Alerts error:', error)
    return NextResponse.json({ error: 'Failed to load alerts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, alertType, targetCity, targetGenre, targetArtist, venueCardId, eventCardId } = body

    if (!userId || !alertType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const alert = await prisma.alert.create({
      data: {
        userId,
        alertType,
        targetCity: targetCity || '',
        targetGenre: targetGenre || '',
        targetArtist: targetArtist || '',
        venueCardId,
        eventCardId,
        message: `Alert set for ${alertType.replace('_', ' ')}`,
      },
    })

    return NextResponse.json({ alert, success: true })
  } catch (error) {
    console.error('Create alert error:', error)
    return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 })
  }
}
