import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const terms = await db.term.findMany({
      include: {
        courses: true,
        assignments: true,
        events: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    })

    return NextResponse.json(terms)
  } catch (error) {
    console.error('Error fetching terms:', error)
    return NextResponse.json({ error: 'Failed to fetch terms' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, startDate, endDate } = body

    if (!name || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // For demo purposes, we'll use a default user ID
    // In a real app, you would get this from authentication
    const userId = 'default-user-id'

    // Check if user exists, if not create it
    let user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      user = await db.user.create({
        data: {
          id: userId,
          email: 'demo@example.com',
          name: 'Demo User'
        }
      })
    }

    const term = await db.term.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId,
      },
      include: {
        courses: true,
        assignments: true,
        events: true,
      },
    })

    return NextResponse.json(term, { status: 201 })
  } catch (error) {
    console.error('Error creating term:', error)
    return NextResponse.json({ error: 'Failed to create term' }, { status: 500 })
  }
}