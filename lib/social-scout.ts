// ─── Social Media AI Scout ──────────────────────────────────────────
// This module represents the AI-operated Instagram & TikTok accounts
// that continuously scan European cities for events, activities, and
// anything happening locally — concerts, pub quizzes, yoga, language
// exchanges, cycling groups, art shows, food markets, etc.
//
// In production, this would:
// 1. Use Instagram Graph API + TikTok API to monitor followed accounts
// 2. Use OpenAI Vision to analyze post images/captions for event info
// 3. Extract dates, venues, prices, and event types from posts
// 4. Auto-create EventCards from high-confidence detections
// 5. Run on a CRON schedule (every 30 min per city)
//
// The AI scout accounts follow:
// - Venue pages (bars, clubs, cafes, gyms, studios)
// - Event promoters & organizers
// - Local "what's on" pages
// - City guide accounts
// - Community groups (language exchange, running clubs, etc.)
// - Local influencers who post about events
// - Hashtags like #barcelonaevents #berlinwhatson #amsterdamtonigt

import { AI_SCOUT_ACCOUNTS, NIGHTLIFE_CITIES } from './nightlife-data'

// ─── Types ───────────────────────────────────────────────────────────

export interface ScoutedPostData {
  platform: 'instagram' | 'tiktok'
  postId: string
  accountHandle: string
  city: string
  caption: string
  hashtags: string[]
  imageUrl?: string
  videoUrl?: string
  postedAt: Date
}

export interface AiEventExtraction {
  isEvent: boolean
  confidence: number // 0-1
  title?: string
  eventType?: string
  category?: string
  venue?: string
  neighborhood?: string
  date?: string
  time?: string
  price?: { min: number; max: number; currency: string }
  isFree?: boolean
  artists?: string[]
  organizer?: string
  description?: string
  tags?: string[]
  isRecurring?: boolean
  recurringPattern?: string
}

// ─── Monitored Accounts per City ─────────────────────────────────────
// These are the real accounts our AI scout would follow in each city

