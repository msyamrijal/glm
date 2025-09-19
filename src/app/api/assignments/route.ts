import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const assignments = await db.assignment.findMany({
      include: {
        term: true,
        course: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    })

    return NextResponse.json(assignments)
  } catch (error) {
    console.error('Error fetching assignments:', error)
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, dueDate, priority, status, courseId, termId } = body

    if (!title || !dueDate || !termId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // For demo purposes, we'll use a default user ID
    // In a real app, you would get this from authentication
    const userId = 'default-user-id'

    const assignment = await db.assignment.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        priority: parseInt(priority) || 1,
        status,
        courseId: courseId || null,
        termId,
        userId,
      },
      include: {
        term: true,
        course: true,
      },
    })

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    console.error('Error creating assignment:', error)
    return NextResponse.json({ error: 'Failed to create assignment' }, { status: 500 })
  }
}