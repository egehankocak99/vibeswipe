// ─── Ticketmaster Discovery API Integration ──────────────────────────
// Free: 5000 calls/day. Covers concerts, sports, theater, comedy, festivals.
// Sign up: https://developer.ticketmaster.com/
// Docs: https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/

import { prisma } from './prisma'
import { NIGHTLIFE_CITIES } from './nightlife-data'

const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY || ''
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2'

// ─── City-to-Ticketmaster mapping ────────────────────────────────────
// Ticketmaster uses different market IDs and country codes
const CITY_MARKET_MAP: Record<string, { countryCode: string; city: string; latlong?: string; radius?: number }> = {
  'Barcelona': { countryCode: 'ES', city: 'Barcelona', latlong: '41.3874,2.1686', radius: 30 },
  'Berlin': { countryCode: 'DE', city: 'Berlin', latlong: '52.5200,13.4050', radius: 30 },
  'Amsterdam': { countryCode: 'NL', city: 'Amsterdam', latlong: '52.3676,4.9041', radius: 25 },
  'London': { countryCode: 'GB', city: 'London', latlong: '51.5074,-0.1278', radius: 30 },
  'Paris': { countryCode: 'FR', city: 'Paris', latlong: '48.8566,2.3522', radius: 30 },
  'Lisbon': { countryCode: 'PT', city: 'Lisbon', latlong: '38.7223,-9.1393', radius: 25 },
  'Prague': { countryCode: 'CZ', city: 'Prague', latlong: '50.0755,14.4378', radius: 25 },
  'Budapest': { countryCode: 'HU', city: 'Budapest', latlong: '47.4979,19.0402', radius: 25 },
  'Athens': { countryCode: 'GR', city: 'Athens', latlong: '37.9838,23.7275', radius: 25 },
  'Milan': { countryCode: 'IT', city: 'Milan', latlong: '45.4642,9.1900', radius: 25 },
  'Rome': { countryCode: 'IT', city: 'Rome', latlong: '41.9028,12.4964', radius: 25 },
  'Copenhagen': { countryCode: 'DK', city: 'Copenhagen', latlong: '55.6761,12.5683', radius: 25 },
  'Istanbul': { countryCode: 'TR', city: 'Istanbul', latlong: '41.0082,28.9784', radius: 30 },
  'Dublin': { countryCode: 'IE', city: 'Dublin', latlong: '53.3498,-6.2603', radius: 25 },
  'New York': { countryCode: 'US', city: 'New York', latlong: '40.7128,-74.0060', radius: 30 },
  'Miami': { countryCode: 'US', city: 'Miami', latlong: '25.7617,-80.1918', radius: 30 },
  'Los Angeles': { countryCode: 'US', city: 'Los Angeles', latlong: '34.0522,-118.2437', radius: 30 },
  'Tokyo': { countryCode: 'JP', city: 'Tokyo', latlong: '35.6762,139.6503', radius: 30 },
  'Seoul': { countryCode: 'KR', city: 'Seoul', latlong: '37.5665,126.9780', radius: 30 },
  'Melbourne': { countryCode: 'AU', city: 'Melbourne', latlong: '-37.8136,144.9631', radius: 30 },
  'Sydney': { countryCode: 'AU', city: 'Sydney', latlong: '-33.8688,151.2093', radius: 30 },
  'Montreal': { countryCode: 'CA', city: 'Montreal', latlong: '45.5017,-73.5673', radius: 30 },
  'Buenos Aires': { countryCode: 'AR', city: 'Buenos Aires', latlong: '-34.6037,-58.3816', radius: 30 },
}

