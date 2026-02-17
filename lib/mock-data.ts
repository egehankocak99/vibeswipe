// ─── Mock Data for VibeSwipe Prototype ──────────────────────────────
// Beautiful curated events with coaster-style illustrated aesthetics
// No database needed — pure client-side demo

export interface MockEvent {
  id: string
  title: string
  category: string
  eventType: string
  description: string
  aiInsight: string
  venueName: string
  neighborhood: string
  tags: string[]
  matchScore: number
  priceMin: number
  priceMax: number
  isFree: boolean
  startDate: string
  doorsOpen: string
  dayOfWeek: string
  artists: string[]
  genre: string
  hypeScore: number
  isTrending: boolean
  isRecurring: boolean
  gradientFrom: string
  gradientTo: string
  emoji: string
  accentColor: string
  cardType: 'event'
}

const today = new Date()
const getDate = (daysFromNow: number) => {
  const d = new Date(today)
  d.setDate(d.getDate() + daysFromNow)
  return d.toISOString()
}

const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export const MOCK_EVENTS: MockEvent[] = [
  {
    id: 'mock-1',
    title: 'Moonlit Jazz on the Rooftop',
    category: 'music',
    eventType: 'live-music',
    description: 'An intimate evening of smooth jazz under the city lights. A local trio performs timeless classics with a modern twist while you sip craft cocktails above the skyline.',
    aiInsight: 'These rooftop sessions sell out fast — regulars say the second set after 10 PM is where the magic happens.',
    venueName: 'Sky Terrace Bar',
    neighborhood: 'Old Town',
    tags: ['jazz', 'rooftop', 'live', 'intimate', 'date-night'],
    matchScore: 94,
    priceMin: 15,
    priceMax: 25,
    isFree: false,
    startDate: getDate(2),
    doorsOpen: '20:00',
    dayOfWeek: days[new Date(getDate(2)).getDay()],
    artists: ['The Velvet Trio', 'Sofia Noir'],
    genre: 'jazz',
    hypeScore: 87,
    isTrending: true,
    isRecurring: false,
    gradientFrom: '#92400e',
    gradientTo: '#fbbf24',
    emoji: '🎷',
    accentColor: '#f59e0b',
    cardType: 'event',
  },
  {
    id: 'mock-2',
    title: 'Neon Underground',
    category: 'nightlife',
    eventType: 'dj-set',
    description: 'Descend into the city\'s most iconic basement club for a night of pulsing techno and industrial beats. Three rooms, six DJs, one unforgettable night.',
    aiInsight: 'Skip the main room until 1 AM — Room 2 is where the real heads go first.',
    venueName: 'The Vault',
    neighborhood: 'Industrial Quarter',
    tags: ['techno', 'underground', 'late-night', 'dark', 'dance'],
    matchScore: 88,
    priceMin: 20,
    priceMax: 20,
    isFree: false,
    startDate: getDate(1),
    doorsOpen: '23:00',
    dayOfWeek: days[new Date(getDate(1)).getDay()],
    artists: ['DVS1', 'VTSS', 'Local Support'],
    genre: 'techno',
    hypeScore: 92,
    isTrending: true,
    isRecurring: false,
    gradientFrom: '#4a044e',
    gradientTo: '#c026d3',
    emoji: '🎧',
    accentColor: '#d946ef',
    cardType: 'event',
  },
  {
    id: 'mock-3',
    title: 'Sunrise Yoga Flow',
    category: 'wellness',
    eventType: 'yoga',
    description: 'Greet the morning with a gentle vinyasa flow by the river. Perfect for all levels. Mats and cold-pressed juice provided.',
    aiInsight: 'The instructor trained in Bali — her sunrise sessions are the most peaceful start to any weekend.',
    venueName: 'Riverside Park',
    neighborhood: 'Waterfront',
    tags: ['yoga', 'sunrise', 'outdoor', 'wellness', 'mindful'],
    matchScore: 76,
    priceMin: 0,
    priceMax: 0,
    isFree: true,
    startDate: getDate(3),
    doorsOpen: '06:30',
    dayOfWeek: days[new Date(getDate(3)).getDay()],
    artists: [],
    genre: 'wellness',
    hypeScore: 65,
    isTrending: false,
    isRecurring: true,
    gradientFrom: '#fce4ec',
    gradientTo: '#e1bee7',
    emoji: '🧘',
    accentColor: '#ab47bc',
    cardType: 'event',
  },
  {
    id: 'mock-4',
    title: 'The Vinyl Social Club',
    category: 'social',
    eventType: 'meetup',
    description: 'Bring a record, share a story. A cozy evening where music lovers connect over turntables, craft beer, and good conversation.',
    aiInsight: 'Bring an obscure B-side and you\'ll instantly be the most popular person in the room.',
    venueName: 'Analog Records Café',
    neighborhood: 'Arts District',
    tags: ['vinyl', 'social', 'music', 'craft-beer', 'community'],
    matchScore: 82,
    priceMin: 5,
    priceMax: 5,
    isFree: false,
    startDate: getDate(4),
    doorsOpen: '19:00',
    dayOfWeek: days[new Date(getDate(4)).getDay()],
    artists: [],
    genre: 'various',
    hypeScore: 71,
    isTrending: false,
    isRecurring: true,
    gradientFrom: '#78350f',
    gradientTo: '#d97706',
    emoji: '🎶',
    accentColor: '#f59e0b',
    cardType: 'event',
  },
  {
    id: 'mock-5',
    title: 'Street Art Safari',
    category: 'arts',
    eventType: 'art-show',
    description: 'Explore hidden murals and underground galleries with a local street artist as your guide. See the city through creative eyes.',
    aiInsight: 'The guide is a working artist — you might catch them painting a new piece during the tour.',
    venueName: 'District Gallery',
    neighborhood: 'East Side',
    tags: ['street-art', 'walking-tour', 'creative', 'culture', 'urban'],
    matchScore: 79,
    priceMin: 12,
    priceMax: 12,
    isFree: false,
    startDate: getDate(1),
    doorsOpen: '15:00',
    dayOfWeek: days[new Date(getDate(1)).getDay()],
    artists: [],
    genre: 'visual-arts',
    hypeScore: 68,
    isTrending: false,
    isRecurring: false,
    gradientFrom: '#134e4a',
    gradientTo: '#2dd4bf',
    emoji: '🎨',
    accentColor: '#14b8a6',
    cardType: 'event',
  },
  {
    id: 'mock-6',
    title: 'Midnight Ramen Market',
    category: 'food',
    eventType: 'food-market',
    description: 'A late-night food haven with 12 ramen chefs from across the city. Steaming bowls, cold sake, and good vibes under fairy lights.',
    aiInsight: 'The truffle miso ramen at stall #7 was the surprise hit last month. Go before midnight.',
    venueName: 'Central Market Hall',
    neighborhood: 'Market Quarter',
    tags: ['ramen', 'night-market', 'foodie', 'street-food', 'social'],
    matchScore: 91,
    priceMin: 0,
    priceMax: 0,
    isFree: true,
    startDate: getDate(5),
    doorsOpen: '21:00',
    dayOfWeek: days[new Date(getDate(5)).getDay()],
    artists: [],
    genre: 'food',
    hypeScore: 84,
    isTrending: true,
    isRecurring: false,
    gradientFrom: '#7f1d1d',
    gradientTo: '#f87171',
    emoji: '🍜',
    accentColor: '#ef4444',
    cardType: 'event',
  },
  {
    id: 'mock-7',
    title: 'Acoustic Fireside Sessions',
    category: 'music',
    eventType: 'live-music',
    description: 'Gather around the fire pit for stripped-back acoustic performances. Singer-songwriters share new material in the most intimate setting possible.',
    aiInsight: 'The last session featured a surprise appearance by a Grammy-nominated artist. You never know who\'ll show.',
    venueName: 'The Cabin Bar',
    neighborhood: 'Westwood',
    tags: ['acoustic', 'intimate', 'singer-songwriter', 'cozy', 'fire'],
    matchScore: 86,
    priceMin: 10,
    priceMax: 10,
    isFree: false,
    startDate: getDate(6),
    doorsOpen: '20:00',
    dayOfWeek: days[new Date(getDate(6)).getDay()],
    artists: ['Maya Blue', 'Owen Creek'],
    genre: 'acoustic',
    hypeScore: 73,
    isTrending: false,
    isRecurring: true,
    gradientFrom: '#7c2d12',
    gradientTo: '#fb923c',
    emoji: '🔥',
    accentColor: '#f97316',
    cardType: 'event',
  },
  {
    id: 'mock-8',
    title: 'Silent Disco at the Gallery',
    category: 'nightlife',
    eventType: 'themed-party',
    description: 'Dance among masterpieces. Three DJ channels, wireless headphones, and a museum after dark. Switch between house, disco, and indie all night.',
    aiInsight: 'Channel 2 (disco) always wins the crowd vote — but channel 3 (indie) is the hidden gem.',
    venueName: 'Modern Art Museum',
    neighborhood: 'Museum Mile',
    tags: ['silent-disco', 'museum', 'unique', 'art', 'dance'],
    matchScore: 93,
    priceMin: 18,
    priceMax: 18,
    isFree: false,
    startDate: getDate(2),
    doorsOpen: '22:00',
    dayOfWeek: days[new Date(getDate(2)).getDay()],
    artists: ['DJ Gallery', 'Disco Picasso'],
    genre: 'multi-genre',
    hypeScore: 91,
    isTrending: true,
    isRecurring: false,
    gradientFrom: '#1e1b4b',
    gradientTo: '#818cf8',
    emoji: '🎧',
    accentColor: '#6366f1',
    cardType: 'event',
  },
  {
    id: 'mock-9',
    title: 'Dawn Run Club',
    category: 'sports',
    eventType: 'running-club',
    description: 'Join 40+ runners for a 5K through the city at first light. All paces welcome. Coffee and pastries at the finish line.',
    aiInsight: 'The 6:45 crew is the friendliest running group in the city — perfect for newcomers.',
    venueName: 'City Park',
    neighborhood: 'Central',
    tags: ['running', 'fitness', 'community', 'morning', 'social'],
    matchScore: 72,
    priceMin: 0,
    priceMax: 0,
    isFree: true,
    startDate: getDate(1),
    doorsOpen: '06:30',
    dayOfWeek: days[new Date(getDate(1)).getDay()],
    artists: [],
    genre: 'fitness',
    hypeScore: 62,
    isTrending: false,
    isRecurring: true,
    gradientFrom: '#14532d',
    gradientTo: '#86efac',
    emoji: '🏃',
    accentColor: '#22c55e',
    cardType: 'event',
  },
  {
    id: 'mock-10',
    title: 'Wine & Life Drawing',
    category: 'arts',
    eventType: 'workshop',
    description: 'Uncork your creativity. Sip natural wines while sketching a live model in a relaxed, no-judgment studio. All supplies included.',
    aiInsight: 'The natural wine selection changes every session — the sommelier picks adventurous bottles.',
    venueName: 'Studio 54 Arts',
    neighborhood: 'Creative Quarter',
    tags: ['wine', 'drawing', 'creative', 'workshop', 'relaxed'],
    matchScore: 85,
    priceMin: 35,
    priceMax: 35,
    isFree: false,
    startDate: getDate(4),
    doorsOpen: '19:30',
    dayOfWeek: days[new Date(getDate(4)).getDay()],
    artists: [],
    genre: 'visual-arts',
    hypeScore: 76,
    isTrending: false,
    isRecurring: true,
    gradientFrom: '#4c0519',
    gradientTo: '#fb7185',
    emoji: '🍷',
    accentColor: '#f43f5e',
    cardType: 'event',
  },
  {
    id: 'mock-11',
    title: 'Techno Boat Party',
    category: 'nightlife',
    eventType: 'dj-set',
    description: 'Set sail at sunset, dance until sunrise. A floating club on the river with panoramic city views and a killer sound system.',
    aiInsight: 'Board by 6:30 PM — the sunset from the upper deck is half the experience.',
    venueName: 'Harbor Cruises',
    neighborhood: 'Docklands',
    tags: ['boat-party', 'techno', 'sunset', 'dance', 'unique'],
    matchScore: 90,
    priceMin: 30,
    priceMax: 45,
    isFree: false,
    startDate: getDate(1),
    doorsOpen: '18:00',
    dayOfWeek: days[new Date(getDate(1)).getDay()],
    artists: ['Floating Frequencies', 'DXRK'],
    genre: 'techno',
    hypeScore: 89,
    isTrending: true,
    isRecurring: false,
    gradientFrom: '#0c4a6e',
    gradientTo: '#38bdf8',
    emoji: '🚢',
    accentColor: '#0ea5e9',
    cardType: 'event',
  },
  {
    id: 'mock-12',
    title: 'Language Exchange Café',
    category: 'social',
    eventType: 'language-exchange',
    description: 'Practice a new language over coffee and cake. Tables organized by language. Meet travelers and locals in the most welcoming café in town.',
    aiInsight: 'The Spanish and French tables are always packed — arrive at 7 PM sharp for a seat.',
    venueName: 'Babel Café',
    neighborhood: 'University District',
    tags: ['language', 'social', 'international', 'café', 'cultural'],
    matchScore: 77,
    priceMin: 3,
    priceMax: 3,
    isFree: false,
    startDate: getDate(3),
    doorsOpen: '19:00',
    dayOfWeek: days[new Date(getDate(3)).getDay()],
    artists: [],
    genre: 'social',
    hypeScore: 69,
    isTrending: false,
    isRecurring: true,
    gradientFrom: '#713f12',
    gradientTo: '#fde047',
    emoji: '🗣️',
    accentColor: '#eab308',
    cardType: 'event',
  },
  {
    id: 'mock-13',
    title: 'Stand-Up in the Dark',
    category: 'arts',
    eventType: 'comedy',
    description: 'Complete darkness. Just you, a comedian, and their most unhinged material. An experimental comedy night that strips everything back.',
    aiInsight: 'Last month\'s show had the audience crying with laughter for 20 straight minutes. Don\'t miss this.',
    venueName: 'The Black Box',
    neighborhood: 'Theater District',
    tags: ['comedy', 'unique', 'experimental', 'night-out', 'bold'],
    matchScore: 83,
    priceMin: 12,
    priceMax: 12,
    isFree: false,
    startDate: getDate(1),
    doorsOpen: '21:00',
    dayOfWeek: days[new Date(getDate(1)).getDay()],
    artists: ['TBA Headliner'],
    genre: 'comedy',
    hypeScore: 80,
    isTrending: false,
    isRecurring: true,
    gradientFrom: '#0f0f0f',
    gradientTo: '#6b21a8',
    emoji: '🎤',
    accentColor: '#a855f7',
    cardType: 'event',
  },
  {
    id: 'mock-14',
    title: 'Golden Hour Cycle Tour',
    category: 'outdoor',
    eventType: 'cycling',
    description: 'A relaxed 15 km ride through parks, riverbanks, and hidden neighborhoods as the sun sets. Electric bikes available.',
    aiInsight: 'The route passes through the city\'s best-kept secret garden — bring your camera.',
    venueName: 'Waterfront Meeting Point',
    neighborhood: 'South Bank',
    tags: ['cycling', 'sunset', 'outdoor', 'sightseeing', 'active'],
    matchScore: 74,
    priceMin: 8,
    priceMax: 8,
    isFree: false,
    startDate: getDate(3),
    doorsOpen: '17:00',
    dayOfWeek: days[new Date(getDate(3)).getDay()],
    artists: [],
    genre: 'outdoor',
    hypeScore: 58,
    isTrending: false,
    isRecurring: true,
    gradientFrom: '#78350f',
    gradientTo: '#fdba74',
    emoji: '🚲',
    accentColor: '#fb923c',
    cardType: 'event',
  },
  {
    id: 'mock-15',
    title: 'Plant-Based Cooking Workshop',
    category: 'food',
    eventType: 'cooking-class',
    description: 'Learn to make stunning plant-based dishes from a former Michelin-star chef. Take home recipes and a full belly.',
    aiInsight: 'The chef\'s cashew cream technique alone is worth the price of admission.',
    venueName: 'Green Kitchen Studio',
    neighborhood: 'North End',
    tags: ['cooking', 'vegan', 'workshop', 'foodie', 'healthy'],
    matchScore: 80,
    priceMin: 40,
    priceMax: 40,
    isFree: false,
    startDate: getDate(3),
    doorsOpen: '11:00',
    dayOfWeek: days[new Date(getDate(3)).getDay()],
    artists: [],
    genre: 'food',
    hypeScore: 72,
    isTrending: false,
    isRecurring: false,
    gradientFrom: '#14532d',
    gradientTo: '#6ee7b7',
    emoji: '🌿',
    accentColor: '#34d399',
    cardType: 'event',
  },
]

