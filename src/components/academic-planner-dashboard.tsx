'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Calendar, Clock, BookOpen, AlertTriangle, CheckCircle, Plus, ClipboardList } from 'lucide-react'
import { format } from 'date-fns'

interface Assignment {
  id: string
  title: string
  description?: string
  dueDate: string
  priority: number
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE'
  course?: {
    name: string
    code?: string
  }
}

interface Event {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  location?: string
  type: 'GENERAL' | 'EXAM' | 'PROJECT' | 'MEETING' | 'HOLIDAY'
}

interface Course {
  id: string
  name: string
  code?: string
  instructor?: string
  credits?: number
  assignments: Assignment[]
}

interface Term {
  id: string
  name: string
  startDate: string
  endDate: string
  courses: Course[]
  assignments: Assignment[]
  events: Event[]
}

export function AcademicPlannerDashboard() {
  const [terms, setTerms] = useState<Term[]>([])
  const [upcomingAssignments, setUpcomingAssignments] = useState<Assignment[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [termsRes, assignmentsRes, eventsRes] = await Promise.all([
        fetch('/api/terms'),
        fetch('/api/assignments'),
        fetch('/api/events')
      ])

      if (termsRes.ok) {
        const termsData = await termsRes.json()
        setTerms(termsData)
      }

      if (assignmentsRes.ok) {
        const assignmentsData = await assignmentsRes.json()
        const upcoming = assignmentsData
          .filter((a: Assignment) => a.status !== 'COMPLETED')
          .sort((a: Assignment, b: Assignment) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
          .slice(0, 5)
        setUpcomingAssignments(upcoming)
      }

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json()
        const upcoming = eventsData
          .filter((e: Event) => new Date(e.startDate) > new Date())
          .sort((a: Event, b: Event) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
          .slice(0, 5)
        setUpcomingEvents(upcoming)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 3: return 'destructive'
      case 2: return 'default'
      case 1: return 'secondary'
      default: return 'outline'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'default'
      case 'IN_PROGRESS': return 'secondary'
      case 'OVERDUE': return 'destructive'
      default: return 'outline'
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'EXAM': return 'destructive'
      case 'PROJECT': return 'default'
      case 'MEETING': return 'secondary'
      case 'HOLIDAY': return 'outline'
      default: return 'outline'
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const totalCourses = terms.reduce((acc, term) => acc + term.courses.length, 0)
  const totalAssignments = terms.reduce((acc, term) => acc + term.assignments.length, 0)
  const completedAssignments = terms.reduce((acc, term) => 
    acc + term.assignments.filter(a => a.status === 'COMPLETED').length, 0
  )
  const completionRate = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Terms</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{terms.length}</div>
            <p className="text-xs text-muted-foreground">
              Current academic terms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              Enrolled courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssignments}</div>
            <p className="text-xs text-muted-foreground">
              Total assignments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(completionRate)}%</div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Upcoming Assignments</span>
            </CardTitle>
            <CardDescription>
              Your next 5 upcoming assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAssignments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No upcoming assignments
                </p>
              ) : (
                upcomingAssignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {assignment.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {assignment.course?.name || 'No course'} • Due {format(new Date(assignment.dueDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getPriorityColor(assignment.priority)}>
                        P{assignment.priority}
                      </Badge>
                      {isOverdue(assignment.dueDate) && (
                        <Badge variant="destructive">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Overdue
                        </Badge>
                      )}
                      <Badge variant={getStatusColor(assignment.status)}>
                        {assignment.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Upcoming Events</span>
            </CardTitle>
            <CardDescription>
              Your next 5 upcoming events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No upcoming events
                </p>
              ) : (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(event.startDate), 'MMM dd, yyyy HH:mm')}
                        {event.location && ` • ${event.location}`}
                      </p>
                    </div>
                    <Badge variant={getEventTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Terms Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Current Terms</CardTitle>
          <CardDescription>
            Overview of your active academic terms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {terms.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No terms created yet
              </p>
            ) : (
              terms.map((term) => (
                <div key={term.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{term.name}</h3>
                    <Badge variant="outline">
                      {format(new Date(term.startDate), 'MMM dd')} - {format(new Date(term.endDate), 'MMM dd, yyyy')}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Courses:</span>
                      <span className="ml-2 font-medium">{term.courses.length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Assignments:</span>
                      <span className="ml-2 font-medium">{term.assignments.length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Events:</span>
                      <span className="ml-2 font-medium">{term.events.length}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}