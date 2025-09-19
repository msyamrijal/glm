'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CalendarDays, Plus, Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

interface Term {
  id: string
  name: string
  startDate: string
  endDate: string
  courses: any[]
  assignments: any[]
  events: any[]
}

interface TermFormData {
  name: string
  startDate: string
  endDate: string
}

export function TermsManager() {
  const [terms, setTerms] = useState<Term[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTerm, setEditingTerm] = useState<Term | null>(null)
  const [formData, setFormData] = useState<TermFormData>({
    name: '',
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    fetchTerms()
  }, [])

  const fetchTerms = async () => {
    try {
      const response = await fetch('/api/terms')
      if (response.ok) {
        const data = await response.json()
        setTerms(data)
      }
    } catch (error) {
      console.error('Error fetching terms:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingTerm ? `/api/terms/${editingTerm.id}` : '/api/terms'
      const method = editingTerm ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchTerms()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error saving term:', error)
    }
  }

  const handleEdit = (term: Term) => {
    setEditingTerm(term)
    setFormData({
      name: term.name,
      startDate: term.startDate.split('T')[0],
      endDate: term.endDate.split('T')[0]
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (termId: string) => {
    if (confirm('Are you sure you want to delete this term? This will also delete all associated courses, assignments, and events.')) {
      try {
        const response = await fetch(`/api/terms/${termId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchTerms()
        }
      } catch (error) {
        console.error('Error deleting term:', error)
      }
    }
  }

  const resetForm = () => {
    setEditingTerm(null)
    setFormData({
      name: '',
      startDate: '',
      endDate: ''
    })
  }

  const isCurrentTerm = (startDate: string, endDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)
    return now >= start && now <= end
  }

  const isUpcomingTerm = (startDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    return start > now
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
          <h2 className="text-2xl font-bold">Academic Terms</h2>
          <p className="text-muted-foreground">Manage your academic terms and semesters</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Term
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTerm ? 'Edit Term' : 'Add New Term'}
              </DialogTitle>
              <DialogDescription>
                Create or edit an academic term with start and end dates.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Term Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="col-span-3"
                    placeholder="e.g., Fall 2024"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startDate" className="text-right">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
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
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingTerm ? 'Update Term' : 'Create Term'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {terms.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No terms yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first academic term to get started with your planner.
              </p>
            </CardContent>
          </Card>
        ) : (
          terms.map((term) => (
            <Card key={term.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>{term.name}</span>
                      {isCurrentTerm(term.startDate, term.endDate) && (
                        <Badge variant="default">Current</Badge>
                      )}
                      {isUpcomingTerm(term.startDate) && (
                        <Badge variant="secondary">Upcoming</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {format(new Date(term.startDate), 'MMMM dd, yyyy')} - {format(new Date(term.endDate), 'MMMM dd, yyyy')}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(term)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(term.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}