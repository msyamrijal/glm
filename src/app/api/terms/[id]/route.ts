import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const term = await db.term.findUnique({
      where: { id: params.id },
      include: {
        courses: true,
        assignments: true,
        events: true,
      },
    })

    if (!term) {
      return NextResponse.json({ error: 'Term not found' }, { status: 404 })
    }

    return NextResponse.json(term)
  } catch (error) {
    console.error('Error fetching term:', error)
    return NextResponse.json({ error: 'Failed to fetch term' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, startDate, endDate } = body

    if (!name || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const term = await db.term.update({
      where: { id: params.id },
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
      include: {
        courses: true,
        assignments: true,
        events: true,
      },
    })

    return NextResponse.json(term)
  } catch (error) {
    console.error('Error updating term:', error)
    return NextResponse.json({ error: 'Failed to update term' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.term.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Term deleted successfully' })
  } catch (error) {
    console.error('Error deleting term:', error)
    return NextResponse.json({ error: 'Failed to delete term' }, { status: 500 })
  }
}