// ─── Event & Venue Scraper + AI Social Media Scout ───────────────────
// In production, this connects to our AI-operated IG & TikTok accounts
// that scan every European city for events. It also pulls from Resident
// Advisor, Eventbrite, DICE, Meetup, Songkick, Google Maps, Yelp, etc.
//
// The AI scout accounts (@vibeswipe.bcn, @vibeswipe.berlin, etc.)
// follow hundreds of venue pages, promoters, community groups, and
// local hashtags. They use GPT-4 Vision to analyze post images &
// captions, extracting event data automatically.
//
// Event types covered: concerts, DJ sets, festivals, but also language
// exchanges, cycling groups, yoga in the park, cooking classes, pub
// quizzes, art shows, food markets, open-air cinema, networking events,
// comedy nights, workshops — literally everything happening in a city.

import { getVenueImageUrl, getEventImageUrl, MUSIC_GENRES } from './nightlife-data'

interface ScrapedVenue {
  name: string
  venueType: string
  neighborhood: string
  city: string
  country: string
  description: string
  priceLevel: string
  rating: number
  reviewCount: number
  tags: string[]
  bestNights: string[]
  musicGenres: string[]
  hasOutdoor: boolean
  hasFood: boolean
  hasDanceFloor: boolean
  hasLiveMusic: boolean
  imageUrl: string
  popularTimes: Record<string, string>
  dressCode: string
  ageRange: string
  instagramHandle: string
  websiteUrl: string
}

interface ScrapedEvent {
  title: string
  eventType: string
  category: string // "nightlife" | "music" | "social" | "sports" | "wellness" | "food" | "arts" | "learning" | "outdoor" | "community"
  venueName: string
  neighborhood: string
  city: string
  country: string
  description: string
  startDate: Date
  endDate?: Date
  doorsOpen: string
  dayOfWeek: string
  isRecurring: boolean
  priceMin: number
  priceMax: number
  currency: string
  isFree: boolean
  artists: string[]        // performers, instructors, hosts
  organizer: string
  genre: string
  musicGenres: string[]
  tags: string[]
  imageUrl: string
  ticketUrl: string
  sourcePlatform: string   // "instagram_scout" | "tiktok_scout" | "resident_advisor" | "eventbrite" | "meetup" etc.
  discoveredBy: string     // "ai_scout" | "manual" | "partner"
  hypeScore: number
}

