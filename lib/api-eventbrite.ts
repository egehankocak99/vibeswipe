// ─── Eventbrite API Integration ──────────────────────────────────────
// Free API for community events: workshops, meetups, food markets,
// language exchanges, yoga, networking, art shows, comedy, etc.
// Sign up: https://www.eventbrite.com/platform/api
// Docs: https://www.eventbrite.com/platform/api#/reference

import { prisma } from './prisma'
import { NIGHTLIFE_CITIES } from './nightlife-data'

const EVENTBRITE_TOKEN = process.env.EVENTBRITE_API_KEY || ''
const BASE_URL = 'https://www.eventbriteapi.com/v3'

// ─── City coordinates for location search ────────────────────────────
const CITY_COORDS: Record<string, { lat: string; lng: string }> = {
  'Barcelona': { lat: '41.3874', lng: '2.1686' },
  'Berlin': { lat: '52.5200', lng: '13.4050' },
  'Amsterdam': { lat: '52.3676', lng: '4.9041' },
  'London': { lat: '51.5074', lng: '-0.1278' },
  'Paris': { lat: '48.8566', lng: '2.3522' },
  'Lisbon': { lat: '38.7223', lng: '-9.1393' },
  'Prague': { lat: '50.0755', lng: '14.4378' },
  'Budapest': { lat: '47.4979', lng: '19.0402' },
  'Athens': { lat: '37.9838', lng: '23.7275' },
  'Milan': { lat: '45.4642', lng: '9.1900' },
  'Rome': { lat: '41.9028', lng: '12.4964' },
  'Copenhagen': { lat: '55.6761', lng: '12.5683' },
  'Istanbul': { lat: '41.0082', lng: '28.9784' },
  'Dublin': { lat: '53.3498', lng: '-6.2603' },
  'New York': { lat: '40.7128', lng: '-74.0060' },
  'Miami': { lat: '25.7617', lng: '-80.1918' },
  'Los Angeles': { lat: '34.0522', lng: '-118.2437' },
  'Tokyo': { lat: '35.6762', lng: '139.6503' },
  'Seoul': { lat: '37.5665', lng: '126.9780' },
  'Bangkok': { lat: '13.7563', lng: '100.5018' },
  'Melbourne': { lat: '-37.8136', lng: '144.9631' },
  'Sydney': { lat: '-33.8688', lng: '151.2093' },
  'Buenos Aires': { lat: '-34.6037', lng: '-58.3816' },
  'Montreal': { lat: '45.5017', lng: '-73.5673' },
  'Tel Aviv': { lat: '32.0853', lng: '34.7818' },
  'Cape Town': { lat: '-33.9249', lng: '18.4241' },
  'Belgrade': { lat: '44.7866', lng: '20.4489' },
  'Mexico City': { lat: '19.4326', lng: '-99.1332' },
  'São Paulo': { lat: '-23.5505', lng: '-46.6333' },
  'Medellín': { lat: '6.2476', lng: '-75.5658' },
  'Dubai': { lat: '25.2048', lng: '55.2708' },
  'Bali': { lat: '-8.3405', lng: '115.0920' },
  'Marrakech': { lat: '31.6295', lng: '-7.9811' },
}

// ─── Eventbrite category IDs → our categories ────────────────────────
// https://www.eventbrite.com/platform/api#/reference/categories
const EB_CATEGORY_MAP: Record<string, { eventType: string; category: string }> = {
  '103': { eventType: 'concert', category: 'music' },           // Music
  '105': { eventType: 'workshop', category: 'arts' },           // Performing & Visual Arts
  '104': { eventType: 'art-show', category: 'arts' },           // Film, Media & Entertainment
  '101': { eventType: 'networking', category: 'community' },    // Business & Professional
  '110': { eventType: 'food-tasting', category: 'food' },       // Food & Drink
  '113': { eventType: 'social-gathering', category: 'community' }, // Community & Culture
  '102': { eventType: 'workshop', category: 'learning' },       // Science & Technology
  '108': { eventType: 'sports-meetup', category: 'sports' },    // Sports & Fitness
  '107': { eventType: 'wellness-class', category: 'wellness' }, // Health & Wellness
  '109': { eventType: 'outdoor-adventure', category: 'outdoor' }, // Travel & Outdoor
  '111': { eventType: 'themed-party', category: 'nightlife' },  // Charity & Causes
  '114': { eventType: 'social-gathering', category: 'social' }, // Religion & Spirituality
  '115': { eventType: 'workshop', category: 'learning' },       // Family & Education
  '106': { eventType: 'market', category: 'community' },        // Fashion & Beauty
  '112': { eventType: 'language-exchange', category: 'social' }, // Government & Politics
  '199': { eventType: 'social-gathering', category: 'social' }, // Other
}

