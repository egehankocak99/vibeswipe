import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { syncTicketmasterEvents } from '@/lib/api-ticketmaster'
import { syncFoursquareVenues } from '@/lib/api-foursquare'
import { syncEventbriteEvents } from '@/lib/api-eventbrite'
import { SUPPORTED_CITIES } from '@/lib/nightlife-data'

// ─── Weekly Data Refresh Endpoint ────────────────────────────────────
// Call this 1-2 times per week via cron (Railway cron, Vercel cron, or external)
// GET /api/refresh?key=YOUR_SECRET — triggers full refresh
// GET /api/refresh?key=YOUR_SECRET&city=Barcelona — refresh single city
// GET /api/refresh?key=YOUR_SECRET&source=ticketmaster — refresh one source only
//
// Set REFRESH_SECRET env var to protect this endpoint.

const REFRESH_SECRET = process.env.REFRESH_SECRET || 'vibeswipe-refresh-2024'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')
  const targetCity = searchParams.get('city')
  const source = searchParams.get('source') // "ticketmaster" | "foursquare" | "eventbrite" | "all"

  // Auth check
  if (key !== REFRESH_SECRET) {
    return NextResponse.json({ error: 'Invalid refresh key' }, { status: 401 })
  }

  const startTime = Date.now()
  const results: RefreshResult[] = []
  const cities = targetCity ? [targetCity] : SUPPORTED_CITIES.slice(0, 15) // Top 15 cities by default

  console.log(`\n🔄 Starting data refresh for ${cities.length} cities...`)
  console.log(`   Source: ${source || 'all'}`)
  console.log(`   Time: ${new Date().toISOString()}\n`)

  for (const city of cities) {
    const cityResult: RefreshResult = {
      city,
      ticketmaster: { events: 0, status: 'skipped' },
      eventbrite: { events: 0, status: 'skipped' },
      foursquare: { venues: 0, status: 'skipped' },
    }

    try {
      // ── Ticketmaster (concerts, sports, theater) ──
      if (!source || source === 'all' || source === 'ticketmaster') {
        try {
          const count = await syncTicketmasterEvents(city)
          cityResult.ticketmaster = { events: count, status: 'success' }
        } catch (err) {
          cityResult.ticketmaster = { events: 0, status: 'error' }
          console.error(`Ticketmaster error for ${city}:`, err)
        }
      }

      // ── Eventbrite (community events, workshops, meetups) ──
      if (!source || source === 'all' || source === 'eventbrite') {
        try {
          const count = await syncEventbriteEvents(city)
          cityResult.eventbrite = { events: count, status: 'success' }
        } catch (err) {
          cityResult.eventbrite = { events: 0, status: 'error' }
          console.error(`Eventbrite error for ${city}:`, err)
        }
      }

      // ── Foursquare (venues: bars, cafes, restaurants) ──
      if (!source || source === 'all' || source === 'foursquare') {
        try {
          const count = await syncFoursquareVenues(city)
          cityResult.foursquare = { venues: count, status: 'success' }
        } catch (err) {
          cityResult.foursquare = { venues: 0, status: 'error' }
          console.error(`Foursquare error for ${city}:`, err)
        }
      }

      // Rate limiting: 500ms between cities
      await new Promise(resolve => setTimeout(resolve, 500))

    } catch (err) {
      console.error(`Error refreshing ${city}:`, err)
    }

    results.push(cityResult)
  }

  // ── Clean up old events (past events older than 3 days) ──
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  const deleted = await prisma.eventCard.deleteMany({
    where: {
      startDate: { lt: threeDaysAgo },
      sourceApi: { in: ['ticketmaster', 'eventbrite'] }, // only delete API-sourced, keep manual
    },
  })

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)

  // Summary
  const totalEvents = results.reduce((sum, r) => sum + r.ticketmaster.events + r.eventbrite.events, 0)
  const totalVenues = results.reduce((sum, r) => sum + r.foursquare.venues, 0)

  const summary = {
    success: true,
    refreshedAt: new Date().toISOString(),
    elapsed: `${elapsed}s`,
    cities: results.length,
    totalEventsAdded: totalEvents,
    totalVenuesAdded: totalVenues,
    oldEventsDeleted: deleted.count,
    details: results,
    apiStatus: {
      ticketmaster: process.env.TICKETMASTER_API_KEY ? 'configured' : 'missing key',
      eventbrite: process.env.EVENTBRITE_API_KEY ? 'configured' : 'missing key',
      foursquare: process.env.FOURSQUARE_API_KEY ? 'configured' : 'missing key',
    },
  }

  console.log(`\n✅ Refresh complete in ${elapsed}s`)
  console.log(`   Events added: ${totalEvents}`)
  console.log(`   Venues added: ${totalVenues}`)
  console.log(`   Old events cleaned: ${deleted.count}\n`)

  // Log this refresh to ScrapedSource
  await prisma.scrapedSource.create({
    data: {
      platform: 'api_refresh',
      sourceUrl: 'internal',
      city: targetCity || 'all',
      dataType: 'weekly_refresh',
      rawData: JSON.stringify(summary),
      processedAt: new Date(),
      status: 'completed',
    },
  })

  return NextResponse.json(summary)
}

// Also support POST for cron services that use POST
export async function POST(request: NextRequest) {
  return GET(request)
}

interface RefreshResult {
  city: string
  ticketmaster: { events: number; status: string }
  eventbrite: { events: number; status: string }
  foursquare: { venues: number; status: string }
}
