'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Plus, Edit, Trash2, MapPin, Clock } from 'lucide-react'
import { format } from 'date-fns'

interface Event {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  location?: string
  type: 'GENERAL' | 'EXAM' | 'PROJECT' | 'MEETING' | 'HOLIDAY'
  termId: string
  term: {
    name: string
  }
}

interface Term {
  id: string
  name: string
}

interface EventFormData {
  title: string
  description?: string
  startDate: string
  endDate: string
  location?: string
  type: 'GENERAL' | 'EXAM' | 'PROJECT' | 'MEETING' | 'HOLIDAY'
  termId: string
}

export function EventsManager() {
  const [events, setEvents] = useState<Event[]>([])
  const [terms, setTerms] = useState<Term[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    type: 'GENERAL',
    termId: ''
  })

  useEffect(() => {
    fetchEvents()
    fetchTerms()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  const fetchTerms = async () => {
    try {
      const response = await fetch('/api/terms')
      if (response.ok) {
        const data = await response.json()
        setTerms(data)
      }
    } catch (error) {
      console.error('Error fetching terms:', error)
      setTerms([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingEvent ? `/api/events/${editingEvent.id}` : '/api/events'
      const method = editingEvent ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchEvents()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error saving event:', error)
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description || '',
      startDate: event.startDate.split('T')[0] + 'T' + event.startDate.split('T')[1]?.substring(0, 5),
      endDate: event.endDate.split('T')[0] + 'T' + event.endDate.split('T')[1]?.substring(0, 5),
      location: event.location || '',
      type: event.type,
      termId: event.termId
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`/api/events/${eventId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchEvents()
        }
      } catch (error) {
        console.error('Error deleting event:', error)
      }
    }
  }

  const resetForm = () => {
    setEditingEvent(null)
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      location: '',
      type: 'GENERAL',
      termId: ''
    })
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

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'EXAM': return '📝'
      case 'PROJECT': return '🚀'
      case 'MEETING': return '👥'
      case 'HOLIDAY': return '🎉'
      default: return '📅'
    }
  }

  const isUpcoming = (startDate: string) => {
    return new Date(startDate) > new Date()
  }

  const isPast = (endDate: string) => {
    return new Date(endDate) < new Date()
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Events</h2>
          <p className="text-muted-foreground">Manage your academic events and schedule</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </DialogTitle>
              <DialogDescription>
                Create or edit an event with date, time, and location details.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="col-span-3"
                    placeholder="e.g., Final Exam"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="col-span-3"
                    placeholder="Event description..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startDate" className="text-right">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endDate" className="text-right">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="col-span-3"
                    placeholder="e.g., Room 101"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GENERAL">General</SelectItem>
                      <SelectItem value="EXAM">Exam</SelectItem>
                      <SelectItem value="PROJECT">Project</SelectItem>
                      <SelectItem value="MEETING">Meeting</SelectItem>
                      <SelectItem value="HOLIDAY">Holiday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="termId" className="text-right">
                    Term
                  </Label>
                  <Select
                    value={formData.termId}
                    onValueChange={(value) => setFormData({ ...formData, termId: value })}
                    required
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a term" />
                    </SelectTrigger>
                    <SelectContent>
                      {terms.map((term) => (
                        <SelectItem key={term.id} value={term.id}>
                          {term.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {events.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No events yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first event to start tracking your academic schedule.
              </p>
              {terms.length === 0 && (
                <p className="text-sm text-muted-foreground text-center">
                  You need to create a term first before adding events.
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          events
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
            .map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center space-x-2">
                        <span>{getEventTypeIcon(event.type)} {event.title}</span>
                        <Badge variant={getEventTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                        {isUpcoming(event.startDate) && (
                          <Badge variant="secondary">Upcoming</Badge>
                        )}
                        {isPast(event.endDate) && (
                          <Badge variant="outline">Past</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {format(new Date(event.startDate), 'MMM dd, yyyy HH:mm')} - {format(new Date(event.endDate), 'MMM dd, yyyy HH:mm')}
                          </span>
                        </span>
                        {event.location && (
                          <span className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </span>
                        )}
                        {event.term.name && (
                          <span>Term: {event.term.name}</span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(event)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {event.description && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </CardContent>
                )}
              </Card>
            ))
        )}
      </div>
    </div>
  )
}