function mapEBCategory(categoryId: string): { eventType: string; category: string } {
  return EB_CATEGORY_MAP[categoryId] || { eventType: 'social-gathering', category: 'community' }
}

// Better event type detection from title/description
function inferEventType(title: string, description: string, category: string): { eventType: string; category: string } {
  const text = `${title} ${description}`.toLowerCase()

  // Language exchange
  if (text.includes('language exchange') || text.includes('intercambio') || text.includes('tandem'))
    return { eventType: 'language-exchange', category: 'social' }

  // Pub quiz / trivia
  if (text.includes('pub quiz') || text.includes('trivia') || text.includes('quiz night'))
    return { eventType: 'pub-quiz', category: 'social' }

  // Comedy
  if (text.includes('comedy') || text.includes('stand-up') || text.includes('standup') || text.includes('open mic'))
    return { eventType: 'comedy', category: 'social' }

  // Yoga / wellness
  if (text.includes('yoga') || text.includes('meditation') || text.includes('breathwork') || text.includes('pilates'))
    return { eventType: 'yoga', category: 'wellness' }

  // Running / cycling / sports
  if (text.includes('running') || text.includes('run club') || text.includes('5k'))
    return { eventType: 'running', category: 'sports' }
  if (text.includes('cycling') || text.includes('bike ride') || text.includes('bike tour'))
    return { eventType: 'cycling', category: 'sports' }

  // Cooking
  if (text.includes('cooking class') || text.includes('masterclass') || text.includes('cocinar'))
    return { eventType: 'cooking-class', category: 'food' }

  // Food market / tasting
  if (text.includes('food market') || text.includes('street food') || text.includes('food festival'))
    return { eventType: 'food-market', category: 'food' }
  if (text.includes('wine tasting') || text.includes('tasting') || text.includes('cata'))
    return { eventType: 'food-tasting', category: 'food' }

  // Art
  if (text.includes('art show') || text.includes('exhibition') || text.includes('gallery') || text.includes('vernissage'))
    return { eventType: 'art-show', category: 'arts' }

  // Workshop
  if (text.includes('workshop') || text.includes('masterclass') || text.includes('class'))
    return { eventType: 'workshop', category: 'learning' }

  // Networking
  if (text.includes('networking') || text.includes('meetup') || text.includes('mixer'))
    return { eventType: 'networking', category: 'community' }

  // DJ / party
  if (text.includes('dj') || text.includes('techno') || text.includes('house music') || text.includes('club night'))
    return { eventType: 'dj-set', category: 'nightlife' }

  // Concert / live music
  if (text.includes('concert') || text.includes('live music') || text.includes('gig') || text.includes('band'))
    return { eventType: 'concert', category: 'music' }

  // Market
  if (text.includes('market') || text.includes('flea market') || text.includes('vintage'))
    return { eventType: 'market', category: 'community' }

  // Cinema
  if (text.includes('cinema') || text.includes('movie') || text.includes('film screening'))
    return { eventType: 'open-air-cinema', category: 'arts' }

  return { eventType: category, category: category || 'community' }
}

