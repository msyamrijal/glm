import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const courses = await db.course.findMany({
      include: {
        term: true,
        assignments: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, code, instructor, description, credits, termId } = body

    if (!name || !termId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // For demo purposes, we'll use a default user ID
    // In a real app, you would get this from authentication
    const userId = 'default-user-id'

    const course = await db.course.create({
      data: {
        name,
        code,
        instructor,
        description,
        credits: credits ? parseInt(credits) : null,
        termId,
        userId,
      },
      include: {
        term: true,
        assignments: true,
      },
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}