// ─── Nightlife Intelligence: Cities, Vibes & Categories ─────────────

export const NIGHTLIFE_CITIES = [
  // Europe
  { city: 'Barcelona', country: 'Spain', timezone: 'Europe/Madrid' },
  { city: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin' },
  { city: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam' },
  { city: 'London', country: 'United Kingdom', timezone: 'Europe/London' },
  { city: 'Paris', country: 'France', timezone: 'Europe/Paris' },
  { city: 'Lisbon', country: 'Portugal', timezone: 'Europe/Lisbon' },
  { city: 'Prague', country: 'Czech Republic', timezone: 'Europe/Prague' },
  { city: 'Budapest', country: 'Hungary', timezone: 'Europe/Budapest' },
  { city: 'Athens', country: 'Greece', timezone: 'Europe/Athens' },
  { city: 'Milan', country: 'Italy', timezone: 'Europe/Rome' },
  { city: 'Rome', country: 'Italy', timezone: 'Europe/Rome' },
  { city: 'Copenhagen', country: 'Denmark', timezone: 'Europe/Copenhagen' },
  { city: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul' },
  { city: 'Dublin', country: 'Ireland', timezone: 'Europe/Dublin' },
  { city: 'Belgrade', country: 'Serbia', timezone: 'Europe/Belgrade' },
  // Americas
  { city: 'New York', country: 'United States', timezone: 'America/New_York' },
  { city: 'Miami', country: 'United States', timezone: 'America/New_York' },
  { city: 'Los Angeles', country: 'United States', timezone: 'America/Los_Angeles' },
  { city: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City' },
  { city: 'Buenos Aires', country: 'Argentina', timezone: 'America/Argentina/Buenos_Aires' },
  { city: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo' },
  { city: 'Medellín', country: 'Colombia', timezone: 'America/Bogota' },
  { city: 'Montreal', country: 'Canada', timezone: 'America/Montreal' },
  // Asia & Oceania
  { city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
  { city: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok' },
  { city: 'Bali', country: 'Indonesia', timezone: 'Asia/Makassar' },
  { city: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul' },
  { city: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai' },
  { city: 'Tel Aviv', country: 'Israel', timezone: 'Asia/Jerusalem' },
  { city: 'Melbourne', country: 'Australia', timezone: 'Australia/Melbourne' },
  { city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney' },
  // Africa
  { city: 'Cape Town', country: 'South Africa', timezone: 'Africa/Johannesburg' },
  { city: 'Marrakech', country: 'Morocco', timezone: 'Africa/Casablanca' },
] as const

export const SUPPORTED_CITIES = NIGHTLIFE_CITIES.map(c => c.city)
export const SUPPORTED_COUNTRIES = Array.from(new Set(NIGHTLIFE_CITIES.map(c => c.country)))

export const VIBE_STYLES = [
  'rooftop',
  'underground',
  'live-music',
  'chill',
  'cocktail',
  'craft-beer',
  'wine-bar',
  'dive-bar',
  'speakeasy',
  'dance',
  'latin',
  'techno',
  'hip-hop',
  'jazz',
  'date-night',
  'group-friendly',
  'late-night',
  'brunch-spot',
  'outdoor',
  'cultural',
  'sporty',
  'wellness',
  'social',
  'creative',
  'foodie',
] as const

export const VENUE_TYPES = [
  'bar',
  'cafe',
  'club',
  'lounge',
  'rooftop',
  'pub',
  'wine-bar',
  'beer-garden',
  'restaurant',
  'speakeasy',
  'co-working',
  'gym',
  'park',
  'gallery',
] as const

export const EVENT_TYPES = [
  // Nightlife & Music
  'concert',
  'dj-set',
  'festival',
  'live-music',
  'comedy',
  'open-mic',
  'themed-party',
  'pub-crawl',
  'karaoke',
  // Arts & Culture
  'art-show',
  'gallery-opening',
  'open-air-cinema',
  'theater',
  'poetry-night',
  // Social & Community
  'language-exchange',
  'pub-quiz',
  'networking',
  'meetup',
  'speed-dating',
  'board-games',
  // Food & Drink
  'food-market',
  'food-tour',
  'wine-tasting',
  'cooking-class',
  'brunch-event',
  // Sports & Outdoor
  'cycling',
  'running-club',
  'yoga',
  'hiking',
  'surf',
  'pickup-sports',
  // Learning & Wellness
  'workshop',
  'dance-class',
  'meditation',
  'photography-walk',
  'pottery-class',
] as const

export const EVENT_CATEGORIES = [
  { id: 'nightlife', label: '🌙 Nightlife', emoji: '🌙' },
  { id: 'music', label: '🎵 Music', emoji: '🎵' },
  { id: 'social', label: '🤝 Social', emoji: '🤝' },
  { id: 'sports', label: '⚽ Sports', emoji: '⚽' },
  { id: 'wellness', label: '🧘 Wellness', emoji: '🧘' },
  { id: 'food', label: '🍕 Food & Drink', emoji: '🍕' },
  { id: 'arts', label: '🎨 Arts & Culture', emoji: '🎨' },
  { id: 'learning', label: '📚 Learning', emoji: '📚' },
  { id: 'outdoor', label: '🌿 Outdoor', emoji: '🌿' },
  { id: 'community', label: '💬 Community', emoji: '💬' },
] as const

export const MUSIC_GENRES = [
  'techno',
  'house',
  'hip-hop',
  'r&b',
  'latin',
  'reggaeton',
  'jazz',
  'rock',
  'indie',
  'pop',
  'afrobeats',
  'drum-and-bass',
  'disco',
  'funk',
  'soul',
  'electronic',
  'acoustic',
  'world-music',
] as const

export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const

export const PRICE_LEVELS = ['$', '$$', '$$$', '$$$$'] as const
export const BUDGET_LEVELS = ['budget', 'medium', 'premium', 'any'] as const

// ─── Source Platforms ────────────────────────────────────────────────
export const SOURCE_PLATFORMS = [
  // Our AI scout accounts (autonomous IG/TikTok monitoring)
  { id: 'instagram_scout', name: 'VibeSwipe IG Scout', dataTypes: ['event', 'venue'], isAiScout: true },
  { id: 'tiktok_scout', name: 'VibeSwipe TikTok Scout', dataTypes: ['event', 'venue'], isAiScout: true },
  // Major event platforms
  { id: 'resident_advisor', name: 'Resident Advisor', dataTypes: ['event', 'venue'], isAiScout: false },
  { id: 'eventbrite', name: 'Eventbrite', dataTypes: ['event'], isAiScout: false },
  { id: 'dice', name: 'DICE', dataTypes: ['event'], isAiScout: false },
  { id: 'songkick', name: 'Songkick', dataTypes: ['event'], isAiScout: false },
  { id: 'meetup', name: 'Meetup', dataTypes: ['event'], isAiScout: false },
  // Venue & review platforms  
  { id: 'google_maps', name: 'Google Maps', dataTypes: ['venue', 'review'], isAiScout: false },
  { id: 'yelp', name: 'Yelp', dataTypes: ['venue', 'review'], isAiScout: false },
  { id: 'tripadvisor', name: 'TripAdvisor', dataTypes: ['venue', 'review'], isAiScout: false },
  { id: 'time_out', name: 'Time Out', dataTypes: ['venue', 'event'], isAiScout: false },
  // Social (scraped, not owned)
  { id: 'instagram', name: 'Instagram', dataTypes: ['venue', 'event'], isAiScout: false },
  { id: 'tiktok', name: 'TikTok', dataTypes: ['event'], isAiScout: false },
  { id: 'facebook_events', name: 'Facebook Events', dataTypes: ['event'], isAiScout: false },
] as const

// ─── AI Scout Account handles per city ──────────────────────────────
export const AI_SCOUT_ACCOUNTS: Record<string, { instagram: string; tiktok: string }> = {
  Barcelona: { instagram: '@vibeswipe.bcn', tiktok: '@vibeswipe.bcn' },
  Berlin: { instagram: '@vibeswipe.berlin', tiktok: '@vibeswipe.berlin' },
  Amsterdam: { instagram: '@vibeswipe.ams', tiktok: '@vibeswipe.ams' },
  London: { instagram: '@vibeswipe.ldn', tiktok: '@vibeswipe.ldn' },
  Paris: { instagram: '@vibeswipe.paris', tiktok: '@vibeswipe.paris' },
  Lisbon: { instagram: '@vibeswipe.lisbon', tiktok: '@vibeswipe.lisbon' },
  Prague: { instagram: '@vibeswipe.prague', tiktok: '@vibeswipe.prague' },
  Budapest: { instagram: '@vibeswipe.budapest', tiktok: '@vibeswipe.budapest' },
  Athens: { instagram: '@vibeswipe.athens', tiktok: '@vibeswipe.athens' },
  Milan: { instagram: '@vibeswipe.milan', tiktok: '@vibeswipe.milan' },
  Rome: { instagram: '@vibeswipe.rome', tiktok: '@vibeswipe.rome' },
  Copenhagen: { instagram: '@vibeswipe.cph', tiktok: '@vibeswipe.cph' },
  Istanbul: { instagram: '@vibeswipe.ist', tiktok: '@vibeswipe.ist' },
  Dublin: { instagram: '@vibeswipe.dublin', tiktok: '@vibeswipe.dublin' },
  Belgrade: { instagram: '@vibeswipe.belgrade', tiktok: '@vibeswipe.belgrade' },
  'New York': { instagram: '@vibeswipe.nyc', tiktok: '@vibeswipe.nyc' },
  Tokyo: { instagram: '@vibeswipe.tokyo', tiktok: '@vibeswipe.tokyo' },
}

// ─── Unsplash-style placeholder images by category ──────────────────
export function getVenueImageUrl(venueType: string, index: number = 0): string {
  const categories: Record<string, string[]> = {
    bar: [
      'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80',
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
      'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&q=80',
    ],
    cafe: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
      'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80',
    ],
    club: [
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80',
      'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    ],
    lounge: [
      'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&q=80',
      'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?w=800&q=80',
    ],
    rooftop: [
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80',
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80',
    ],
    pub: [
      'https://images.unsplash.com/photo-1546726747-421c6d69c929?w=800&q=80',
      'https://images.unsplash.com/photo-1555658636-6e4a36218be7?w=800&q=80',
    ],
    restaurant: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80',
    ],
    default: [
      'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80',
    ],
  }
  const imgs = categories[venueType] || categories.default
  return imgs[index % imgs.length]
}

export function getEventImageUrl(eventType: string, index: number = 0): string {
  const categories: Record<string, string[]> = {
    concert: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
      'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=80',
    ],
    'dj-set': [
      'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80',
      'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=800&q=80',
    ],
    festival: [
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80',
    ],
    'live-music': [
      'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    ],
    comedy: [
      'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80',
    ],
    'open-mic': [
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80',
    ],
    'language-exchange': [
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
    ],
    'pub-quiz': [
      'https://images.unsplash.com/photo-1546726747-421c6d69c929?w=800&q=80',
    ],
    cycling: [
      'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&q=80',
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80',
    ],
    yoga: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    ],
    hiking: [
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
    ],
    workshop: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
    ],
    'cooking-class': [
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
    ],
    'food-market': [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80',
    ],
    'food-tour': [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    ],
    'wine-tasting': [
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
    ],
    'art-show': [
      'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800&q=80',
      'https://images.unsplash.com/photo-1577720643272-265f09367456?w=800&q=80',
    ],
    'open-air-cinema': [
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
    ],
    'dance-class': [
      'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&q=80',
    ],
    networking: [
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80',
    ],
    'running-club': [
      'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80',
    ],
    'themed-party': [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    ],
    'pub-crawl': [
      'https://images.unsplash.com/photo-1575444758702-4a6b9222c016?w=800&q=80',
    ],
    meetup: [
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    ],
    default: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    ],
  }
  const imgs = categories[eventType] || categories.default
  return imgs[index % imgs.length]
}