// ─── Category info ──────────────────────────────────────────────────
export const CATEGORIES = [
  { id: 'all', label: 'All', emoji: '✨' },
  { id: 'nightlife', label: 'Nightlife', emoji: '🌙' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'social', label: 'Social', emoji: '💬' },
  { id: 'food', label: 'Food', emoji: '🍜' },
  { id: 'arts', label: 'Arts', emoji: '🎨' },
  { id: 'sports', label: 'Sports', emoji: '🏃' },
  { id: 'wellness', label: 'Wellness', emoji: '🧘' },
  { id: 'outdoor', label: 'Outdoor', emoji: '🌿' },
]

// ─── Saved items helper ─────────────────────────────────────────────
const SAVED_KEY = 'vibeswipe_saved'
const SWIPED_KEY = 'vibeswipe_swiped'

export function getSavedEvents(): MockEvent[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(SAVED_KEY)
  if (!raw) return []
  try {
    const ids: string[] = JSON.parse(raw)
    return MOCK_EVENTS.filter(e => ids.includes(e.id))
  } catch { return [] }
}

export function saveEvent(eventId: string) {
  if (typeof window === 'undefined') return
  const raw = localStorage.getItem(SAVED_KEY)
  const ids: string[] = raw ? JSON.parse(raw) : []
  if (!ids.includes(eventId)) {
    ids.push(eventId)
    localStorage.setItem(SAVED_KEY, JSON.stringify(ids))
  }
}