// ─── Fetch events from Eventbrite ────────────────────────────────────
export async function fetchEventbriteEvents(cityName: string): Promise<EventbriteEvent[]> {
  if (!EVENTBRITE_TOKEN) {
    console.log(`⚠️  No EVENTBRITE_API_KEY — skipping Eventbrite for ${cityName}`)
    return []
  }

  const coords = CITY_COORDS[cityName]
  if (!coords) {
    console.log(`⚠️  ${cityName} not mapped for Eventbrite`)
    return []
  }

  try {
    const params = new URLSearchParams({
      'location.latitude': coords.lat,
      'location.longitude': coords.lng,
      'location.within': '10km',
      'start_date.range_start': new Date().toISOString().replace('.000', ''),
      'start_date.range_end': new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().replace('.000', ''),
      'sort_by': 'date',
      'expand': 'venue,ticket_availability',
    })

    const response = await fetch(`${BASE_URL}/events/search/?${params}`, {
      headers: {
        'Authorization': `Bearer ${EVENTBRITE_TOKEN}`,
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      console.error(`Eventbrite API error for ${cityName}: ${response.status}`)
      return []
    }

    const data = await response.json()
    const ebEvents = data.events || []

    const events: EventbriteEvent[] = ebEvents.map((ev: any) => {
      const ebCategoryId = ev.category_id || '199'
      const baseMapping = mapEBCategory(ebCategoryId)
      const title = ev.name?.text || ev.name?.html || 'Untitled Event'
      const description = ev.description?.text || ev.summary || ''
      const { eventType, category } = inferEventType(title, description, baseMapping.category)

      const venue = ev.venue || {}
      const isFree = ev.is_free || false
      const startDate = ev.start?.utc || ev.start?.local || ''
      const endDate = ev.end?.utc || ev.end?.local || ''

      // Day of week
      const dayOfWeek = startDate ? new Date(startDate).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() : ''

      return {
        externalId: ev.id,
        title,
        eventType,
        category,
        venueName: venue.name || 'TBA',
        neighborhood: venue.address?.city || cityName,
        city: cityName,
        country: NIGHTLIFE_CITIES.find(c => c.city === cityName)?.country || '',
        description: description.slice(0, 500),
        imageUrl: ev.logo?.original?.url || ev.logo?.url || '',
        startDate,
        endDate,
        doorsOpen: ev.start?.local?.split('T')[1]?.slice(0, 5) || '',
        dayOfWeek,
        priceMin: 0,
        priceMax: 0,
        currency: ev.currency || 'EUR',
        isFree,
        isSoldOut: ev.ticket_availability?.is_sold_out || false,
        organizer: ev.organizer?.name || '',
        genre: '',
        hypeScore: Math.min(100, Math.round(
          (isFree ? 20 : 10) +
          (description.length > 200 ? 15 : 5) +
          Math.random() * 40 + 20
        )),
        ticketUrl: ev.url || '',
        sourceUrl: ev.url || '',
        sourcePlatform: 'eventbrite',
        discoveredBy: 'eventbrite',
        isTrending: ev.ticket_availability?.minimum_ticket_price?.value === 0 && description.length > 100,
      }
    })

    console.log(`🎪 Eventbrite: Found ${events.length} events in ${cityName}`)
    return events
  } catch (error) {
    console.error(`Eventbrite fetch error for ${cityName}:`, error)
    return []
  }
}

// ─── Save Eventbrite events to database ──────────────────────────────
export async function syncEventbriteEvents(cityName: string): Promise<number> {
  const events = await fetchEventbriteEvents(cityName)
  let created = 0

  for (const ev of events) {
    try {
      await prisma.eventCard.upsert({
        where: {
          id: `eb_${ev.externalId}`,
        },
        create: {
          id: `eb_${ev.externalId}`,
          title: ev.title,
          eventType: ev.eventType,
          category: ev.category,
          venueName: ev.venueName,
          neighborhood: ev.neighborhood,
          city: ev.city,
          country: ev.country,
          description: ev.description,
          imageUrl: ev.imageUrl,
          startDate: new Date(ev.startDate),
          endDate: ev.endDate ? new Date(ev.endDate) : null,
          doorsOpen: ev.doorsOpen,
          dayOfWeek: ev.dayOfWeek,
          priceMin: ev.priceMin,
          priceMax: ev.priceMax,
          currency: ev.currency,
          isFree: ev.isFree,
          isSoldOut: ev.isSoldOut,
          organizer: ev.organizer,
          genre: ev.genre,
          hypeScore: ev.hypeScore,
          ticketUrl: ev.ticketUrl,
          sourceUrl: ev.sourceUrl,
          sourcePlatform: ev.sourcePlatform,
          discoveredBy: ev.discoveredBy,
          externalId: ev.externalId,
          sourceApi: 'eventbrite',
          lastRefreshed: new Date(),
          isTrending: ev.isTrending,
          tags: JSON.stringify([ev.category, ev.eventType].filter(Boolean)),
          aiInsight: `🎪 Found on Eventbrite${ev.isFree ? ' — FREE entry!' : ''}${ev.organizer ? ` by ${ev.organizer}` : ''}`,
        },
        update: {
          title: ev.title,
          description: ev.description,
          imageUrl: ev.imageUrl,
          startDate: new Date(ev.startDate),
          endDate: ev.endDate ? new Date(ev.endDate) : null,
          isFree: ev.isFree,
          isSoldOut: ev.isSoldOut,
          hypeScore: ev.hypeScore,
          ticketUrl: ev.ticketUrl,
          lastRefreshed: new Date(),
          isTrending: ev.isTrending,
        },
      })
      created++
    } catch (err) {
      console.error(`Failed to save EB event ${ev.title}:`, err)
    }
  }

  console.log(`✅ Eventbrite: Synced ${created} events for ${cityName}`)
  return created
}

// ─── Types ───────────────────────────────────────────────────────────
interface EventbriteEvent {
  externalId: string
  title: string
  eventType: string
  category: string
  venueName: string
  neighborhood: string
  city: string
  country: string
  description: string
  imageUrl: string
  startDate: string
  endDate: string
  doorsOpen: string
  dayOfWeek: string
  priceMin: number
  priceMax: number
  currency: string
  isFree: boolean
  isSoldOut: boolean
  organizer: string
  genre: string
  hypeScore: number
  ticketUrl: string
  sourceUrl: string
  sourcePlatform: string
  discoveredBy: string
  isTrending: boolean
}
