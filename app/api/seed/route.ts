import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getVenuesForCity, getEventsForCity, getAllSeededCities } from '@/lib/event-scraper'
import { NIGHTLIFE_CITIES } from '@/lib/nightlife-data'

export async function POST() {
  try {
    const seededCities = getAllSeededCities()
    let venueCount = 0
    let eventCount = 0

    for (const cityName of seededCities) {
      const cityInfo = NIGHTLIFE_CITIES.find(c => c.city === cityName)
      if (!cityInfo) continue

      // Seed venues
      const venues = getVenuesForCity(cityName)
      for (const v of venues) {
        await prisma.venueCard.upsert({
          where: { id: `venue_${v.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${v.city.toLowerCase()}` },
          update: {},
          create: {
            id: `venue_${v.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${v.city.toLowerCase()}`,
            name: v.name,
            venueType: v.venueType,
            neighborhood: v.neighborhood,
            city: v.city,
            country: v.country,
            description: v.description,
            imageUrl: v.imageUrl,
            priceLevel: v.priceLevel,
            rating: v.rating,
            reviewCount: v.reviewCount,
            tags: JSON.stringify(v.tags),
            bestNights: JSON.stringify(v.bestNights),
            musicGenres: JSON.stringify(v.musicGenres),
            popularTimes: JSON.stringify(v.popularTimes),
            hasOutdoor: v.hasOutdoor,
            hasFood: v.hasFood,
            hasDanceFloor: v.hasDanceFloor,
            hasLiveMusic: v.hasLiveMusic,
            dressCode: v.dressCode,
            ageRange: v.ageRange,
            instagramHandle: v.instagramHandle,
            websiteUrl: v.websiteUrl,
            vibeScore: Math.round(v.rating * 20),
            aiInsight: `Locals rate ${v.name} as a must-visit ${v.venueType} in ${v.neighborhood}`,
          },
        })
        venueCount++
      }

      // Seed events
      const events = getEventsForCity(cityName, cityInfo.country)
      for (const e of events) {
        const eventId = `event_${e.title.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 40)}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
        await prisma.eventCard.create({
          data: {
            id: eventId,
            title: e.title,
            eventType: e.eventType,
            category: e.category,
            venueName: e.venueName,
            neighborhood: e.neighborhood,
            city: e.city,
            country: e.country,
            description: e.description,
            imageUrl: e.imageUrl,
            startDate: e.startDate,
            doorsOpen: e.doorsOpen,
            dayOfWeek: e.dayOfWeek,
            isRecurring: e.isRecurring,
            priceMin: e.priceMin,
            priceMax: e.priceMax,
            currency: e.currency,
            isFree: e.isFree,
            artists: JSON.stringify(e.artists),
            organizer: e.organizer,
            genre: e.genre,
            musicGenres: JSON.stringify(e.musicGenres),
            tags: JSON.stringify(e.tags),
            hypeScore: e.hypeScore,
            sourcePlatform: e.sourcePlatform,
            discoveredBy: e.discoveredBy,
            aiInsight: `${e.artists?.[0] || e.organizer || 'The lineup'} at ${e.venueName} — don't miss this`,
          },
        })
        eventCount++
      }
    }

    return NextResponse.json({
      success: true,
      seeded: { venues: venueCount, events: eventCount, cities: seededCities },
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 })
  }
}