export function unsaveEvent(eventId: string) {
  if (typeof window === 'undefined') return
  const raw = localStorage.getItem(SAVED_KEY)
  const ids: string[] = raw ? JSON.parse(raw) : []
  localStorage.setItem(SAVED_KEY, JSON.stringify(ids.filter(id => id !== eventId)))
}

export function isEventSaved(eventId: string): boolean {
  if (typeof window === 'undefined') return false
  const raw = localStorage.getItem(SAVED_KEY)
  if (!raw) return false
  return JSON.parse(raw).includes(eventId)
}

export function getSwipedIds(): string[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(SWIPED_KEY)
  return raw ? JSON.parse(raw) : []
}

export function markSwiped(eventId: string) {
  if (typeof window === 'undefined') return
  const ids = getSwipedIds()
  if (!ids.includes(eventId)) {
    ids.push(eventId)
    localStorage.setItem(SWIPED_KEY, JSON.stringify(ids))
  }
}

export function resetSwipes() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SWIPED_KEY)
}

export function getUnswipedEvents(category?: string): MockEvent[] {
  const swiped = getSwipedIds()
  let events = MOCK_EVENTS.filter(e => !swiped.includes(e.id))
  if (category && category !== 'all') {
    events = events.filter(e => e.category === category)
  }
  return events.sort((a, b) => b.matchScore - a.matchScore)
}
