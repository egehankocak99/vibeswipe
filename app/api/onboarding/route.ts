import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      currentCity,
      currentCountry,
      isVisitor = false,
      vibeStyles = [],
      goOutDays = ['friday', 'saturday'],
      budgetLevel = 'medium',
      musicGenres = [],
    } = body

    if (!email || !currentCity || !currentCountry) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Upsert user
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
    })

    // Upsert profile
    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        currentCity,
        currentCountry,
        isVisitor,
        vibeStyles: JSON.stringify(vibeStyles),
        goOutDays: JSON.stringify(goOutDays),
        budgetLevel,
        musicGenres: JSON.stringify(musicGenres),
      },
      create: {
        userId: user.id,
        currentCity,
        currentCountry,
        isVisitor,
        vibeStyles: JSON.stringify(vibeStyles),
        goOutDays: JSON.stringify(goOutDays),
        budgetLevel,
        musicGenres: JSON.stringify(musicGenres),
      },
    })

    return NextResponse.json({ userId: user.id, success: true })
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 })
  }
}