// ─── Map TM classification to our event types ────────────────────────
function mapTMClassification(segment: string, genre: string, subGenre: string): { eventType: string; category: string } {
  const g = genre.toLowerCase()
  const sg = subGenre.toLowerCase()
  const s = segment.toLowerCase()

  if (s === 'music') {
    if (g.includes('rock') || g.includes('metal')) return { eventType: 'concert', category: 'music' }
    if (g.includes('hip-hop') || g.includes('rap')) return { eventType: 'concert', category: 'music' }
    if (g.includes('electronic') || sg.includes('techno') || sg.includes('house'))
      return { eventType: 'dj-set', category: 'nightlife' }
    if (g.includes('jazz') || g.includes('blues')) return { eventType: 'live-music', category: 'music' }
    if (g.includes('latin') || g.includes('reggaeton')) return { eventType: 'concert', category: 'music' }
    if (g.includes('classical')) return { eventType: 'concert', category: 'arts' }
    if (g.includes('pop')) return { eventType: 'concert', category: 'music' }
    if (g.includes('r&b') || g.includes('soul')) return { eventType: 'concert', category: 'music' }
    if (g.includes('country') || g.includes('folk')) return { eventType: 'live-music', category: 'music' }
    return { eventType: 'concert', category: 'music' }
  }

  if (s === 'sports') return { eventType: 'sports-meetup', category: 'sports' }
  if (s === 'arts & theatre' || s === 'arts') {
    if (g.includes('comedy')) return { eventType: 'comedy', category: 'social' }
    if (g.includes('theatre') || g.includes('theater')) return { eventType: 'workshop', category: 'arts' }
    return { eventType: 'art-show', category: 'arts' }
  }
  if (s === 'film') return { eventType: 'open-air-cinema', category: 'arts' }

  return { eventType: 'concert', category: 'music' }
}

// ─── Fetch events from Ticketmaster ──────────────────────────────────
export async function fetchTicketmasterEvents(cityName: string): Promise<{
  events: TicketmasterEvent[]
  totalFound: number
  source: string
}> {
  if (!TICKETMASTER_API_KEY) {
    console.log(`⚠️  No TICKETMASTER_API_KEY — skipping Ticketmaster for ${cityName}`)
    return { events: [], totalFound: 0, source: 'ticketmaster' }
  }

  const cityConfig = CITY_MARKET_MAP[cityName]
  if (!cityConfig) {
    console.log(`⚠️  ${cityName} not mapped for Ticketmaster`)
    return { events: [], totalFound: 0, source: 'ticketmaster' }
  }

  try {
    const now = new Date().toISOString().split('.')[0] + 'Z'
    const twoWeeksOut = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('.')[0] + 'Z'

    const params = new URLSearchParams({
      apikey: TICKETMASTER_API_KEY,
      latlong: cityConfig.latlong || '',
      radius: String(cityConfig.radius || 30),
      unit: 'km',
      startDateTime: now,
      endDateTime: twoWeeksOut,
      size: '50',
      sort: 'date,asc',
      classificationName: 'music,arts,theatre,comedy,sports',
    })

    const response = await fetch(`${BASE_URL}/events.json?${params}`, {
      headers: { 'Accept': 'application/json' },
    })

    if (!response.ok) {
      console.error(`Ticketmaster API error for ${cityName}: ${response.status}`)
      return { events: [], totalFound: 0, source: 'ticketmaster' }
    }

    const data = await response.json()
    const tmEvents = data._embedded?.events || []
    const totalFound = data.page?.totalElements || 0

    const events: TicketmasterEvent[] = tmEvents.map((ev: any) => {
      const classification = ev.classifications?.[0] || {}
      const segment = classification.segment?.name || ''
      const genre = classification.genre?.name || ''
      const subGenre = classification.subGenre?.name || ''
      const { eventType, category } = mapTMClassification(segment, genre, subGenre)

      const venue = ev._embedded?.venues?.[0] || {}
      const priceRanges = ev.priceRanges?.[0] || {}
      const images = ev.images || []
      const bestImage = images.sort((a: any, b: any) => (b.width || 0) - (a.width || 0))[0]

      const startDate = ev.dates?.start?.dateTime || ev.dates?.start?.localDate || ''
      const artists = ev._embedded?.attractions?.map((a: any) => a.name) || []

      return {
        externalId: ev.id,
        title: ev.name,
        eventType,
        category,
        venueName: venue.name || 'TBA',
        neighborhood: venue.city?.name || cityName,
        city: cityName,
        country: NIGHTLIFE_CITIES.find(c => c.city === cityName)?.country || '',
        description: ev.info || ev.pleaseNote || `${ev.name} at ${venue.name || 'TBA'}`,
        imageUrl: bestImage?.url || '',
        startDate,
        endDate: ev.dates?.end?.dateTime || null,
        doorsOpen: ev.dates?.start?.localTime || '',
        priceMin: priceRanges.min || 0,
        priceMax: priceRanges.max || 0,
        currency: priceRanges.currency || 'EUR',
        isFree: !priceRanges.min && !priceRanges.max,
        isSoldOut: ev.dates?.status?.code === 'offsale',
        artists,
        genre: `${genre}${subGenre ? ' / ' + subGenre : ''}`,
        ticketUrl: ev.url || '',
        sourceUrl: ev.url || '',
        sourcePlatform: 'ticketmaster',
        discoveredBy: 'ticketmaster',
        hypeScore: Math.min(100, Math.round(
          (ev.dates?.status?.code === 'onsale' ? 30 : 0) +
          (artists.length > 0 ? 20 : 0) +
          (priceRanges.max > 80 ? 20 : 5) +
          Math.random() * 30
        )),
        isTrending: (ev.dates?.status?.code === 'onsale' && priceRanges.max > 50),
      }
    })

    console.log(`🎫 Ticketmaster: Found ${events.length}/${totalFound} events in ${cityName}`)
    return { events, totalFound, source: 'ticketmaster' }
  } catch (error) {
    console.error(`Ticketmaster fetch error for ${cityName}:`, error)
    return { events: [], totalFound: 0, source: 'ticketmaster' }
  }
}

