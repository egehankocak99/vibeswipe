// ─── Foursquare Places API Integration ────────────────────────────────
// Free tier: 100k calls/month. Best for stable venues — bars, cafes,
// restaurants — with hours, tips (what to order), ratings, categories.
// Sign up: https://developer.foursquare.com/
// Docs: https://docs.foursquare.com/developer/reference/place-search

import { prisma } from './prisma'
import { NIGHTLIFE_CITIES } from './nightlife-data'

const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY || ''
const BASE_URL = 'https://api.foursquare.com/v3'

// ─── City coordinates ────────────────────────────────────────────────
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  'Barcelona': { lat: 41.3874, lng: 2.1686 },
  'Berlin': { lat: 52.5200, lng: 13.4050 },
  'Amsterdam': { lat: 52.3676, lng: 4.9041 },
  'London': { lat: 51.5074, lng: -0.1278 },
  'Paris': { lat: 48.8566, lng: 2.3522 },
  'Lisbon': { lat: 38.7223, lng: -9.1393 },
  'Prague': { lat: 50.0755, lng: 14.4378 },
  'Budapest': { lat: 47.4979, lng: 19.0402 },
  'Athens': { lat: 37.9838, lng: 23.7275 },
  'Milan': { lat: 45.4642, lng: 9.1900 },
  'Rome': { lat: 41.9028, lng: 12.4964 },
  'Copenhagen': { lat: 55.6761, lng: 12.5683 },
  'Istanbul': { lat: 41.0082, lng: 28.9784 },
  'Dublin': { lat: 53.3498, lng: -6.2603 },
  'New York': { lat: 40.7128, lng: -74.0060 },
  'Miami': { lat: 25.7617, lng: -80.1918 },
  'Los Angeles': { lat: 34.0522, lng: -118.2437 },
  'Tokyo': { lat: 35.6762, lng: 139.6503 },
  'Seoul': { lat: 37.5665, lng: 126.9780 },
  'Bangkok': { lat: 13.7563, lng: 100.5018 },
  'Dubai': { lat: 25.2048, lng: 55.2708 },
  'Melbourne': { lat: -37.8136, lng: 144.9631 },
  'Sydney': { lat: -33.8688, lng: 151.2093 },
  'Buenos Aires': { lat: -34.6037, lng: -58.3816 },
  'Mexico City': { lat: 19.4326, lng: -99.1332 },
  'Montreal': { lat: 45.5017, lng: -73.5673 },
  'Tel Aviv': { lat: 32.0853, lng: 34.7818 },
  'Cape Town': { lat: -33.9249, lng: 18.4241 },
  'Marrakech': { lat: 31.6295, lng: -7.9811 },
  'Belgrade': { lat: 44.7866, lng: 20.4489 },
  'São Paulo': { lat: -23.5505, lng: -46.6333 },
  'Medellín': { lat: 6.2476, lng: -75.5658 },
  'Bali': { lat: -8.3405, lng: 115.0920 },
}

// Foursquare category IDs for venues we care about
const VENUE_CATEGORIES = [
  '13003', // Bar
  '13065', // Night Club
  '13032', // Cocktail Bar
  '13035', // Dive Bar
  '13034', // Hotel Bar
  '13046', // Lounge
  '13033', // Beer Garden
  '13009', // Brewery
  '13002', // Bakery
  '13034', // Coffee Shop (using café)
  '13040', // Wine Bar
  '13063', // Pub
  '13064', // Speakeasy
  '13028', // Cafe
  '13036', // Gay Bar
  '13050', // Restaurant
  '13059', // Rooftop Bar
]

// ─── Map Foursquare categories to our venue types ────────────────────
function mapFSQCategory(categoryIds: number[]): string {
  for (const id of categoryIds) {
    const s = String(id)
    if (s.startsWith('13065') || s.startsWith('10032')) return 'club'
    if (s.startsWith('13059')) return 'rooftop'
    if (s.startsWith('13046')) return 'lounge'
    if (s.startsWith('13032')) return 'cocktail-bar'
    if (s.startsWith('13040')) return 'wine-bar'
    if (s.startsWith('13033')) return 'beer-garden'
    if (s.startsWith('13064')) return 'speakeasy'
    if (s.startsWith('13063')) return 'pub'
    if (s.startsWith('13035')) return 'dive-bar'
    if (s.startsWith('13028') || s.startsWith('13034')) return 'cafe'
    if (s.startsWith('13050')) return 'restaurant'
    if (s.startsWith('13003')) return 'bar'
  }
  return 'bar'
}