// ─── City-specific venue data ────────────────────────────────────────
const CITY_VENUES: Record<string, ScrapedVenue[]> = {
  'Barcelona': [
    {
      name: 'Paradiso',
      venueType: 'speakeasy',
      neighborhood: 'El Born',
      city: 'Barcelona',
      country: 'Spain',
      description: 'Hidden behind a pastrami shop, one of the world\'s best cocktail bars. Inventive drinks in a surreal, retro-futuristic space.',
      priceLevel: '$$$',
      rating: 4.7,
      reviewCount: 2840,
      tags: ['cocktail', 'speakeasy', 'date-night', 'world-class'],
      bestNights: ['thursday', 'friday', 'saturday'],
      musicGenres: ['jazz', 'soul', 'electronic'],
      hasOutdoor: false, hasFood: true, hasDanceFloor: false, hasLiveMusic: false,
      imageUrl: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80',
      popularTimes: { thursday: '21:00-02:00', friday: '22:00-03:00', saturday: '22:00-03:00' },
      dressCode: 'smart-casual', ageRange: '25-40',
      instagramHandle: '@paradiso_barcelona', websiteUrl: 'https://paradiso.cat',
    },
    {
      name: 'Razzmatazz',
      venueType: 'club',
      neighborhood: 'Poblenou',
      city: 'Barcelona',
      country: 'Spain',
      description: 'Legendary 5-room mega-club with everything from indie rock to techno. Each room is a different world.',
      priceLevel: '$$',
      rating: 4.2,
      reviewCount: 5120,
      tags: ['club', 'dance', 'live-music', 'late-night', 'group-friendly'],
      bestNights: ['friday', 'saturday'],
      musicGenres: ['techno', 'indie', 'rock', 'electronic', 'pop'],
      hasOutdoor: false, hasFood: false, hasDanceFloor: true, hasLiveMusic: true,
      imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80',
      popularTimes: { friday: '00:00-06:00', saturday: '00:00-06:00' },
      dressCode: 'casual', ageRange: '20-35',
      instagramHandle: '@raborazzmatazz', websiteUrl: 'https://razzmatazz.com',
    },
    {
      name: 'Bar Marsella',
      venueType: 'bar',
      neighborhood: 'El Raval',
      city: 'Barcelona',
      country: 'Spain',
      description: 'Barcelona\'s oldest bar since 1820. Famous for its absinthe and bohemian atmosphere. Hemingway used to drink here.',
      priceLevel: '$',
      rating: 4.4,
      reviewCount: 1890,
      tags: ['dive-bar', 'historic', 'chill', 'absinthe', 'bohemian'],
      bestNights: ['thursday', 'friday', 'saturday'],
      musicGenres: [],
      hasOutdoor: false, hasFood: false, hasDanceFloor: false, hasLiveMusic: false,
      imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
      popularTimes: { thursday: '22:00-02:00', friday: '22:00-03:00', saturday: '22:00-03:00' },
      dressCode: 'casual', ageRange: '21-45',
      instagramHandle: '', websiteUrl: '',
    },
    {
      name: 'Eclipse Bar',
      venueType: 'rooftop',
      neighborhood: 'Barceloneta',
      city: 'Barcelona',
      country: 'Spain',
      description: 'Sky-high cocktails on the 26th floor of W Hotel. Panoramic views of the Mediterranean and the city skyline.',
      priceLevel: '$$$$',
      rating: 4.3,
      reviewCount: 3200,
      tags: ['rooftop', 'cocktail', 'views', 'date-night', 'premium'],
      bestNights: ['thursday', 'friday', 'saturday'],
      musicGenres: ['house', 'electronic', 'lounge'],
      hasOutdoor: true, hasFood: true, hasDanceFloor: false, hasLiveMusic: false,
      imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80',
      popularTimes: { thursday: '20:00-01:00', friday: '21:00-02:00', saturday: '21:00-02:00' },
      dressCode: 'smart-casual', ageRange: '25-45',
      instagramHandle: '@eclipsebarcelona', websiteUrl: 'https://eclipsebarcelona.com',
    },
    {
      name: 'La Confitería',
      venueType: 'bar',
      neighborhood: 'Raval',
      city: 'Barcelona',
      country: 'Spain',
      description: 'Converted 19th-century candy shop turned cocktail bar. Original pastry cabinets now hold bottles. Pure magic.',
      priceLevel: '$$',
      rating: 4.5,
      reviewCount: 1420,
      tags: ['cocktail', 'historic', 'chill', 'date-night', 'unique'],
      bestNights: ['wednesday', 'thursday', 'friday'],
      musicGenres: ['jazz', 'soul'],
      hasOutdoor: false, hasFood: false, hasDanceFloor: false, hasLiveMusic: false,
      imageUrl: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&q=80',
      popularTimes: { wednesday: '20:00-01:00', thursday: '20:00-02:00', friday: '21:00-02:30' },
      dressCode: 'casual', ageRange: '25-40',
      instagramHandle: '@laconfiteria_bcn', websiteUrl: '',
    },
  ],
  'Berlin': [
    {
      name: 'Berghain',
      venueType: 'club',
      neighborhood: 'Friedrichshain',
      city: 'Berlin',
      country: 'Germany',
      description: 'The world\'s most legendary techno club in a former power plant. 36+ hour parties. No photos. Pure music.',
      priceLevel: '$$',
      rating: 4.8,
      reviewCount: 8200,
      tags: ['techno', 'underground', 'legendary', 'late-night', 'dance'],
      bestNights: ['friday', 'saturday', 'sunday'],
      musicGenres: ['techno', 'house', 'electronic'],
      hasOutdoor: true, hasFood: false, hasDanceFloor: true, hasLiveMusic: true,
      imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80',
      popularTimes: { saturday: '00:00-12:00', sunday: '00:00-18:00' },
      dressCode: 'black-only', ageRange: '21-50',
      instagramHandle: '', websiteUrl: 'https://berghain.berlin',
    },
    {
      name: 'Klunkerkranich',
      venueType: 'rooftop',
      neighborhood: 'Neukölln',
      city: 'Berlin',
      country: 'Germany',
      description: 'Rooftop bar on top of a parking garage with gardens, DJs, and the best sunset views in Berlin. Community-run magic.',
      priceLevel: '$',
      rating: 4.5,
      reviewCount: 3100,
      tags: ['rooftop', 'chill', 'sunset', 'group-friendly', 'alternative'],
      bestNights: ['thursday', 'friday', 'saturday'],
      musicGenres: ['electronic', 'world-music', 'indie'],
      hasOutdoor: true, hasFood: true, hasDanceFloor: false, hasLiveMusic: true,
      imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80',
      popularTimes: { thursday: '17:00-23:00', friday: '16:00-00:00', saturday: '14:00-00:00' },
      dressCode: 'casual', ageRange: '22-40',
      instagramHandle: '@klunkerkranich', websiteUrl: 'https://klunkerkranich.org',
    },
    {
      name: 'Monkey Bar',
      venueType: 'bar',
      neighborhood: 'Charlottenburg',
      city: 'Berlin',
      country: 'Germany',
      description: 'Stylish bar on the 10th floor overlooking Berlin Zoo. Creative cocktails with skyline views.',
      priceLevel: '$$$',
      rating: 4.3,
      reviewCount: 2400,
      tags: ['cocktail', 'rooftop', 'views', 'date-night', 'trendy'],
      bestNights: ['thursday', 'friday', 'saturday'],
      musicGenres: ['house', 'lounge'],
      hasOutdoor: true, hasFood: true, hasDanceFloor: false, hasLiveMusic: false,
      imageUrl: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80',
      popularTimes: { thursday: '19:00-01:00', friday: '19:00-02:00', saturday: '18:00-02:00' },
      dressCode: 'smart-casual', ageRange: '25-40',
      instagramHandle: '@monkeybarberlin', websiteUrl: 'https://monkeybarberlin.de',
    },
    {
      name: 'Salon zur Wilden Renate',
      venueType: 'club',
      neighborhood: 'Friedrichshain',
      city: 'Berlin',
      country: 'Germany',
      description: 'Labyrinthine club in a converted apartment building. Every room is different — bathtub bars, secret gardens, and more.',
      priceLevel: '$',
      rating: 4.4,
      reviewCount: 2900,
      tags: ['underground', 'alternative', 'dance', 'late-night', 'unique'],
      bestNights: ['friday', 'saturday'],
      musicGenres: ['techno', 'house', 'disco', 'electronic'],
      hasOutdoor: true, hasFood: false, hasDanceFloor: true, hasLiveMusic: false,
      imageUrl: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80',
      popularTimes: { friday: '00:00-08:00', saturday: '00:00-12:00' },
      dressCode: 'casual', ageRange: '21-35',
      instagramHandle: '@wilderenate', websiteUrl: 'https://renate.cc',
    },
  ],
  'Amsterdam': [
    {
      name: 'Shelter',
      venueType: 'club',
      neighborhood: 'Noord',
      city: 'Amsterdam',
      country: 'Netherlands',
      description: 'Underground bunker club beneath A\'DAM Tower. Raw concrete, massive sound system, no-nonsense techno.',
      priceLevel: '$$',
      rating: 4.5,
      reviewCount: 2100,
      tags: ['techno', 'underground', 'dance', 'late-night'],
      bestNights: ['friday', 'saturday'],
      musicGenres: ['techno', 'house', 'electronic'],
      hasOutdoor: false, hasFood: false, hasDanceFloor: true, hasLiveMusic: true,
      imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80',
      popularTimes: { friday: '23:00-07:00', saturday: '23:00-07:00' },
      dressCode: 'casual', ageRange: '21-35',
      instagramHandle: '@shelteramsterdam', websiteUrl: 'https://shelteramsterdam.nl',
    },
    {
      name: "Café 't Smalle",
      venueType: 'pub',
      neighborhood: 'Jordaan',
      city: 'Amsterdam',
      country: 'Netherlands',
      description: 'Historic brown café from 1786 on the Egelantiersgracht canal. Cozy, candlelit, and quintessentially Dutch.',
      priceLevel: '$$',
      rating: 4.6,
      reviewCount: 3400,
      tags: ['chill', 'historic', 'canal-side', 'cozy', 'date-night'],
      bestNights: ['thursday', 'friday', 'saturday'],
      musicGenres: [],
      hasOutdoor: true, hasFood: true, hasDanceFloor: false, hasLiveMusic: false,
      imageUrl: 'https://images.unsplash.com/photo-1555658636-6e4a36218be7?w=800&q=80',
      popularTimes: { thursday: '17:00-01:00', friday: '16:00-01:00', saturday: '14:00-01:00' },
      dressCode: 'casual', ageRange: '25-50',
      instagramHandle: '', websiteUrl: 'https://smalle.nl',
    },
    {
      name: 'A\'DAM Lookout Bar',
      venueType: 'rooftop',
      neighborhood: 'Noord',
      city: 'Amsterdam',
      country: 'Netherlands',
      description: 'Revolving rooftop bar on top of A\'DAM Tower. 360° views of Amsterdam, cocktails, and a giant swing over the edge.',
      priceLevel: '$$$',
      rating: 4.4,
      reviewCount: 4200,
      tags: ['rooftop', 'views', 'cocktail', 'iconic', 'group-friendly'],
      bestNights: ['friday', 'saturday'],
      musicGenres: ['house', 'electronic'],
      hasOutdoor: true, hasFood: true, hasDanceFloor: false, hasLiveMusic: false,
      imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80',
      popularTimes: { friday: '18:00-01:00', saturday: '16:00-01:00' },
      dressCode: 'smart-casual', ageRange: '22-40',
      instagramHandle: '@adamlookout', websiteUrl: 'https://adamlookout.com',
    },
    {
      name: 'Paradiso',
      venueType: 'club',
      neighborhood: 'Leidseplein',
      city: 'Amsterdam',
      country: 'Netherlands',
      description: 'Former church turned legendary music venue. Everyone from Nirvana to Disclosure has played here.',
      priceLevel: '$$',
      rating: 4.6,
      reviewCount: 5800,
      tags: ['live-music', 'concert', 'iconic', 'dance', 'late-night'],
      bestNights: ['thursday', 'friday', 'saturday'],
      musicGenres: ['indie', 'electronic', 'rock', 'pop', 'hip-hop'],
      hasOutdoor: false, hasFood: false, hasDanceFloor: true, hasLiveMusic: true,
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
      popularTimes: { thursday: '21:00-04:00', friday: '22:00-05:00', saturday: '22:00-05:00' },
      dressCode: 'casual', ageRange: '18-45',
      instagramHandle: '@paradisoamsterdam', websiteUrl: 'https://paradiso.nl',
    },
  ],
  'New York': [
    {
      name: 'Nowadays',
      venueType: 'club',
      neighborhood: 'Ridgewood',
      city: 'New York',
      country: 'United States',
      description: 'Indoor/outdoor club space with world-class sound. Think Berlin vibes in Queens. Proper techno and house.',
      priceLevel: '$$',
      rating: 4.6,
      reviewCount: 1800,
      tags: ['techno', 'house', 'outdoor', 'dance', 'underground'],
      bestNights: ['friday', 'saturday', 'sunday'],
      musicGenres: ['techno', 'house', 'electronic', 'disco'],
      hasOutdoor: true, hasFood: true, hasDanceFloor: true, hasLiveMusic: true,
      imageUrl: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80',
      popularTimes: { saturday: '22:00-06:00', sunday: '14:00-22:00' },
      dressCode: 'casual', ageRange: '21-40',
      instagramHandle: '@nowadays_nyc', websiteUrl: 'https://nowadays.nyc',
    },
    {
      name: 'Attaboy',
      venueType: 'speakeasy',
      neighborhood: 'Lower East Side',
      city: 'New York',
      country: 'United States',
      description: 'No-menu cocktail bar — tell the bartender what you like and they\'ll create something perfect. Intimate and legendary.',
      priceLevel: '$$$',
      rating: 4.7,
      reviewCount: 2300,
      tags: ['speakeasy', 'cocktail', 'date-night', 'world-class', 'intimate'],
      bestNights: ['thursday', 'friday', 'saturday'],
      musicGenres: ['jazz'],
      hasOutdoor: false, hasFood: false, hasDanceFloor: false, hasLiveMusic: false,
      imageUrl: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80',
      popularTimes: { thursday: '19:00-02:00', friday: '19:00-03:00', saturday: '19:00-03:00' },
      dressCode: 'smart-casual', ageRange: '25-45',
      instagramHandle: '@attaboy_nyc', websiteUrl: '',
    },
    {
      name: 'Rooftop at Pier 17',
      venueType: 'rooftop',
      neighborhood: 'Seaport',
      city: 'New York',
      country: 'United States',
      description: 'Open-air rooftop venue with Brooklyn Bridge views. Summer concerts, winter cocktails. NYC skyline at its finest.',
      priceLevel: '$$$',
      rating: 4.5,
      reviewCount: 3800,
      tags: ['rooftop', 'concert', 'views', 'live-music', 'premium'],
      bestNights: ['friday', 'saturday'],
      musicGenres: ['pop', 'indie', 'electronic'],
      hasOutdoor: true, hasFood: true, hasDanceFloor: false, hasLiveMusic: true,
      imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80',
      popularTimes: { friday: '18:00-00:00', saturday: '17:00-00:00' },
      dressCode: 'smart-casual', ageRange: '23-40',
      instagramHandle: '@pier17ny', websiteUrl: 'https://pier17ny.com',
    },
    {
      name: 'House of Yes',
      venueType: 'club',
      neighborhood: 'Bushwick',
      city: 'New York',
      country: 'United States',
      description: 'Wild, immersive nightlife with aerial performers, themed parties, and pure creative chaos. Brooklyn\'s best party.',
      priceLevel: '$$',
      rating: 4.5,
      reviewCount: 4100,
      tags: ['club', 'dance', 'immersive', 'themed-party', 'late-night', 'unique'],
      bestNights: ['friday', 'saturday'],
      musicGenres: ['house', 'disco', 'electronic', 'funk'],
      hasOutdoor: false, hasFood: false, hasDanceFloor: true, hasLiveMusic: true,
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
      popularTimes: { friday: '22:00-04:00', saturday: '22:00-04:00' },
      dressCode: 'costume-encouraged', ageRange: '21-38',
      instagramHandle: '@houseofyes', websiteUrl: 'https://houseofyes.org',
    },
  ],
  'Tokyo': [
    {
      name: 'Womb',
      venueType: 'club',
      neighborhood: 'Shibuya',
      city: 'Tokyo',
      country: 'Japan',
      description: 'Four floors of electronic music with one of Asia\'s best sound systems. A pilgrimage for techno lovers.',
      priceLevel: '$$',
      rating: 4.3,
      reviewCount: 2800,
      tags: ['techno', 'house', 'dance', 'late-night', 'legendary'],
      bestNights: ['friday', 'saturday'],
      musicGenres: ['techno', 'house', 'electronic'],
      hasOutdoor: false, hasFood: false, hasDanceFloor: true, hasLiveMusic: true,
      imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80',
      popularTimes: { friday: '23:00-05:00', saturday: '23:00-05:00' },
      dressCode: 'casual', ageRange: '21-40',
      instagramHandle: '@womb_tokyo', websiteUrl: 'https://womb.co.jp',
    },
    {
      name: 'Golden Gai',
      venueType: 'bar',
      neighborhood: 'Shinjuku',
      city: 'Tokyo',
      country: 'Japan',
      description: 'A maze of 200+ tiny bars, each seating 5-10 people. Every door is a new world. Tokyo\'s most iconic drinking district.',
      priceLevel: '$$',
      rating: 4.7,
      reviewCount: 6200,
      tags: ['dive-bar', 'unique', 'historic', 'chill', 'intimate'],
      bestNights: ['thursday', 'friday', 'saturday'],
      musicGenres: ['jazz', 'funk', 'rock'],
      hasOutdoor: false, hasFood: true, hasDanceFloor: false, hasLiveMusic: false,
      imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
      popularTimes: { thursday: '20:00-02:00', friday: '20:00-04:00', saturday: '19:00-04:00' },
      dressCode: 'casual', ageRange: '22-50',
      instagramHandle: '', websiteUrl: '',
    },
    {
      name: 'New York Bar (Park Hyatt)',
      venueType: 'lounge',
      neighborhood: 'Shinjuku',
      city: 'Tokyo',
      country: 'Japan',
      description: 'The "Lost in Translation" bar. Live jazz on the 52nd floor with panoramic Tokyo views. Timeless sophistication.',
      priceLevel: '$$$$',
      rating: 4.6,
      reviewCount: 4100,
      tags: ['jazz', 'views', 'cocktail', 'date-night', 'premium', 'iconic'],
      bestNights: ['thursday', 'friday', 'saturday'],
      musicGenres: ['jazz'],
      hasOutdoor: false, hasFood: true, hasDanceFloor: false, hasLiveMusic: true,
      imageUrl: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&q=80',
      popularTimes: { thursday: '17:00-00:00', friday: '17:00-01:00', saturday: '17:00-01:00' },
      dressCode: 'smart-casual', ageRange: '28-55',
      instagramHandle: '@parkhyatttokyo', websiteUrl: 'https://hyatt.com',
    },
  ],
  'London': [
    {
      name: 'Fabric',
      venueType: 'club',
      neighborhood: 'Farringdon',
      city: 'London',
      country: 'United Kingdom',
      description: 'Iconic superclub with a vibrating "bodysonic" dancefloor. Three rooms, world-class DJs, pure clubbing heritage.',
      priceLevel: '$$',
      rating: 4.5,
      reviewCount: 6800,
      tags: ['techno', 'drum-and-bass', 'dance', 'legendary', 'late-night'],
      bestNights: ['friday', 'saturday'],
      musicGenres: ['techno', 'drum-and-bass', 'house', 'electronic'],
      hasOutdoor: false, hasFood: false, hasDanceFloor: true, hasLiveMusic: true,
      imageUrl: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80',
      popularTimes: { friday: '23:00-07:00', saturday: '23:00-07:00' },
      dressCode: 'casual', ageRange: '19-40',
      instagramHandle: '@fabriclondon', websiteUrl: 'https://fabriclondon.com',
    },
    {
      name: 'Nightjar',
      venueType: 'speakeasy',
      neighborhood: 'Shoreditch',
      city: 'London',
      country: 'United Kingdom',
      description: 'Award-winning speakeasy with live jazz, theatrical cocktails, and 1920s glamour. Reservation essential.',
      priceLevel: '$$$',
      rating: 4.7,
      reviewCount: 2900,
      tags: ['speakeasy', 'cocktail', 'jazz', 'date-night', 'live-music'],
      bestNights: ['thursday', 'friday', 'saturday'],
      musicGenres: ['jazz', 'swing', 'blues'],
      hasOutdoor: false, hasFood: true, hasDanceFloor: false, hasLiveMusic: true,
      imageUrl: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80',
      popularTimes: { thursday: '18:00-01:00', friday: '18:00-02:00', saturday: '18:00-02:00' },
      dressCode: 'smart-casual', ageRange: '25-45',
      instagramHandle: '@nightjarbar', websiteUrl: 'https://barnightjar.com',
    },
    {
      name: 'Sky Garden',
      venueType: 'rooftop',
      neighborhood: 'City of London',
      city: 'London',
      country: 'United Kingdom',
      description: 'Lush gardens and bars at the top of the Walkie Talkie building. Free entry to the gardens, stunning 360° views.',
      priceLevel: '$$',
      rating: 4.4,
      reviewCount: 7200,
      tags: ['rooftop', 'views', 'cocktail', 'group-friendly', 'iconic'],
      bestNights: ['thursday', 'friday', 'saturday'],
      musicGenres: ['lounge'],
      hasOutdoor: true, hasFood: true, hasDanceFloor: false, hasLiveMusic: false,
      imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80',
      popularTimes: { thursday: '17:00-00:00', friday: '17:00-01:00', saturday: '16:00-01:00' },
      dressCode: 'smart-casual', ageRange: '22-45',
      instagramHandle: '@skygardenlondon', websiteUrl: 'https://skygarden.london',
    },
  ],
}

