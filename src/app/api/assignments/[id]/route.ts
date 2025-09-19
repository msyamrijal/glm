import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assignment = await db.assignment.findUnique({
      where: { id: params.id },
      include: {
        term: true,
        course: true,
      },
    })

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    return NextResponse.json(assignment)
  } catch (error) {
    console.error('Error fetching assignment:', error)
    return NextResponse.json({ error: 'Failed to fetch assignment' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, dueDate, priority, status, courseId, termId } = body

    if (!title || !dueDate || !termId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const assignment = await db.assignment.update({
      where: { id: params.id },
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        priority: parseInt(priority) || 1,
        status,
        courseId: courseId || null,
        termId,
      },
      include: {
        term: true,
        course: true,
      },
    })

    return NextResponse.json(assignment)
  } catch (error) {
    console.error('Error updating assignment:', error)
    return NextResponse.json({ error: 'Failed to update assignment' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.assignment.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Assignment deleted successfully' })
  } catch (error) {
    console.error('Error deleting assignment:', error)
    return NextResponse.json({ error: 'Failed to delete assignment' }, { status: 500 })
  }
}