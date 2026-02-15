import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, venueCardId, eventCardId, action } = body

    if (!userId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!venueCardId && !eventCardId) {
      return NextResponse.json({ error: 'Must provide venueCardId or eventCardId' }, { status: 400 })
    }

    // Create swipe
    if (venueCardId) {
      await prisma.swipe.upsert({
        where: { userId_venueCardId: { userId, venueCardId } },
        update: { action },
        create: { userId, venueCardId, action },
      })
    }

    if (eventCardId) {
      await prisma.swipe.upsert({
        where: { userId_eventCardId: { userId, eventCardId } },
        update: { action },
        create: { userId, eventCardId, action },
      })
    }

    // Auto-create alert on superlike
    if (action === 'superlike' || action === 'like') {
      if (eventCardId) {
        const event = await prisma.eventCard.findUnique({ where: { id: eventCardId } })
        if (event) {
          await prisma.alert.create({
            data: {
              userId,
              eventCardId,
              alertType: 'new_event',
              message: `Saved: ${event.title}`,
              targetCity: event.city,
              targetGenre: event.genre,
            },
          }).catch(() => {}) // ignore duplicate
        }
      }
    }

    return NextResponse.json({ success: true, action })
  } catch (error) {
    console.error('Swipe error:', error)
    return NextResponse.json({ error: 'Failed to save swipe' }, { status: 500 })
  }
}
