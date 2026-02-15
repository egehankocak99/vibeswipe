import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const profile = await prisma.profile.findUnique({ where: { userId } })
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json({
      profile: {
        ...profile,
        vibeStyles: JSON.parse(profile.vibeStyles || '[]'),
        goOutDays: JSON.parse(profile.goOutDays || '[]'),
        musicGenres: JSON.parse(profile.musicGenres || '[]'),
      },
    })
  } catch (error) {
    console.error('Preferences GET error:', error)
    return NextResponse.json({ error: 'Failed to load preferences' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, vibeStyles, goOutDays, budgetLevel, musicGenres, currentCity, currentCountry, isVisitor } = body

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const updateData: any = {}
    if (vibeStyles !== undefined) updateData.vibeStyles = JSON.stringify(vibeStyles)
    if (goOutDays !== undefined) updateData.goOutDays = JSON.stringify(goOutDays)
    if (budgetLevel !== undefined) updateData.budgetLevel = budgetLevel
    if (musicGenres !== undefined) updateData.musicGenres = JSON.stringify(musicGenres)
    if (currentCity !== undefined) updateData.currentCity = currentCity
    if (currentCountry !== undefined) updateData.currentCountry = currentCountry
    if (isVisitor !== undefined) updateData.isVisitor = isVisitor

    const profile = await prisma.profile.update({
      where: { userId },
      data: updateData,
    })

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error('Preferences PUT error:', error)
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 })
  }
}