// ─── City-specific event data ────────────────────────────────────────
function generateCityEvents(city: string, country: string): ScrapedEvent[] {
  const now = new Date()
  const events: ScrapedEvent[] = []

  // ── All event types: nightlife, music, social, community, sports, wellness, food, arts, learning, outdoor ──
  const cityEvents: Record<string, Partial<ScrapedEvent>[]> = {
    'Barcelona': [
      // ─ Nightlife & Music ─
      { title: 'Sónar Festival Warm-Up', eventType: 'dj-set', category: 'nightlife', venueName: 'Razzmatazz', neighborhood: 'Poblenou', artists: ['Richie Hawtin', 'Nina Kraviz'], organizer: 'Sónar', genre: 'techno', musicGenres: ['techno', 'electronic'], priceMin: 25, priceMax: 40, hypeScore: 92, tags: ['techno', 'dance', 'international-dj', 'pre-festival'], sourcePlatform: 'Resident Advisor', discoveredBy: 'partner' },
      { title: 'Jazz in the Park', eventType: 'live-music', category: 'music', venueName: 'Parc de la Ciutadella', neighborhood: 'El Born', artists: ['Barcelona Jazz Quartet'], organizer: 'BCN Jazz', genre: 'jazz', musicGenres: ['jazz', 'soul'], priceMin: 0, priceMax: 0, isFree: true, hypeScore: 68, tags: ['jazz', 'outdoor', 'free', 'chill'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      { title: 'Flamenco & Wine Night', eventType: 'live-music', category: 'music', venueName: 'Tablao Cordobes', neighborhood: 'Las Ramblas', artists: ['Carmen de la Isla'], organizer: '', genre: 'world-music', musicGenres: ['world-music'], priceMin: 35, priceMax: 55, hypeScore: 75, tags: ['flamenco', 'cultural', 'wine', 'date-night'], sourcePlatform: 'Eventbrite', discoveredBy: 'partner' },
      { title: 'Reggaeton Rooftop', eventType: 'themed-party', category: 'nightlife', venueName: 'Eclipse Bar', neighborhood: 'Barceloneta', artists: ['DJ Fuego', 'MC Loca'], organizer: 'Eclipse Events', genre: 'reggaeton', musicGenres: ['reggaeton', 'latin', 'hip-hop'], priceMin: 15, priceMax: 25, hypeScore: 81, tags: ['reggaeton', 'rooftop', 'latin', 'dance'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      // ─ Language & Social ─
      { title: 'Intercambio: Spanish-English Language Exchange', eventType: 'language-exchange', category: 'social', venueName: 'Travel Bar', neighborhood: 'El Born', artists: [], organizer: 'Mundo Lingo Barcelona', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 74, tags: ['language-exchange', 'social', 'free', 'international', 'weekly'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      { title: 'Catalan-English Tandem Meetup', eventType: 'language-exchange', category: 'social', venueName: 'Federal Café', neighborhood: 'Sant Antoni', artists: [], organizer: 'BCN Tandem', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 58, tags: ['language-exchange', 'catalan', 'social', 'weekly'], sourcePlatform: 'Meetup', discoveredBy: 'ai_scout' },
      // ─ Sports & Outdoor ─
      { title: 'Sunrise Beach Yoga', eventType: 'yoga', category: 'wellness', venueName: 'Barceloneta Beach', neighborhood: 'Barceloneta', artists: ['Instructor: Marta S.'], organizer: 'BCN Yoga Community', genre: '', musicGenres: [], priceMin: 5, priceMax: 10, isRecurring: true, hypeScore: 72, tags: ['yoga', 'beach', 'sunrise', 'wellness', 'outdoor'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      { title: 'Cycling Tour: Montjuïc Loop', eventType: 'cycling', category: 'sports', venueName: 'Plaça Espanya', neighborhood: 'Montjuïc', artists: [], organizer: 'BCN Bike Rides', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 65, tags: ['cycling', 'outdoor', 'free', 'sport', 'scenic'], sourcePlatform: 'Meetup', discoveredBy: 'ai_scout' },
      { title: 'Beach Volleyball Pickup', eventType: 'sports-meetup', category: 'sports', venueName: 'Nova Icaria Beach', neighborhood: 'Vila Olímpica', artists: [], organizer: 'BCN Sports Social', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 60, tags: ['volleyball', 'beach', 'sport', 'social', 'free'], sourcePlatform: 'Meetup', discoveredBy: 'manual' },
      // ─ Food ─
      { title: 'Paella Cooking Class', eventType: 'cooking-class', category: 'food', venueName: 'Cook & Taste', neighborhood: 'La Rambla', artists: ['Chef David'], organizer: 'Cook & Taste BCN', genre: '', musicGenres: [], priceMin: 55, priceMax: 65, hypeScore: 78, tags: ['cooking-class', 'paella', 'spanish-cuisine', 'hands-on'], sourcePlatform: 'tiktok_scout', discoveredBy: 'ai_scout' },
      { title: 'Sunday Market: Mercat de Sant Antoni', eventType: 'food-market', category: 'food', venueName: 'Mercat de Sant Antoni', neighborhood: 'Sant Antoni', artists: [], organizer: 'Ajuntament de Barcelona', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 70, tags: ['food-market', 'vintage', 'antiques', 'free', 'sunday'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      // ─ Arts & Culture ─
      { title: 'Open-Air Cinema at Montjuïc', eventType: 'open-air-cinema', category: 'arts', venueName: 'Sala Montjuïc', neighborhood: 'Montjuïc', artists: [], organizer: 'Sala Montjuïc', genre: '', musicGenres: [], priceMin: 7, priceMax: 7, hypeScore: 80, tags: ['cinema', 'outdoor', 'summer', 'cultural', 'scenic'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      { title: 'Gallery Walk: El Raval Art Trail', eventType: 'art-show', category: 'arts', venueName: 'MACBA area', neighborhood: 'El Raval', artists: ['Various local artists'], organizer: 'BCN Art Walk', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, hypeScore: 55, tags: ['art', 'gallery', 'free', 'walking-tour', 'cultural'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      // ─ Community & Learning ─
      { title: 'Pub Quiz Night', eventType: 'pub-quiz', category: 'social', venueName: 'The George Payne', neighborhood: 'Plaça Urquinaona', artists: ['Quizmaster Dave'], organizer: 'BCN Pub Quiz', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 72, tags: ['pub-quiz', 'social', 'english', 'trivia', 'weekly'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      { title: 'Digital Nomad Networking', eventType: 'networking', category: 'community', venueName: 'MOB Coworking', neighborhood: 'Poblenou', artists: [], organizer: 'BCN Digital Nomads', genre: '', musicGenres: [], priceMin: 5, priceMax: 5, isRecurring: true, hypeScore: 66, tags: ['networking', 'digital-nomad', 'coworking', 'social', 'monthly'], sourcePlatform: 'Meetup', discoveredBy: 'ai_scout' },
      { title: 'Pottery Workshop', eventType: 'workshop', category: 'learning', venueName: 'Taller de Ceràmica', neighborhood: 'Gràcia', artists: ['Instructor: Ana M.'], organizer: 'Handmade BCN', genre: '', musicGenres: [], priceMin: 30, priceMax: 45, hypeScore: 62, tags: ['pottery', 'workshop', 'creative', 'hands-on'], sourcePlatform: 'tiktok_scout', discoveredBy: 'ai_scout' },
    ],
    'Berlin': [
      // ─ Nightlife & Music ─
      { title: 'Panorama Bar: Floating Points', eventType: 'dj-set', category: 'nightlife', venueName: 'Berghain', neighborhood: 'Friedrichshain', artists: ['Floating Points', 'Marcel Dettmann'], organizer: 'Berghain', genre: 'techno', musicGenres: ['techno', 'house', 'electronic'], priceMin: 18, priceMax: 18, hypeScore: 97, tags: ['techno', 'legendary', 'dance', 'berghain'], sourcePlatform: 'Resident Advisor', discoveredBy: 'partner' },
      { title: 'Open Air Hasenheide', eventType: 'dj-set', category: 'nightlife', venueName: 'Volkspark Hasenheide', neighborhood: 'Neukölln', artists: ['Various DJs'], organizer: 'Community', genre: 'house', musicGenres: ['house', 'disco', 'funk'], priceMin: 0, priceMax: 0, isFree: true, hypeScore: 72, tags: ['outdoor', 'free', 'house', 'chill', 'daytime'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      { title: 'Indie Night at Lido', eventType: 'concert', category: 'music', venueName: 'Lido', neighborhood: 'Kreuzberg', artists: ['Local Natives', 'support TBA'], organizer: 'Lido Berlin', genre: 'indie', musicGenres: ['indie', 'rock'], priceMin: 22, priceMax: 30, hypeScore: 78, tags: ['indie', 'concert', 'live-music'], sourcePlatform: 'Songkick', discoveredBy: 'partner' },
      // ─ Language & Social ─
      { title: 'Deutsch-English Stammtisch', eventType: 'language-exchange', category: 'social', venueName: 'Das Gift', neighborhood: 'Neukölln', artists: [], organizer: 'Sprachcafé Berlin', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 76, tags: ['language-exchange', 'german', 'english', 'social', 'weekly'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      { title: 'Multilingual Meetup @ Mauerpark', eventType: 'language-exchange', category: 'social', venueName: 'Mauerpark', neighborhood: 'Prenzlauer Berg', artists: [], organizer: 'Berlin Language Network', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 65, tags: ['language-exchange', 'multilingual', 'outdoor', 'free'], sourcePlatform: 'Meetup', discoveredBy: 'ai_scout' },
      // ─ Sports & Outdoor ─
      { title: 'Morning Run: Tiergarten Loop', eventType: 'running', category: 'sports', venueName: 'Tiergarten', neighborhood: 'Tiergarten', artists: [], organizer: 'Berlin Run Club', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 68, tags: ['running', 'outdoor', 'free', 'morning', 'fitness'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      { title: 'Cycling Tour: Berlin Wall Trail', eventType: 'cycling', category: 'sports', venueName: 'East Side Gallery', neighborhood: 'Friedrichshain', artists: [], organizer: 'BerlinBikeCity', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, hypeScore: 70, tags: ['cycling', 'history', 'outdoor', 'free', 'scenic'], sourcePlatform: 'Meetup', discoveredBy: 'ai_scout' },
      { title: 'Bouldering Social', eventType: 'sports-meetup', category: 'sports', venueName: 'Berta Block', neighborhood: 'Mitte', artists: [], organizer: 'Berlin Climbing Club', genre: '', musicGenres: [], priceMin: 12, priceMax: 15, isRecurring: true, hypeScore: 63, tags: ['climbing', 'bouldering', 'social', 'fitness', 'weekly'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      // ─ Wellness ─
      { title: 'Yoga in Görlitzer Park', eventType: 'yoga', category: 'wellness', venueName: 'Görlitzer Park', neighborhood: 'Kreuzberg', artists: ['Instructor: Lisa K.'], organizer: 'Yogis of Berlin', genre: '', musicGenres: [], priceMin: 0, priceMax: 8, isRecurring: true, hypeScore: 64, tags: ['yoga', 'park', 'outdoor', 'wellness', 'donation-based'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      // ─ Food ─
      { title: 'Vegan Cooking Workshop', eventType: 'cooking-class', category: 'food', venueName: 'Goldhahn und Sampson', neighborhood: 'Prenzlauer Berg', artists: ['Chef Thomas'], organizer: 'Goldhahn und Sampson', genre: '', musicGenres: [], priceMin: 45, priceMax: 55, hypeScore: 70, tags: ['cooking-class', 'vegan', 'hands-on', 'german-cuisine'], sourcePlatform: 'tiktok_scout', discoveredBy: 'ai_scout' },
      { title: 'Street Food Thursday', eventType: 'food-market', category: 'food', venueName: 'Markthalle Neun', neighborhood: 'Kreuzberg', artists: [], organizer: 'Markthalle Neun', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 82, tags: ['street-food', 'food-market', 'thursday', 'diverse-cuisines'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      // ─ Arts & Culture ─
      { title: 'Open-Air Cinema: Freiluftkino Kreuzberg', eventType: 'open-air-cinema', category: 'arts', venueName: 'Freiluftkino Kreuzberg', neighborhood: 'Kreuzberg', artists: [], organizer: 'Freiluftkino', genre: '', musicGenres: [], priceMin: 8, priceMax: 8, isRecurring: true, hypeScore: 75, tags: ['cinema', 'outdoor', 'summer', 'indie-films'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      { title: 'Flea Market at Mauerpark', eventType: 'market', category: 'community', venueName: 'Mauerpark', neighborhood: 'Prenzlauer Berg', artists: ['Karaoke host'], organizer: 'Mauerpark Flohmarkt', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 85, tags: ['flea-market', 'vintage', 'karaoke', 'sunday', 'outdoor'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      // ─ Community & Learning ─
      { title: 'Tech Meetup: Berlin.js', eventType: 'networking', category: 'learning', venueName: 'co.up Community Space', neighborhood: 'Kreuzberg', artists: [], organizer: 'Berlin.js', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 72, tags: ['tech', 'javascript', 'networking', 'free', 'monthly'], sourcePlatform: 'Meetup', discoveredBy: 'ai_scout' },
      { title: 'Pub Quiz: The English Nerd', eventType: 'pub-quiz', category: 'social', venueName: 'Bassy Club', neighborhood: 'Prenzlauer Berg', artists: ['Quizmaster Tom'], organizer: 'Berlin Pub Quiz', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 70, tags: ['pub-quiz', 'trivia', 'social', 'english', 'weekly'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
    ],
    'Amsterdam': [
      // ─ Nightlife & Music ─
      { title: 'Awakenings x Shelter', eventType: 'dj-set', category: 'nightlife', venueName: 'Shelter', neighborhood: 'Noord', artists: ['Amelie Lens', 'Reinier Zonneveld'], organizer: 'Awakenings', genre: 'techno', musicGenres: ['techno', 'electronic'], priceMin: 25, priceMax: 35, hypeScore: 94, tags: ['techno', 'underground', 'dance', 'awakenings'], sourcePlatform: 'Resident Advisor', discoveredBy: 'partner' },
      { title: 'Comedy Night at Boom Chicago', eventType: 'comedy', category: 'arts', venueName: 'Boom Chicago', neighborhood: 'Rozengracht', artists: ['Boom Chicago Ensemble'], organizer: 'Boom Chicago', genre: '', musicGenres: [], priceMin: 20, priceMax: 30, hypeScore: 70, tags: ['comedy', 'english-language', 'group-friendly'], sourcePlatform: 'Eventbrite', discoveredBy: 'partner' },
      { title: 'Paradiso presents: Disclosure', eventType: 'concert', category: 'music', venueName: 'Paradiso', neighborhood: 'Leidseplein', artists: ['Disclosure'], organizer: 'Paradiso', genre: 'house', musicGenres: ['house', 'electronic', 'uk-garage'], priceMin: 35, priceMax: 45, hypeScore: 90, tags: ['house', 'concert', 'iconic-venue', 'dance'], sourcePlatform: 'DICE', discoveredBy: 'partner' },
      // ─ Language & Social ─
      { title: 'Dutch-English Language Café', eventType: 'language-exchange', category: 'social', venueName: 'Café de Jaren', neighborhood: 'Centrum', artists: [], organizer: 'Amsterdam Polyglots', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 72, tags: ['language-exchange', 'dutch', 'english', 'social', 'weekly'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      // ─ Sports ─
      { title: 'Vondelpark Run Club', eventType: 'running', category: 'sports', venueName: 'Vondelpark', neighborhood: 'Oud-Zuid', artists: [], organizer: 'AMS Run Club', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 67, tags: ['running', 'park', 'free', 'morning', 'social'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      { title: 'Canal Kayaking Tour', eventType: 'outdoor-adventure', category: 'outdoor', venueName: 'Keizersgracht Canal', neighborhood: 'Jordaan', artists: [], organizer: 'Wetlands Safari', genre: '', musicGenres: [], priceMin: 25, priceMax: 35, hypeScore: 74, tags: ['kayaking', 'canal', 'outdoor', 'sightseeing', 'adventure'], sourcePlatform: 'tiktok_scout', discoveredBy: 'ai_scout' },
      // ─ Food ─  
      { title: 'Dutch Cheese & Beer Tasting', eventType: 'food-tasting', category: 'food', venueName: 'Reypenaer Cheese Tasting Room', neighborhood: 'Centrum', artists: ['Host: Jan'], organizer: 'Reypenaer', genre: '', musicGenres: [], priceMin: 20, priceMax: 25, hypeScore: 71, tags: ['cheese', 'beer', 'tasting', 'dutch-culture', 'experience'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      { title: 'Albert Cuyp Night Market', eventType: 'food-market', category: 'food', venueName: 'Albert Cuypmarkt', neighborhood: 'De Pijp', artists: [], organizer: 'De Pijp Market', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 76, tags: ['food-market', 'street-food', 'dutch', 'night-market'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      // ─ Arts ─
      { title: 'Open Studio Night: NDSM Wharf', eventType: 'art-show', category: 'arts', venueName: 'NDSM Wharf', neighborhood: 'Noord', artists: ['Various artists'], organizer: 'NDSM Artists', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, hypeScore: 68, tags: ['art', 'studio-tour', 'industrial', 'free', 'creative'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      // ─ Community ─
      { title: 'Board Games Night', eventType: 'social-gathering', category: 'social', venueName: 'TonTon Club', neighborhood: 'Centrum', artists: [], organizer: 'TonTon Club', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 64, tags: ['board-games', 'social', 'arcade', 'casual', 'weekly'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      { title: 'Pub Quiz: Coco\'s Outback', eventType: 'pub-quiz', category: 'social', venueName: 'Coco\'s Outback', neighborhood: 'Leidseplein', artists: ['Quizmaster Lisa'], organizer: 'AMS Quiz Night', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 69, tags: ['pub-quiz', 'english', 'trivia', 'social', 'weekly'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      // ─ Learning ─
      { title: 'Life Drawing Workshop', eventType: 'workshop', category: 'learning', venueName: 'OSCAM', neighborhood: 'Zuidoost', artists: ['Instructor: Eva'], organizer: 'AMS Drawing Circle', genre: '', musicGenres: [], priceMin: 15, priceMax: 20, isRecurring: true, hypeScore: 58, tags: ['art', 'life-drawing', 'workshop', 'creative', 'biweekly'], sourcePlatform: 'tiktok_scout', discoveredBy: 'ai_scout' },
    ],
    'London': [
      // ─ Nightlife & Music ─
      { title: 'Fabriclive: Chase & Status', eventType: 'dj-set', category: 'nightlife', venueName: 'Fabric', neighborhood: 'Farringdon', artists: ['Chase & Status', 'Hybrid Minds'], organizer: 'Fabric', genre: 'drum-and-bass', musicGenres: ['drum-and-bass', 'electronic'], priceMin: 20, priceMax: 30, hypeScore: 93, tags: ['drum-and-bass', 'dance', 'legendary-venue', 'late-night'], sourcePlatform: 'DICE', discoveredBy: 'partner' },
      { title: 'Secret Jazz Club', eventType: 'live-music', category: 'music', venueName: 'Nightjar', neighborhood: 'Shoreditch', artists: ['The London Jazz Collective'], organizer: 'Nightjar', genre: 'jazz', musicGenres: ['jazz', 'swing', 'blues'], priceMin: 15, priceMax: 25, hypeScore: 74, tags: ['jazz', 'speakeasy', 'date-night', 'intimate'], sourcePlatform: 'Time Out', discoveredBy: 'manual' },
      { title: 'Printworks presents: Four Tet', eventType: 'concert', category: 'music', venueName: 'Printworks', neighborhood: 'Canada Water', artists: ['Four Tet', 'Floating Points'], organizer: 'Printworks London', genre: 'electronic', musicGenres: ['electronic', 'house', 'ambient'], priceMin: 35, priceMax: 50, hypeScore: 96, tags: ['electronic', 'iconic-venue', 'visual-show', 'dance'], sourcePlatform: 'DICE', discoveredBy: 'partner' },
      // ─ Language & Social ─
      { title: 'Mundo Lingo Language Exchange', eventType: 'language-exchange', category: 'social', venueName: 'The Dolphin', neighborhood: 'Hackney', artists: [], organizer: 'Mundo Lingo London', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 80, tags: ['language-exchange', 'multilingual', 'social', 'weekly', 'international'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      { title: 'Pub Quiz: The Lamb', eventType: 'pub-quiz', category: 'social', venueName: 'The Lamb', neighborhood: 'Angel', artists: ['Quizmaster Paul'], organizer: 'London Quiz League', genre: '', musicGenres: [], priceMin: 2, priceMax: 2, isRecurring: true, hypeScore: 73, tags: ['pub-quiz', 'trivia', 'beer', 'social', 'weekly'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      // ─ Sports ─
      { title: 'Parkrun: Hyde Park', eventType: 'running', category: 'sports', venueName: 'Hyde Park', neighborhood: 'Westminster', artists: [], organizer: 'Parkrun UK', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 75, tags: ['running', '5k', 'free', 'saturday', 'community'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      { title: 'Cycling Social: Regent\'s Canal', eventType: 'cycling', category: 'sports', venueName: 'Regent\'s Canal', neighborhood: 'Camden', artists: [], organizer: 'London Cycle Social', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 62, tags: ['cycling', 'canal', 'scenic', 'social', 'free'], sourcePlatform: 'Meetup', discoveredBy: 'ai_scout' },
      // ─ Wellness ─
      { title: 'Sound Bath Meditation', eventType: 'wellness-class', category: 'wellness', venueName: 'Re:Centre', neighborhood: 'Hammersmith', artists: ['Facilitator: Sarah'], organizer: 'Re:Centre London', genre: '', musicGenres: [], priceMin: 25, priceMax: 30, hypeScore: 60, tags: ['meditation', 'sound-bath', 'wellness', 'relaxation'], sourcePlatform: 'tiktok_scout', discoveredBy: 'ai_scout' },
      // ─ Food ─
      { title: 'Maltby Street Market', eventType: 'food-market', category: 'food', venueName: 'Maltby Street Market', neighborhood: 'Bermondsey', artists: [], organizer: 'Maltby Street', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 80, tags: ['food-market', 'artisan', 'saturday', 'brunch', 'local'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      { title: 'Thai Cooking Masterclass', eventType: 'cooking-class', category: 'food', venueName: 'School of Wok', neighborhood: 'Covent Garden', artists: ['Chef Jeremy'], organizer: 'School of Wok', genre: '', musicGenres: [], priceMin: 60, priceMax: 80, hypeScore: 72, tags: ['cooking-class', 'thai', 'hands-on', 'date-night'], sourcePlatform: 'tiktok_scout', discoveredBy: 'ai_scout' },
      // ─ Arts ─
      { title: 'Late at Tate Modern', eventType: 'art-show', category: 'arts', venueName: 'Tate Modern', neighborhood: 'Bankside', artists: ['Various'], organizer: 'Tate', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, hypeScore: 78, tags: ['art', 'gallery', 'free', 'evening', 'drinks'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      { title: 'Open-Air Cinema: Rooftop Film Club', eventType: 'open-air-cinema', category: 'arts', venueName: 'Bussey Building Rooftop', neighborhood: 'Peckham', artists: [], organizer: 'Rooftop Film Club', genre: '', musicGenres: [], priceMin: 15, priceMax: 20, hypeScore: 76, tags: ['cinema', 'rooftop', 'summer', 'blankets', 'sunset'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      // ─ Learning ─
      { title: 'Photography Walk: Shoreditch', eventType: 'workshop', category: 'learning', venueName: 'Shoreditch area', neighborhood: 'Shoreditch', artists: ['Instructor: Mark P.'], organizer: 'London Photo Walks', genre: '', musicGenres: [], priceMin: 15, priceMax: 25, hypeScore: 60, tags: ['photography', 'street-art', 'walking', 'creative', 'learning'], sourcePlatform: 'tiktok_scout', discoveredBy: 'ai_scout' },
    ],
    'Paris': [
      // ─ Nightlife & Music ─
      { title: 'Rex Club: Laurent Garnier', eventType: 'dj-set', category: 'nightlife', venueName: 'Rex Club', neighborhood: '2ème', artists: ['Laurent Garnier'], organizer: 'Rex Club', genre: 'techno', musicGenres: ['techno', 'house'], priceMin: 15, priceMax: 20, hypeScore: 90, tags: ['techno', 'legendary', 'french-touch', 'dance'], sourcePlatform: 'Resident Advisor', discoveredBy: 'partner' },
      { title: 'Jazz Night at Le Caveau de la Huchette', eventType: 'live-music', category: 'music', venueName: 'Le Caveau de la Huchette', neighborhood: '5ème', artists: ['Le Caveau House Band'], organizer: '', genre: 'jazz', musicGenres: ['jazz', 'swing'], priceMin: 13, priceMax: 15, hypeScore: 78, tags: ['jazz', 'swing', 'dance', 'historic-venue', 'intimate'], sourcePlatform: 'Time Out', discoveredBy: 'manual' },
      // ─ Language & Social ─
      { title: 'Français-English Apéro Exchange', eventType: 'language-exchange', category: 'social', venueName: 'Café Oz', neighborhood: 'Châtelet', artists: [], organizer: 'Polyglot Paris', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 79, tags: ['language-exchange', 'french', 'english', 'apéro', 'weekly'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      // ─ Sports ─
      { title: 'Running along the Seine', eventType: 'running', category: 'sports', venueName: 'Quai de la Seine', neighborhood: '7ème', artists: [], organizer: 'Paris Run Crew', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 72, tags: ['running', 'seine', 'scenic', 'morning', 'free'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      // ─ Food ─
      { title: 'French Pastry Workshop', eventType: 'cooking-class', category: 'food', venueName: 'Le Foodist', neighborhood: '6ème', artists: ['Chef Pierre'], organizer: 'Le Foodist', genre: '', musicGenres: [], priceMin: 95, priceMax: 120, hypeScore: 82, tags: ['pastry', 'baking', 'french-cuisine', 'croissants', 'hands-on'], sourcePlatform: 'tiktok_scout', discoveredBy: 'ai_scout' },
      { title: 'Marché d\'Aligre', eventType: 'food-market', category: 'food', venueName: 'Place d\'Aligre', neighborhood: '12ème', artists: [], organizer: 'Mairie de Paris', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 74, tags: ['food-market', 'organic', 'local', 'morning', 'french'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      // ─ Arts ─
      { title: 'Open-Air Cinema: La Villette', eventType: 'open-air-cinema', category: 'arts', venueName: 'Parc de la Villette', neighborhood: '19ème', artists: [], organizer: 'La Villette', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 80, tags: ['cinema', 'outdoor', 'free', 'summer', 'blankets'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      { title: 'Montmartre Art Walk', eventType: 'art-show', category: 'arts', venueName: 'Place du Tertre', neighborhood: 'Montmartre', artists: ['Various local artists'], organizer: 'Montmartre Artists', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, hypeScore: 65, tags: ['art', 'walking-tour', 'painting', 'portrait', 'historic'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      // ─ Wellness ─
      { title: 'Yoga at Jardin du Luxembourg', eventType: 'yoga', category: 'wellness', venueName: 'Jardin du Luxembourg', neighborhood: '6ème', artists: ['Instructor: Claire'], organizer: 'Paris Yoga Collective', genre: '', musicGenres: [], priceMin: 0, priceMax: 10, isRecurring: true, hypeScore: 70, tags: ['yoga', 'park', 'outdoor', 'morning', 'donation-based'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      // ─ Community ─
      { title: 'Philosophical Café Debate', eventType: 'social-gathering', category: 'community', venueName: 'Café de Flore', neighborhood: 'Saint-Germain', artists: [], organizer: 'Café Philo Paris', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 62, tags: ['philosophy', 'debate', 'intellectual', 'french', 'monthly'], sourcePlatform: 'Meetup', discoveredBy: 'ai_scout' },
    ],
    'Lisbon': [
      // ─ Nightlife & Music ─
      { title: 'Fado Night: A Baiuca', eventType: 'live-music', category: 'music', venueName: 'A Baiuca', neighborhood: 'Alfama', artists: ['Casa artists'], organizer: 'A Baiuca', genre: 'fado', musicGenres: ['fado', 'world-music'], priceMin: 0, priceMax: 0, isFree: true, hypeScore: 82, tags: ['fado', 'traditional', 'intimate', 'portuguese', 'dinner'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      { title: 'Lux Frágil: DJ Harvey', eventType: 'dj-set', category: 'nightlife', venueName: 'Lux Frágil', neighborhood: 'Santa Apolónia', artists: ['DJ Harvey'], organizer: 'Lux Frágil', genre: 'house', musicGenres: ['house', 'disco', 'eclectic'], priceMin: 15, priceMax: 20, hypeScore: 91, tags: ['house', 'legendary-venue', 'riverside', 'dance'], sourcePlatform: 'Resident Advisor', discoveredBy: 'partner' },
      // ─ Social ─
      { title: 'Portuguese-English Language Exchange', eventType: 'language-exchange', category: 'social', venueName: 'Café A Brasileira', neighborhood: 'Chiado', artists: [], organizer: 'Lisbon Polyglots', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 75, tags: ['language-exchange', 'portuguese', 'english', 'social', 'weekly'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      // ─ Sports ─
      { title: 'Surf Lesson: Costa da Caparica', eventType: 'outdoor-adventure', category: 'sports', venueName: 'Costa da Caparica Beach', neighborhood: 'Caparica', artists: [], organizer: 'Lisbon Surf Camp', genre: '', musicGenres: [], priceMin: 30, priceMax: 45, hypeScore: 78, tags: ['surfing', 'beach', 'outdoor', 'beginner-friendly', 'adventure'], sourcePlatform: 'tiktok_scout', discoveredBy: 'ai_scout' },
      // ─ Food ─
      { title: 'Pastel de Nata Baking Class', eventType: 'cooking-class', category: 'food', venueName: 'Lisbon Cooking Academy', neighborhood: 'Chiado', artists: ['Chef Mariana'], organizer: 'Lisbon Cooking Academy', genre: '', musicGenres: [], priceMin: 40, priceMax: 55, hypeScore: 80, tags: ['pastry', 'baking', 'portuguese', 'hands-on', 'pastel-de-nata'], sourcePlatform: 'tiktok_scout', discoveredBy: 'ai_scout' },
      { title: 'Feira da Ladra Flea Market', eventType: 'market', category: 'community', venueName: 'Campo de Santa Clara', neighborhood: 'Alfama', artists: [], organizer: '', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 72, tags: ['flea-market', 'vintage', 'antiques', 'outdoor', 'saturday'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      // ─ Outdoor ─
      { title: 'Sunset Yoga at Miradouro', eventType: 'yoga', category: 'wellness', venueName: 'Miradouro da Graça', neighborhood: 'Graça', artists: ['Instructor: Sofia'], organizer: 'Yoga Lisboa', genre: '', musicGenres: [], priceMin: 0, priceMax: 8, isRecurring: true, hypeScore: 74, tags: ['yoga', 'sunset', 'viewpoint', 'outdoor', 'donation-based'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
    ],
    'Prague': [
      // ─ Nightlife ─
      { title: 'Cross Club: Techno Night', eventType: 'dj-set', category: 'nightlife', venueName: 'Cross Club', neighborhood: 'Holešovice', artists: ['Local DJs'], organizer: 'Cross Club', genre: 'techno', musicGenres: ['techno', 'industrial'], priceMin: 5, priceMax: 10, hypeScore: 82, tags: ['techno', 'industrial-art', 'underground', 'steampunk'], sourcePlatform: 'Resident Advisor', discoveredBy: 'partner' },
      // ─ Social ─
      { title: 'Czech-English Language Exchange', eventType: 'language-exchange', category: 'social', venueName: 'Café Jedna', neighborhood: 'Smíchov', artists: [], organizer: 'Prague Language Café', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 70, tags: ['language-exchange', 'czech', 'english', 'social', 'weekly'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      { title: 'Pub Quiz: The PUB', eventType: 'pub-quiz', category: 'social', venueName: 'The PUB', neighborhood: 'Old Town', artists: [], organizer: 'Prague Quiz Night', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 68, tags: ['pub-quiz', 'trivia', 'self-serve-beer', 'social', 'weekly'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      // ─ Food ─
      { title: 'Czech Cooking Class: Svíčková & Knedlíky', eventType: 'cooking-class', category: 'food', venueName: 'Chefparade', neighborhood: 'Vinohrady', artists: ['Chef Karel'], organizer: 'Chefparade', genre: '', musicGenres: [], priceMin: 50, priceMax: 60, hypeScore: 72, tags: ['cooking-class', 'czech-cuisine', 'hands-on', 'traditional'], sourcePlatform: 'tiktok_scout', discoveredBy: 'ai_scout' },
      { title: 'Náplavka Farmers Market', eventType: 'food-market', category: 'food', venueName: 'Náplavka', neighborhood: 'Nové Město', artists: [], organizer: '', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 78, tags: ['food-market', 'riverside', 'artisan', 'saturday', 'local'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      // ─ Sports ─
      { title: 'Cycling: Vltava River Trail', eventType: 'cycling', category: 'sports', venueName: 'Vltava Riverside', neighborhood: 'Smíchov', artists: [], organizer: 'Prague Bike Club', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 64, tags: ['cycling', 'river', 'scenic', 'free', 'outdoor'], sourcePlatform: 'Meetup', discoveredBy: 'ai_scout' },
      // ─ Arts ─
      { title: 'DOX Contemporary Art Gallery Opening', eventType: 'art-show', category: 'arts', venueName: 'DOX Centre', neighborhood: 'Holešovice', artists: ['Various'], organizer: 'DOX Centre', genre: '', musicGenres: [], priceMin: 0, priceMax: 10, hypeScore: 66, tags: ['art', 'contemporary', 'gallery-opening', 'free-opening-night'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
    ],
    'Budapest': [
      // ─ Nightlife ─
      { title: 'Szimpla Kert: Sound Garden', eventType: 'live-music', category: 'nightlife', venueName: 'Szimpla Kert', neighborhood: 'Jewish Quarter', artists: ['Various'], organizer: 'Szimpla Kert', genre: 'eclectic', musicGenres: ['indie', 'world-music', 'electronic'], priceMin: 0, priceMax: 5, hypeScore: 88, tags: ['ruin-bar', 'live-music', 'eclectic', 'iconic'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      { title: 'Akvárium Klub: Electronic Night', eventType: 'dj-set', category: 'nightlife', venueName: 'Akvárium Klub', neighborhood: 'Deák tér', artists: ['Local DJs'], organizer: 'Akvárium', genre: 'electronic', musicGenres: ['electronic', 'house'], priceMin: 8, priceMax: 15, hypeScore: 78, tags: ['electronic', 'underground', 'pool-venue', 'dance'], sourcePlatform: 'Resident Advisor', discoveredBy: 'partner' },
      // ─ Social ─
      { title: 'Hungarian-English Tandem', eventType: 'language-exchange', category: 'social', venueName: 'Csendes Vintage Bar', neighborhood: 'Jewish Quarter', artists: [], organizer: 'Budapest Language Exchange', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 72, tags: ['language-exchange', 'hungarian', 'english', 'ruin-bar', 'weekly'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      // ─ Wellness ─
      { title: 'Bath Party: Széchenyi Spartacus', eventType: 'themed-party', category: 'wellness', venueName: 'Széchenyi Thermal Bath', neighborhood: 'City Park', artists: ['DJs'], organizer: 'Sparty', genre: 'electronic', musicGenres: ['electronic', 'house'], priceMin: 40, priceMax: 60, hypeScore: 84, tags: ['thermal-bath', 'party', 'unique', 'iconic', 'night-swim'], sourcePlatform: 'tiktok_scout', discoveredBy: 'ai_scout' },
      // ─ Food ─
      { title: 'Hungarian Goulash Cooking Class', eventType: 'cooking-class', category: 'food', venueName: 'Chefparade Budapest', neighborhood: 'District V', artists: ['Chef Zsolt'], organizer: 'Chefparade', genre: '', musicGenres: [], priceMin: 45, priceMax: 55, hypeScore: 74, tags: ['cooking-class', 'goulash', 'hungarian', 'hands-on', 'traditional'], sourcePlatform: 'tiktok_scout', discoveredBy: 'ai_scout' },
      { title: 'Hold Utca Market Hall', eventType: 'food-market', category: 'food', venueName: 'Hold Utca', neighborhood: 'District V', artists: [], organizer: '', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 70, tags: ['food-market', 'local', 'artisan', 'saturday'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      // ─ Sports ─
      { title: 'Danube Cycling Tour', eventType: 'cycling', category: 'sports', venueName: 'Margaret Island', neighborhood: 'Margaret Island', artists: [], organizer: 'Budapest Bike Club', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 68, tags: ['cycling', 'danube', 'scenic', 'free', 'sunday'], sourcePlatform: 'Meetup', discoveredBy: 'ai_scout' },
      // ─ Arts ─
      { title: 'Ruin Bar Gallery Tour', eventType: 'art-show', category: 'arts', venueName: 'Jewish Quarter', neighborhood: 'Jewish Quarter', artists: [], organizer: 'Budapest Art Walk', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, hypeScore: 64, tags: ['art', 'ruin-bars', 'walking-tour', 'street-art', 'free'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
    ],
    'New York': [
      // ─ Nightlife & Music ─
      { title: 'Keinemusik NYC Takeover', eventType: 'dj-set', category: 'nightlife', venueName: 'Nowadays', neighborhood: 'Ridgewood', artists: ['&ME', 'Rampa', 'Adam Port'], organizer: 'Keinemusik', genre: 'house', musicGenres: ['house', 'techno'], priceMin: 40, priceMax: 60, hypeScore: 95, tags: ['house', 'dance', 'international-dj', 'outdoor'], sourcePlatform: 'Resident Advisor', discoveredBy: 'partner' },
      { title: 'Stand-Up Saturday', eventType: 'comedy', category: 'arts', venueName: 'Comedy Cellar', neighborhood: 'Greenwich Village', artists: ['Surprise Lineup'], organizer: 'Comedy Cellar', genre: '', musicGenres: [], priceMin: 20, priceMax: 35, hypeScore: 85, tags: ['comedy', 'legendary', 'surprise-guests'], sourcePlatform: 'Eventbrite', discoveredBy: 'partner' },
      { title: 'Afrobeats & Amapiano Night', eventType: 'themed-party', category: 'nightlife', venueName: 'House of Yes', neighborhood: 'Bushwick', artists: ['DJ Tunez'], organizer: 'House of Yes', genre: 'afrobeats', musicGenres: ['afrobeats', 'hip-hop', 'r&b'], priceMin: 20, priceMax: 30, hypeScore: 88, tags: ['afrobeats', 'dance', 'themed-party', 'late-night'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      // ─ Social ─
      { title: 'NYC Polyglot Café', eventType: 'language-exchange', category: 'social', venueName: 'Housing Works Bookstore', neighborhood: 'SoHo', artists: [], organizer: 'NYC Polyglots', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 72, tags: ['language-exchange', 'bookstore', 'multilingual', 'weekly'], sourcePlatform: 'Meetup', discoveredBy: 'ai_scout' },
      // ─ Food ─
      { title: 'Smorgasburg', eventType: 'food-market', category: 'food', venueName: 'Williamsburg Waterfront', neighborhood: 'Williamsburg', artists: [], organizer: 'Smorgasburg', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 88, tags: ['food-market', 'waterfront', 'artisan', 'saturday', 'instagram-worthy'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      // ─ Sports ─
      { title: 'Central Park Run Club', eventType: 'running', category: 'sports', venueName: 'Central Park', neighborhood: 'Midtown', artists: [], organizer: 'NYC Run Club', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 74, tags: ['running', 'park', 'free', 'morning', 'social'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
      // ─ Arts ─
      { title: 'First Friday Gallery Walk: Chelsea', eventType: 'art-show', category: 'arts', venueName: 'Chelsea Galleries', neighborhood: 'Chelsea', artists: ['Various'], organizer: 'Chelsea Art District', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 76, tags: ['art', 'gallery', 'free', 'wine', 'first-friday'], sourcePlatform: 'instagram_scout', discoveredBy: 'ai_scout' },
    ],
    'Tokyo': [
      // ─ Nightlife ─
      { title: 'Womb Adventure: Jeff Mills', eventType: 'dj-set', category: 'nightlife', venueName: 'Womb', neighborhood: 'Shibuya', artists: ['Jeff Mills', 'Ken Ishii'], organizer: 'Womb Tokyo', genre: 'techno', musicGenres: ['techno', 'electronic'], priceMin: 30, priceMax: 40, hypeScore: 91, tags: ['techno', 'legendary-dj', 'dance'], sourcePlatform: 'Resident Advisor', discoveredBy: 'partner' },
      { title: 'Jazz at Blue Note Tokyo', eventType: 'live-music', category: 'music', venueName: 'Blue Note Tokyo', neighborhood: 'Aoyama', artists: ['Robert Glasper'], organizer: 'Blue Note', genre: 'jazz', musicGenres: ['jazz', 'r&b', 'soul'], priceMin: 60, priceMax: 80, hypeScore: 82, tags: ['jazz', 'premium', 'live-music', 'intimate'], sourcePlatform: 'Songkick', discoveredBy: 'partner' },
      // ─ Social ─
      { title: 'Japanese-English Language Exchange', eventType: 'language-exchange', category: 'social', venueName: 'Hub British Pub', neighborhood: 'Roppongi', artists: [], organizer: 'Tokyo Language Exchange', genre: '', musicGenres: [], priceMin: 0, priceMax: 0, isFree: true, isRecurring: true, hypeScore: 73, tags: ['language-exchange', 'japanese', 'english', 'social', 'weekly'], sourcePlatform: 'Meetup', discoveredBy: 'ai_scout' },
      // ─ Food ─
      { title: 'Tsukiji Outer Market Food Tour', eventType: 'food-tasting', category: 'food', venueName: 'Tsukiji Outer Market', neighborhood: 'Tsukiji', artists: ['Guide: Yuki'], organizer: 'Tokyo Food Walks', genre: '', musicGenres: [], priceMin: 50, priceMax: 70, hypeScore: 85, tags: ['food-tour', 'sushi', 'seafood', 'market', 'guided'], sourcePlatform: 'tiktok_scout', discoveredBy: 'ai_scout' },
      { title: 'Ramen Making Workshop', eventType: 'cooking-class', category: 'food', venueName: 'Tokyo Ramen Academy', neighborhood: 'Shinjuku', artists: ['Chef Tanaka'], organizer: 'Tokyo Ramen Academy', genre: '', musicGenres: [], priceMin: 60, priceMax: 75, hypeScore: 80, tags: ['cooking-class', 'ramen', 'japanese', 'hands-on', 'authentic'], sourcePlatform: 'tiktok_scout', discoveredBy: 'ai_scout' },
      // ─ Arts ─
      { title: 'TeamLab Borderless After Dark', eventType: 'art-show', category: 'arts', venueName: 'TeamLab Borderless', neighborhood: 'Odaiba', artists: [], organizer: 'TeamLab', genre: '', musicGenres: [], priceMin: 30, priceMax: 35, hypeScore: 92, tags: ['digital-art', 'immersive', 'iconic', 'instagram-worthy'], sourcePlatform: 'tiktok_scout', discoveredBy: 'ai_scout' },
    ],
  }

  const cityEventList = cityEvents[city] || []
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

  cityEventList.forEach((evt, idx) => {
    const daysAhead = 1 + idx * 2 + Math.floor(Math.random() * 10)
    const eventDate = new Date(now.getTime() + daysAhead * 86400000)

    const getDoorsTime = (type: string): string => {
      const nightTypes = ['dj-set', 'themed-party', 'concert']
      const morningTypes = ['yoga', 'running', 'cycling', 'food-market', 'market']
      if (nightTypes.includes(type)) return '22:00'
      if (morningTypes.includes(type)) return '09:00'
      return '18:30'
    }

    const getDescription = (e: Partial<ScrapedEvent>): string => {
      if (e.artists && e.artists.length > 0 && e.genre) {
        return `${e.title} at ${e.venueName}. ${e.artists.join(', ')} — ${e.genre} music.`
      }
      if (e.artists && e.artists.length > 0) {
        return `${e.title} at ${e.venueName} with ${e.artists.join(', ')}.`
      }
      return `${e.title} at ${e.venueName}, ${e.neighborhood}. Discover something new in ${city}!`
    }

    events.push({
      title: evt.title || 'Local Event',
      eventType: evt.eventType || 'social-gathering',
      category: evt.category || 'community',
      venueName: evt.venueName || 'Local Venue',
      neighborhood: evt.neighborhood || '',
      city,
      country,
      description: getDescription(evt),
      startDate: eventDate,
      doorsOpen: getDoorsTime(evt.eventType || 'social-gathering'),
      dayOfWeek: dayNames[eventDate.getDay()],
      isRecurring: evt.isRecurring || false,
      priceMin: evt.priceMin || 0,
      priceMax: evt.priceMax || 0,
      currency: city === 'New York' ? 'USD' : city === 'Tokyo' ? 'JPY' : city === 'London' ? 'GBP' : 'EUR',
      isFree: evt.isFree || false,
      artists: evt.artists || [],
      organizer: evt.organizer || '',
      genre: evt.genre || '',
      musicGenres: evt.musicGenres || [],
      tags: evt.tags || [],
      imageUrl: getEventImageUrl(evt.eventType || 'social-gathering', idx),
      ticketUrl: '',
      sourcePlatform: evt.sourcePlatform || 'Eventbrite',
      discoveredBy: evt.discoveredBy || 'manual',
      hypeScore: evt.hypeScore || 50 + Math.floor(Math.random() * 40),
    })
  })

  return events
}

// ─── Export functions ────────────────────────────────────────────────
export function getVenuesForCity(city: string): ScrapedVenue[] {
  return CITY_VENUES[city] || []
}

export function getEventsForCity(city: string, country: string): ScrapedEvent[] {
  return generateCityEvents(city, country)
}

export function getAllSeededCities(): string[] {
  return Object.keys(CITY_VENUES)
}

export type { ScrapedVenue, ScrapedEvent }