function mapPriceLevel(price: number | undefined): string {
  if (!price) return '$$'
  if (price === 1) return '$'
  if (price === 2) return '$$'
  if (price === 3) return '$$$'
  return '$$$$'
}

function formatHours(hoursData: any): Record<string, string> {
  const result: Record<string, string> = {}
  const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

  if (!hoursData?.regular) return result

  for (const period of hoursData.regular) {
    const dayIndex = period.day - 1 // FSQ: 1=Monday
    const dayName = dayNames[dayIndex] || 'unknown'
    const open = period.open || '?'
    const close = period.close || '?'
    result[dayName] = `${open}-${close}`
  }

  return result
}

function determineBestDays(hours: Record<string, string>, venueType: string): string[] {
  // Bars/clubs are best on weekends, cafes are good any day
  const weekendTypes = ['bar', 'club', 'lounge', 'rooftop', 'cocktail-bar', 'wine-bar', 'speakeasy', 'pub', 'beer-garden']
  if (weekendTypes.includes(venueType)) {
    return ['friday', 'saturday']
  }
  if (venueType === 'cafe') {
    return ['saturday', 'sunday'] // brunch vibes
  }
  return ['friday', 'saturday']
}

// ─── Fetch venues from Foursquare ────────────────────────────────────
export async function fetchFoursquareVenues(cityName: string): Promise<FoursquareVenue[]> {
  if (!FOURSQUARE_API_KEY) {
    console.log(`⚠️  No FOURSQUARE_API_KEY — skipping Foursquare for ${cityName}`)
    return []
  }

  const coords = CITY_COORDS[cityName]
  if (!coords) {
    console.log(`⚠️  ${cityName} not mapped for Foursquare`)
    return []
  }

  try {
    const allVenues: FoursquareVenue[] = []

    // Search for multiple venue types
    const searches = [
      { categories: '13003,13065,13032,13046,13059,13063,13064', label: 'bars & clubs' },
      { categories: '13028,13002', label: 'cafes' },
      { categories: '13050,13040,13033', label: 'restaurants & wine bars' },
    ]

    for (const search of searches) {
      const params = new URLSearchParams({
        ll: `${coords.lat},${coords.lng}`,
        radius: '5000',
        categories: search.categories,
        sort: 'RELEVANCE',
        limit: '20',
        fields: 'fsq_id,name,categories,location,rating,price,hours,tips,photos,description,tel,website,social_media,popularity,stats',
      })

      const response = await fetch(`${BASE_URL}/places/search?${params}`, {
        headers: {
          'Authorization': FOURSQUARE_API_KEY,
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        console.error(`Foursquare API error for ${cityName} (${search.label}): ${response.status}`)
        continue
      }

      const data = await response.json()
      const places = data.results || []

      for (const place of places) {
        const categoryIds = place.categories?.map((c: any) => c.id) || []
        const venueType = mapFSQCategory(categoryIds)
        const categoryNames = place.categories?.map((c: any) => c.short_name || c.name) || []

        // Get tips (what to order, recommendations)
        const tips = place.tips?.map((t: any) => t.text).filter(Boolean).slice(0, 5) || []

        // Extract "must try" items from tips
        const mustTryItems = extractMustTryItems(tips, categoryNames)

        // Format opening hours
        const openingHours = formatHours(place.hours)
        const bestDays = determineBestDays(openingHours, venueType)

        // Build image URL from photos
        const photos = place.photos || []
        const imageUrl = photos.length > 0
          ? `${photos[0].prefix}original${photos[0].suffix}`
          : ''

        const venue: FoursquareVenue = {
          externalId: place.fsq_id,
          name: place.name,
          venueType,
          neighborhood: place.location?.neighborhood || place.location?.locality || '',
          city: cityName,
          country: NIGHTLIFE_CITIES.find(c => c.city === cityName)?.country || '',
          address: [place.location?.address, place.location?.locality].filter(Boolean).join(', '),
          latitude: place.location?.lat || coords.lat,
          longitude: place.location?.lng || coords.lng,
          description: place.description || `${place.name} — ${categoryNames.join(', ')} in ${cityName}`,
          imageUrl,
          rating: place.rating ? place.rating / 2 : 0, // FSQ rates 0-10, we use 0-5
          priceLevel: mapPriceLevel(place.price),
          openingHours,
          bestDaysToVisit: bestDays,
          mustTryItems,
          specialties: categoryNames.join(', '),
          tips,
          cuisine: categoryNames[0] || '',
          phoneNumber: place.tel || '',
          websiteUrl: place.website || '',
          instagramHandle: place.social_media?.instagram || '',
          tags: [...categoryNames, venueType, ...bestDays.map(d => `best-on-${d}`)],
          vibeScore: Math.min(100, Math.round((place.rating || 5) * 10 + Math.random() * 20)),
          popularity: place.popularity || 0,
        }

        allVenues.push(venue)
      }

      // Rate limit: small delay between searches
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    console.log(`📍 Foursquare: Found ${allVenues.length} venues in ${cityName}`)
    return allVenues
  } catch (error) {
    console.error(`Foursquare fetch error for ${cityName}:`, error)
    return []
  }
}

// ─── Extract what to order/try from tips ─────────────────────────────
function extractMustTryItems(tips: string[], categories: string[]): string[] {
  const items: string[] = []
  const orderPatterns = [
    /try the (.+?)(?:\.|!|,|$)/i,
    /order the (.+?)(?:\.|!|,|$)/i,
    /must have (.+?)(?:\.|!|,|$)/i,
    /get the (.+?)(?:\.|!|,|$)/i,
    /best (.+?)(?:\.|!|,|in town|i've|$)/i,
    /recommend the (.+?)(?:\.|!|,|$)/i,
    /known for (?:its |their )?(.+?)(?:\.|!|,|$)/i,
    /famous for (?:its |their )?(.+?)(?:\.|!|,|$)/i,
  ]

  for (const tip of tips) {
    for (const pattern of orderPatterns) {
      const match = tip.match(pattern)
      if (match && match[1] && match[1].length < 50) {
        items.push(match[1].trim())
      }
    }
  }

  // Deduplicate
  return Array.from(new Set(items)).slice(0, 5)
}

// ─── Save Foursquare venues to database ──────────────────────────────
export async function syncFoursquareVenues(cityName: string): Promise<number> {
  const venues = await fetchFoursquareVenues(cityName)
  let created = 0

  for (const v of venues) {
    try {
      await prisma.venueCard.upsert({
        where: {
          id: `fsq_${v.externalId}`,
        },
        create: {
          id: `fsq_${v.externalId}`,
          name: v.name,
          venueType: v.venueType,
          neighborhood: v.neighborhood,
          city: v.city,
          country: v.country,
          address: v.address,
          latitude: v.latitude,
          longitude: v.longitude,
          description: v.description,
          imageUrl: v.imageUrl,
          rating: v.rating,
          priceLevel: v.priceLevel,
          vibeScore: v.vibeScore,
          openingHours: JSON.stringify(v.openingHours),
          bestDaysToVisit: JSON.stringify(v.bestDaysToVisit),
          mustTryItems: JSON.stringify(v.mustTryItems),
          specialties: v.specialties,
          tips: JSON.stringify(v.tips),
          cuisine: v.cuisine,
          phoneNumber: v.phoneNumber,
          websiteUrl: v.websiteUrl,
          instagramHandle: v.instagramHandle,
          externalId: v.externalId,
          sourceApi: 'foursquare',
          lastRefreshed: new Date(),
          dataFreshness: 'weekly',
          tags: JSON.stringify(v.tags),
          aiInsight: v.tips.length > 0
            ? `💡 Tip: "${v.tips[0].slice(0, 80)}${v.tips[0].length > 80 ? '...' : ''}"`
            : `📍 ${v.specialties} in ${v.neighborhood || v.city}`,
        },
        update: {
          rating: v.rating,
          priceLevel: v.priceLevel,
          vibeScore: v.vibeScore,
          openingHours: JSON.stringify(v.openingHours),
          bestDaysToVisit: JSON.stringify(v.bestDaysToVisit),
          mustTryItems: JSON.stringify(v.mustTryItems),
          tips: JSON.stringify(v.tips),
          lastRefreshed: new Date(),
        },
      })
      created++
    } catch (err) {
      console.error(`Failed to save FSQ venue ${v.name}:`, err)
    }
  }

  console.log(`✅ Foursquare: Synced ${created} venues for ${cityName}`)
  return created
}

// ─── Fetch venue details with tips ───────────────────────────────────
export async function fetchVenueDetails(fsqId: string): Promise<FoursquareVenue | null> {
  if (!FOURSQUARE_API_KEY) return null

  try {
    const response = await fetch(`${BASE_URL}/places/${fsqId}?fields=fsq_id,name,categories,location,rating,price,hours,tips,photos,description,tel,website,social_media`, {
      headers: {
        'Authorization': FOURSQUARE_API_KEY,
        'Accept': 'application/json',
      },
    })

    if (!response.ok) return null
    const place = await response.json()

    // Get tips
    const tipsResponse = await fetch(`${BASE_URL}/places/${fsqId}/tips?limit=10`, {
      headers: {
        'Authorization': FOURSQUARE_API_KEY,
        'Accept': 'application/json',
      },
    })

    let tips: string[] = []
    if (tipsResponse.ok) {
      const tipsData = await tipsResponse.json()
      tips = tipsData.map((t: any) => t.text).filter(Boolean)
    }

    const categoryIds = place.categories?.map((c: any) => c.id) || []
    const venueType = mapFSQCategory(categoryIds)
    const categoryNames = place.categories?.map((c: any) => c.short_name || c.name) || []
    const openingHours = formatHours(place.hours)
    const photos = place.photos || []

    return {
      externalId: place.fsq_id,
      name: place.name,
      venueType,
      neighborhood: place.location?.neighborhood || '',
      city: place.location?.locality || '',
      country: '',
      address: place.location?.formatted_address || '',
      latitude: place.location?.lat || 0,
      longitude: place.location?.lng || 0,
      description: place.description || `${place.name} — ${categoryNames.join(', ')}`,
      imageUrl: photos.length > 0 ? `${photos[0].prefix}original${photos[0].suffix}` : '',
      rating: place.rating ? place.rating / 2 : 0,
      priceLevel: mapPriceLevel(place.price),
      openingHours,
      bestDaysToVisit: determineBestDays(openingHours, venueType),
      mustTryItems: extractMustTryItems(tips, categoryNames),
      specialties: categoryNames.join(', '),
      tips,
      cuisine: categoryNames[0] || '',
      phoneNumber: place.tel || '',
      websiteUrl: place.website || '',
      instagramHandle: place.social_media?.instagram || '',
      tags: categoryNames,
      vibeScore: Math.min(100, Math.round((place.rating || 5) * 10)),
      popularity: 0,
    }
  } catch (error) {
    console.error(`Failed to fetch FSQ venue ${fsqId}:`, error)
    return null
  }
}

// ─── Types ───────────────────────────────────────────────────────────
interface FoursquareVenue {
  externalId: string
  name: string
  venueType: string
  neighborhood: string
  city: string
  country: string
  address: string
  latitude: number
  longitude: number
  description: string
  imageUrl: string
  rating: number
  priceLevel: string
  openingHours: Record<string, string>
  bestDaysToVisit: string[]
  mustTryItems: string[]
  specialties: string
  tips: string[]
  cuisine: string
  phoneNumber: string
  websiteUrl: string
  instagramHandle: string
  tags: string[]
  vibeScore: number
  popularity: number
}
