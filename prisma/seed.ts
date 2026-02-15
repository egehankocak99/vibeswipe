import { PrismaClient } from '@prisma/client'
import { getVenuesForCity, getEventsForCity, getAllSeededCities } from '../lib/event-scraper'

const prisma = new PrismaClient()

const CITY_COUNTRY: Record<string, string> = {
  'Barcelona': 'Spain', 'Berlin': 'Germany', 'Amsterdam': 'Netherlands',
  'London': 'United Kingdom', 'Paris': 'France', 'Lisbon': 'Portugal',
  'Prague': 'Czech Republic', 'Budapest': 'Hungary',
  'New York': 'United States', 'Tokyo': 'Japan',
}

async function main() {
  console.log('🌱 Seeding VibeSwipe database...\n')

  const cities = getAllSeededCities()
  let venueCount = 0
  let eventCount = 0

  for (const city of cities) {
    const country = CITY_COUNTRY[city] || 'Unknown'
    console.log(`📍 ${city}, ${country}`)

    // Seed venues
    const venues = getVenuesForCity(city)
    for (const v of venues) {
      const id = `venue_${v.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${v.city.toLowerCase()}`
      await prisma.venueCard.upsert({
        where: { id },
        update: {},
        create: {
          id,
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
    console.log(`   ✅ ${venues.length} venues`)

    // Seed events
    const events = getEventsForCity(city, country)
    for (const e of events) {
      const id = `event_${e.title.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 40)}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
      await prisma.eventCard.create({
        data: {
          id,
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
          aiInsight: `${e.artists?.[0] || e.organizer || 'The lineup'} at ${e.venueName} — discover something new`,
        },
      })
      eventCount++
    }
    console.log(`   ✅ ${events.length} events`)
  }

  console.log(`\n🎉 Done! Seeded ${venueCount} venues + ${eventCount} events across ${cities.length} cities.`)
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
