import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' })

export async function generateVenueInsight(venue: {
  name: string
  venueType: string
  city: string
  neighborhood: string
  rating: number
  priceLevel: string
  tags: string[]
}): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return getDefaultVenueInsight(venue)
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a hip local nightlife guide. Write a one-sentence insider tip about this venue. Be specific, trendy, and helpful. Max 120 chars.`,
        },
        {
          role: 'user',
          content: `${venue.name} — a ${venue.venueType} in ${venue.neighborhood}, ${venue.city}. Rating: ${venue.rating}/5. Price: ${venue.priceLevel}. Tags: ${venue.tags.join(', ')}.`,
        },
      ],
      max_tokens: 60,
      temperature: 0.8,
    })
    return response.choices[0]?.message?.content?.trim() || getDefaultVenueInsight(venue)
  } catch {
    return getDefaultVenueInsight(venue)
  }
}

export async function generateEventInsight(event: {
  title: string
  eventType: string
  city: string
  artists: string[]
  genre: string
  venueName: string
}): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return getDefaultEventInsight(event)
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a nightlife & events insider. Write a one-sentence hype line about this event. Be exciting and specific. Max 120 chars.`,
        },
        {
          role: 'user',
          content: `"${event.title}" — a ${event.eventType} at ${event.venueName} in ${event.city}. Artists: ${event.artists.join(', ')}. Genre: ${event.genre}.`,
        },
      ],
      max_tokens: 60,
      temperature: 0.9,
    })
    return response.choices[0]?.message?.content?.trim() || getDefaultEventInsight(event)
  } catch {
    return getDefaultEventInsight(event)
  }
}

export async function generateVenueDescription(venue: {
  name: string
  venueType: string
  city: string
  neighborhood: string
  tags: string[]
}): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return `A popular ${venue.venueType} in ${venue.neighborhood}, ${venue.city}. Known for its ${venue.tags.slice(0, 3).join(', ')} vibes.`
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Write a 2-sentence description of this venue for a nightlife discovery app. Be vivid and appealing. Max 200 chars.`,
        },
        {
          role: 'user',
          content: `${venue.name} — a ${venue.venueType} in ${venue.neighborhood}, ${venue.city}. Tags: ${venue.tags.join(', ')}.`,
        },
      ],
      max_tokens: 80,
      temperature: 0.7,
    })
    return response.choices[0]?.message?.content?.trim() || `A popular ${venue.venueType} in ${venue.neighborhood}.`
  } catch {
    return `A popular ${venue.venueType} in ${venue.neighborhood}, ${venue.city}.`
  }
}

function getDefaultVenueInsight(venue: { name: string; venueType: string; neighborhood: string }): string {
  const insights = [
    `Locals rate ${venue.name} as the best ${venue.venueType} in ${venue.neighborhood}`,
    `${venue.name} is where the crowd heads after midnight`,
    `The hidden gem of ${venue.neighborhood} — regulars keep coming back`,
    `Ask for the off-menu cocktails at ${venue.name}`,
    `Peak vibes hit around 11pm on weekends`,
  ]
  return insights[Math.floor(Math.random() * insights.length)]
}

function getDefaultEventInsight(event: { title: string; eventType: string; artists: string[] }): string {
  const insights = [
    `${event.artists[0] || 'The lineup'} is bringing serious heat to this ${event.eventType}`,
    `Last time this event ran, it sold out in 48 hours`,
    `One of the most anticipated ${event.eventType}s this season`,
    `Insider pick — this is the event everyone's talking about`,
    `Get there early — the opening set is not to be missed`,
  ]
  return insights[Math.floor(Math.random() * insights.length)]
}

export { openai }