export const MONITORED_ACCOUNTS: Record<string, {
  venues: string[]
  promoters: string[]
  community: string[]
  hashtags: string[]
}> = {
  Barcelona: {
    venues: [
      '@raborazzmatazz', '@paradiso_barcelona', '@moogatheater', '@saboreclubbarcelona',
      '@salaapolo', '@macarenaclub', '@nitsa_club', '@eclipsebarcelona',
      '@cafedelopera_bcn', '@satanicbcn', '@laconfiteria_bcn',
    ],
    promoters: [
      '@sonarfestival', '@cruilla', '@brunchinthpark', '@primabordbcn',
      '@barcelonabeachfestival', '@offsonar',
    ],
    community: [
      '@mundolingo_bcn', '@bcnrunners', '@yogainthecity_bcn', '@bcnbikekitchen',
      '@barcookingclass', '@barcelonapubcrawl', '@bcnlanguageexchange',
      '@artwalksbarcelona', '@bcnfoodtours', '@skatebcn',
    ],
    hashtags: [
      '#barcelonaevents', '#bcnnightlife', '#barcelonatonoche', '#whatsonbcn',
      '#bcnmusic', '#barcelonaplans', '#bcnyoga', '#barcelonafood',
      '#bcncycling', '#languageexchangebcn',
    ],
  },
  Berlin: {
    venues: [
      '@beraborberghain', '@sysiphos_berlin', '@wildederenate', '@kabortkraftberlin',
      '@tresorberlin', '@watergateclub', '@klunkerkranich', '@monkeybarberlin',
      '@griesmuehle_berlin', '@sisilypso',
    ],
    promoters: [
      '@berghain.cafepanorama', '@katermukke', '@keinemusik', '@innervisions_',
      '@about_blank_berlin', '@ctm_festival',
    ],
    community: [
      '@berlinrunners', '@berlinlanguageexchange', '@yogaberlin', '@berlinbikeride',
      '@berlinartwalks', '@cookingberlin', '@berlinpubquiz', '@boardgamesberlin',
      '@berlinclimbingcrew', '@tandemberlin',
    ],
    hashtags: [
      '#berlinevents', '#berlinnightlife', '#berlinparty', '#whatsoninberlin',
      '#berlinmusic', '#berlinkultur', '#berlinyoga', '#berlinfood',
    ],
  },
  Amsterdam: {
    venues: [
      '@shelteramsterdam', '@paradisoamsterdam', '@melkwegamsterdam',
      '@demarktkantine', '@sugarfactory_adam', '@clairamsterdam',
      '@bitterzoet_a', '@tolhuistuinamsterdam', '@pllek_amsterdam',
    ],
    promoters: [
      '@awakeningsfestival', '@dekmantel', '@lovelandfestival', '@dgtl_festival',
      '@ade_amsterdam', '@valhalla_festival',
    ],
    community: [
      '@amsterdamrunners', '@mondolingo_ams', '@yogainthepark_ams',
      '@bikebuddy_amsterdam', '@amspubquiz', '@amstangocommunity',
      '@cookingams', '@amsterdamfoodtour', '@artwalks_ams', '@surfinams',
    ],
    hashtags: [
      '#amsterdamevents', '#amsnightlife', '#whatsonamsterdam',
      '#amstnightout', '#amsterdammusic', '#amsyoga', '#amsterdamfood',
    ],
  },
  London: {
    venues: [
      '@fabriclondon', '@printaborksldn', '@magazineldn', '@phonox_london',
      '@e1london', '@vaultfestival', '@nightjarbar', '@skygardenlondon',
      '@corsicaaborstudios', '@villagevault_ldn',
    ],
    promoters: [
      '@boaborilerroom', '@lwhpresents', '@junction2_', '@fieldday_london',
      '@allpointseast', '@broadwicklive',
    ],
    community: [
      '@londonrunners', '@languageexchange_ldn', '@yogainthepark_ldn',
      '@londoncyclingcrew', '@ldnpubquiz', '@boardgamesldn',
      '@ldncookingclass', '@londonartwalks', '@parkrun_london', '@loveldn_food',
    ],
    hashtags: [
      '#londonevents', '#londonnightlife', '#whatsonlondon', '#ldnmusic',
      '#londonyoga', '#foodldn', '#londonmarkets', '#londonoutdoor',
    ],
  },
  Paris: {
    venues: [
      '@reaborxclub', '@concretaborparis', '@nuitsfauves', '@badaboum_paris',
      '@moulinrouge', '@lemachine_paris', '@lajavaborelle', '@silencathoborbar',
    ],
    promoters: [
      '@weatherfestival', '@peaboracheparis', '@iboatparis', '@laplusbelle',
    ],
    community: [
      '@parisrunners', '@mundolingo_paris', '@yogaparks_paris', '@pariscycling',
      '@parisfoodwalks', '@parisartnight', '@parispubquiz', '@paristangoclub',
    ],
    hashtags: [
      '#parisevenements', '#parisnightlife', '#parissortir', '#whatsinparis',
      '#parismusic', '#parisyoga', '#parisfood', '#parisculture',
    ],
  },
  Lisbon: {
    venues: [
      '@luxfragil', '@musicboxlisboa', '@village_underground_lisboa',
      '@lxfactory', '@titaniaborclub', '@ministeriumlisboa',
    ],
    promoters: [
      '@nossaborsa', '@festadoavante', '@supersaborck',
    ],
    community: [
      '@lisbonrunners', '@lismundolingo', '@yogalisboa', '@lisboncycling',
      '@lisbonfoodtours', '@lisbonpubcrawl', '@surfportugal_lis',
    ],
    hashtags: [
      '#lisboneventos', '#lisboabynight', '#whatsonlisbon', '#lisbonmusic',
      '#lisbonyoga', '#lisbonfood', '#lisboacultura',
    ],
  },
  Prague: {
    venues: [
      '@raborxyclubprague', '@sasaaborzu', '@crossclub_prague', '@meetfactoryprague',
      '@chapeau_rouge', '@karlovy_lazne',
    ],
    promoters: ['@letaborpark', '@metronome_festival', '@signal_festival'],
    community: [
      '@praguerunners', '@mundolingo_prague', '@praguepubcrawl',
      '@praguefoodtour', '@yogaprague', '@praguecycling',
    ],
    hashtags: ['#pragueevents', '#praguenightlife', '#whatsonprague', '#praguemusic'],
  },
  Budapest: {
    venues: [
      '@szimpla_kert', '@instantfogas', '@akvarium_klub', '@corvinclub',
      '@a38ship', '@dobozbar',
    ],
    promoters: ['@szigetfestival', '@borfesztival', '@budapestruin'],
    community: [
      '@budapestrunners', '@mundolingo_bp', '@budapubcrawl',
      '@budapestfoodtour', '@yogabudapest', '@bpcycling',
    ],
    hashtags: ['#budapestevents', '#budapestnightlife', '#whatsonbudapest', '#budapestmusic'],
  },
}

