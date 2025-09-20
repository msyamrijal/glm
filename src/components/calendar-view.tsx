'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, BookOpen, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns'

interface Assignment {
  id: string
  title: string
  description?: string
  dueDate: string
  priority: number
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE'
  termId: string
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
  termId: string
}

interface Term {
  id: string
  name: string
  startDate: string
  endDate: string
}

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [terms, setTerms] = useState<Term[]>([])
  const [selectedTerm, setSelectedTerm] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [assignmentsRes, eventsRes, termsRes] = await Promise.all([
        fetch('/api/assignments'),
        fetch('/api/events'),
        fetch('/api/terms')
      ])

      if (assignmentsRes.ok) {
        const assignmentsData = await assignmentsRes.json()
        setAssignments(assignmentsData)
      }

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json()
        setEvents(eventsData)
      }

      if (termsRes.ok) {
        const termsData = await termsRes.json()
        setTerms(termsData)
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error)
      setAssignments([])
      setEvents([])
      setTerms([])
    } finally {
      setLoading(false)
    }
  }

  const getItemsForDate = (date: Date) => {
    const dayAssignments = assignments.filter(assignment => 
      isSameDay(parseISO(assignment.dueDate), date)
    )
    
    const dayEvents = events.filter(event => 
      isSameDay(parseISO(event.startDate), date)
    )

    return { assignments: dayAssignments, events: dayEvents }
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

  const filteredItems = () => {
    let filteredAssignments = assignments
    let filteredEvents = events

    if (selectedTerm !== 'all') {
      filteredAssignments = assignments.filter(a => a.termId === selectedTerm)
      filteredEvents = events.filter(e => e.termId === selectedTerm)
    }

    return { assignments: filteredAssignments, events: filteredEvents }
  }

  const { assignments: filteredAssignments, events: filteredEvents } = filteredItems()

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="h-6 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const selectedDateItems = getItemsForDate(selectedDate)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Calendar View</h2>
          <p className="text-muted-foreground">View your assignments and events in calendar format</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedTerm} onValueChange={setSelectedTerm}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Terms</SelectItem>
              {terms.map((term) => (
                <SelectItem key={term.id} value={term.id}>
                  {term.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={goToToday}>
            <CalendarDays className="h-4 w-4 mr-2" />
            Today
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>{format(currentDate, 'MMMM yyyy')}</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {monthDays.map((day, index) => {
                const { assignments: dayAssignments, events: dayEvents } = getItemsForDate(day)
                const hasItems = dayAssignments.length > 0 || dayEvents.length > 0
                const isSelected = isSameDay(day, selectedDate)
                const isCurrentMonth = isSameMonth(day, currentDate)
                
                return (
                  <div
                    key={index}
                    className={`
                      min-h-20 p-1 border rounded-lg cursor-pointer transition-colors
                      ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                      ${!isCurrentMonth ? 'opacity-50' : ''}
                    `}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="text-sm font-medium mb-1">
                      {format(day, 'd')}
                    </div>
                    {hasItems && (
                      <div className="space-y-1">
                        {dayAssignments.slice(0, 2).map((assignment) => (
                          <div
                            key={assignment.id}
                            className={`text-xs p-1 rounded truncate ${
                              isSelected ? 'bg-primary-foreground/20' : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            <BookOpen className="h-3 w-3 inline mr-1" />
                            {assignment.title}
                          </div>
                        ))}
                        {dayEvents.slice(0, 1).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded truncate ${
                              isSelected ? 'bg-primary-foreground/20' : 'bg-green-100 text-green-800'
                            }`}
                          >
                            <Clock className="h-3 w-3 inline mr-1" />
                            {event.title}
                          </div>
                        ))}
                        {(dayAssignments.length > 2 || dayEvents.length > 1) && (
                          <div className="text-xs text-muted-foreground">
                            +{dayAssignments.length + dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>{format(selectedDate, 'MMMM dd, yyyy')}</span>
            </CardTitle>
            <CardDescription>
              Assignments and events for selected date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {selectedDateItems.assignments.length === 0 && selectedDateItems.events.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No assignments or events for this date
                </p>
              ) : (
                <>
                  {selectedDateItems.assignments.map((assignment) => (
                    <div key={assignment.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm flex items-center">
                          <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                          {assignment.title}
                        </h4>
                        <div className="flex items-center space-x-1">
                          <Badge variant={getPriorityColor(assignment.priority)} className="text-xs">
                            P{assignment.priority}
                          </Badge>
                          <Badge variant={getStatusColor(assignment.status)} className="text-xs">
                            {assignment.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      {assignment.course && (
                        <p className="text-xs text-muted-foreground mb-1">
                          {assignment.course.name} {assignment.course.code && `(${assignment.course.code})`}
                        </p>
                      )}
                      {assignment.description && (
                        <p className="text-xs text-muted-foreground">
                          {assignment.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Due: {format(parseISO(assignment.dueDate), 'HH:mm')}
                      </p>
                    </div>
                  ))}
                  
                  {selectedDateItems.events.map((event) => (
                    <div key={event.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-green-600" />
                          {event.title}
                        </h4>
                        <Badge variant={getEventTypeColor(event.type)} className="text-xs">
                          {event.type}
                        </Badge>
                      </div>
                      {event.location && (
                        <p className="text-xs text-muted-foreground mb-1">
                          📍 {event.location}
                        </p>
                      )}
                      {event.description && (
                        <p className="text-xs text-muted-foreground">
                          {event.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(parseISO(event.startDate), 'HH:mm')} - {format(parseISO(event.endDate), 'HH:mm')}
                      </p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Upcoming Assignments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {filteredAssignments
                .filter(a => a.status !== 'COMPLETED')
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .slice(0, 5)
                .map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {assignment.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {assignment.course?.name || 'No course'} • {format(parseISO(assignment.dueDate), 'MMM dd, HH:mm')}
                      </p>
                    </div>
                    <Badge variant={getPriorityColor(assignment.priority)} className="text-xs">
                      P{assignment.priority}
                    </Badge>
                  </div>
                ))}
              {filteredAssignments.filter(a => a.status !== 'COMPLETED').length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No upcoming assignments
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Upcoming Events</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {filteredEvents
                .filter(e => new Date(e.startDate) > new Date())
                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                .slice(0, 5)
                .map((event) => (
                  <div key={event.id} className="flex items-center justify-between space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(event.startDate), 'MMM dd, HH:mm')}
                        {event.location && ` • ${event.location}`}
                      </p>
                    </div>
                    <Badge variant={getEventTypeColor(event.type)} className="text-xs">
                      {event.type}
                    </Badge>
                  </div>
                ))}
              {filteredEvents.filter(e => new Date(e.startDate) > new Date()).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No upcoming events
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}