// ─── Save Ticketmaster events to database ────────────────────────────
export async function syncTicketmasterEvents(cityName: string): Promise<number> {
  const { events } = await fetchTicketmasterEvents(cityName)
  let created = 0

  for (const ev of events) {
    try {
      // Upsert by externalId to avoid duplicates
      await prisma.eventCard.upsert({
        where: {
          id: `tm_${ev.externalId}`, // use predictable ID
        },
        create: {
          id: `tm_${ev.externalId}`,
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
          priceMin: ev.priceMin,
          priceMax: ev.priceMax,
          currency: ev.currency,
          isFree: ev.isFree,
          isSoldOut: ev.isSoldOut,
          artists: JSON.stringify(ev.artists),
          genre: ev.genre,
          hypeScore: ev.hypeScore,
          ticketUrl: ev.ticketUrl,
          sourceUrl: ev.sourceUrl,
          sourcePlatform: ev.sourcePlatform,
          discoveredBy: ev.discoveredBy,
          externalId: ev.externalId,
          sourceApi: 'ticketmaster',
          lastRefreshed: new Date(),
          isTrending: ev.isTrending,
          tags: JSON.stringify([ev.genre, ev.category, ev.eventType].filter(Boolean)),
          aiInsight: `🎫 Found on Ticketmaster — ${ev.artists.length > 0 ? ev.artists.join(', ') : ev.title}`,
        },
        update: {
          title: ev.title,
          description: ev.description,
          imageUrl: ev.imageUrl,
          startDate: new Date(ev.startDate),
          endDate: ev.endDate ? new Date(ev.endDate) : null,
          priceMin: ev.priceMin,
          priceMax: ev.priceMax,
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
      // Skip duplicates or validation errors
      console.error(`Failed to save TM event ${ev.title}:`, err)
    }
  }

  console.log(`✅ Ticketmaster: Synced ${created} events for ${cityName}`)
  return created
}

// ─── Types ───────────────────────────────────────────────────────────
interface TicketmasterEvent {
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
  endDate: string | null
  doorsOpen: string
  priceMin: number
  priceMax: number
  currency: string
  isFree: boolean
  isSoldOut: boolean
  artists: string[]
  genre: string
  hypeScore: number
  ticketUrl: string
  sourceUrl: string
  sourcePlatform: string
  discoveredBy: string
  isTrending: boolean
}