// ─── How many accounts & hashtags each city scout monitors ──────────
export function getScoutStats(city: string) {
  const data = MONITORED_ACCOUNTS[city]
  if (!data) return { accounts: 0, hashtags: 0, totalSources: 0 }
  const accounts = data.venues.length + data.promoters.length + data.community.length
  return {
    accounts,
    hashtags: data.hashtags.length,
    totalSources: accounts + data.hashtags.length,
  }
}

// ─── Simulate AI analysis of a social media post ────────────────────
// In production, this would call OpenAI Vision API on the post image
// and GPT-4 on the caption to extract event data.
export function simulateAiPostAnalysis(post: ScoutedPostData): AiEventExtraction {
  const caption = post.caption.toLowerCase()

  // Pattern matching keywords for different event types
  const eventPatterns: { keywords: string[]; eventType: string; category: string }[] = [
    { keywords: ['dj', 'set', 'lineup', 'b2b', 'techno night', 'house night'], eventType: 'dj-set', category: 'nightlife' },
    { keywords: ['concert', 'live show', 'tour', 'performing live'], eventType: 'concert', category: 'music' },
    { keywords: ['festival', 'fest '], eventType: 'festival', category: 'music' },
    { keywords: ['language exchange', 'tandem', 'intercambio', 'sprachaustausch'], eventType: 'language-exchange', category: 'social' },
    { keywords: ['pub quiz', 'trivia', 'quiz night'], eventType: 'pub-quiz', category: 'social' },
    { keywords: ['yoga', 'meditation', 'mindfulness'], eventType: 'yoga', category: 'wellness' },
    { keywords: ['run club', 'running', 'runners', 'parkrun'], eventType: 'running-club', category: 'sports' },
    { keywords: ['cycling', 'bike ride', 'bike tour', 'critical mass'], eventType: 'cycling', category: 'sports' },
    { keywords: ['cooking class', 'learn to cook', 'culinary'], eventType: 'cooking-class', category: 'food' },
    { keywords: ['food market', 'street food', 'food festival'], eventType: 'food-market', category: 'food' },
    { keywords: ['food tour', 'tasting tour', 'gastro walk'], eventType: 'food-tour', category: 'food' },
    { keywords: ['wine tasting', 'wine night', 'natural wine'], eventType: 'wine-tasting', category: 'food' },
    { keywords: ['art show', 'exhibition', 'gallery', 'vernissage'], eventType: 'art-show', category: 'arts' },
    { keywords: ['open air cinema', 'outdoor cinema', 'movie night'], eventType: 'open-air-cinema', category: 'arts' },
    { keywords: ['comedy', 'stand-up', 'standup', 'comedy night'], eventType: 'comedy', category: 'nightlife' },
    { keywords: ['open mic', 'openmic'], eventType: 'open-mic', category: 'music' },
    { keywords: ['workshop', 'class', 'learn', 'masterclass'], eventType: 'workshop', category: 'learning' },
    { keywords: ['dance class', 'salsa class', 'bachata class'], eventType: 'dance-class', category: 'learning' },
    { keywords: ['pub crawl', 'bar crawl'], eventType: 'pub-crawl', category: 'nightlife' },
    { keywords: ['networking', 'mixer', 'founders', 'entrepreneurs'], eventType: 'networking', category: 'community' },
    { keywords: ['hike', 'hiking', 'trail', 'mountain walk'], eventType: 'hiking', category: 'outdoor' },
    { keywords: ['karaoke'], eventType: 'karaoke', category: 'nightlife' },
    { keywords: ['brunch', 'bottomless'], eventType: 'brunch-event', category: 'food' },
    { keywords: ['speed dating', 'singles'], eventType: 'speed-dating', category: 'social' },
    { keywords: ['board game', 'game night'], eventType: 'board-games', category: 'social' },
    { keywords: ['pottery', 'ceramics'], eventType: 'pottery-class', category: 'learning' },
    { keywords: ['surf', 'surfing'], eventType: 'surf', category: 'sports' },
    { keywords: ['photography walk', 'photo walk'], eventType: 'photography-walk', category: 'learning' },
    { keywords: ['meetup', 'meet up', 'get together'], eventType: 'meetup', category: 'community' },
    { keywords: ['party', 'fiesta', 'rave', 'afterparty'], eventType: 'themed-party', category: 'nightlife' },
  ]

  // Check for date indicators
  const hasDate = /\b(tonight|tomorrow|this (friday|saturday|thursday|sunday|weekend)|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{1,2}\/\d{1,2}|\d{1,2}\.\d{1,2})\b/i.test(caption)

  // Check for event indicators
  const hasEventIndicators = /\b(join us|doors open|tickets|entry|free entry|rsvp|sign up|register|don't miss|limited spots|lineup|link in bio)\b/i.test(caption)

  let bestMatch: { eventType: string; category: string } | null = null
  for (const pattern of eventPatterns) {
    if (pattern.keywords.some(kw => caption.includes(kw))) {
      bestMatch = { eventType: pattern.eventType, category: pattern.category }
      break
    }
  }

  const isEvent = bestMatch !== null && (hasDate || hasEventIndicators)
  const confidence = isEvent
    ? (hasDate && hasEventIndicators ? 0.95 : hasDate ? 0.8 : 0.65)
    : 0.1

  if (!isEvent || !bestMatch) {
    return { isEvent: false, confidence }
  }

  // Extract potential free
  const isFree = /\b(free|gratis|kostenlos|free entry|no cover)\b/i.test(caption)

  // Extract potential recurring
  const isRecurring = /\b(every (week|thursday|friday|saturday|sunday|monday|tuesday|wednesday)|weekly|monthly|bi-weekly)\b/i.test(caption)

  return {
    isEvent: true,
    confidence,
    eventType: bestMatch.eventType,
    category: bestMatch.category,
    isFree,
    isRecurring,
    tags: post.hashtags.slice(0, 5),
  }
}

// ─── Get what a city scout is currently tracking ─────────────────────
export function getScoutSummary(city: string) {
  const scoutAccounts = AI_SCOUT_ACCOUNTS[city]
  const monitored = MONITORED_ACCOUNTS[city]
  const stats = getScoutStats(city)

  return {
    city,
    scoutIG: scoutAccounts?.instagram || null,
    scoutTikTok: scoutAccounts?.tiktok || null,
    monitoring: {
      venues: monitored?.venues.length || 0,
      promoters: monitored?.promoters.length || 0,
      communityPages: monitored?.community.length || 0,
      hashtags: monitored?.hashtags.length || 0,
      totalSources: stats.totalSources,
    },
    capabilities: [
      'Auto-detect events from IG/TikTok posts',
      'Extract dates, venues, prices from captions',
      'Analyze post images for event flyers',
      'Track recurring community events',
      'Monitor trending hashtags for pop-up events',
      'Cross-reference with Eventbrite, RA, DICE, Meetup',
    ],
  }
}
