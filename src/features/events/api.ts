import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Event, EventWithCounts, DanceStyle } from '@/types/database'

// Query keys
export const eventsKeys = {
  all: ['events'] as const,
  lists: () => [...eventsKeys.all, 'list'] as const,
  list: (filters: EventsFilters) => [...eventsKeys.lists(), filters] as const,
  details: () => [...eventsKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventsKeys.details(), id] as const,
  danceStyles: ['dance-styles'] as const,
}

export interface EventsFilters {
  page?: number
  pageSize?: number
  search?: string
  eventType?: string
  status?: string
  city?: string
}

interface EventsResponse {
  data: EventWithCounts[]
  count: number
}

// Fetch events list
async function fetchEvents(filters: EventsFilters): Promise<EventsResponse> {
  const { page = 1, pageSize = 12, search, eventType, status = 'published' } = filters

  let query = supabase
    .from('v_events_with_counts')
    .select('*', { count: 'exact' })

  // Apply filters
  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  if (eventType && eventType !== 'all') {
    query = query.eq('event_type', eventType)
  }

  if (search) {
    query = query.ilike('title', `%${search}%`)
  }

  // Pagination
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await query
    .order('start_at', { ascending: true })
    .range(from, to)

  if (error) throw error

  return {
    data: data || [],
    count: count || 0,
  }
}

// Fetch single event
async function fetchEvent(id: string): Promise<EventWithCounts> {
  const { data, error } = await supabase
    .from('v_events_with_counts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

// Fetch dance styles
async function fetchDanceStyles(): Promise<DanceStyle[]> {
  const { data, error } = await supabase
    .from('dance_styles')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) throw error
  return data || []
}

// Create event
interface CreateEventData {
  title: string
  description?: string
  event_type: string
  dance_style_id?: string
  start_at: string
  end_at: string
  location_type: string
  location_name?: string
  address?: string
  city?: string
  online_platform?: string
  online_link?: string
  max_participants?: number
  skill_level_min?: string
  skill_level_max?: string
  price: number
  currency?: string
  requires_partner?: boolean
  visibility?: string
  status?: string
}

async function createEvent(data: CreateEventData): Promise<Event> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: event, error } = await supabase
    .from('events')
    .insert({
      ...data,
      organizer_id: user.id,
      currency: data.currency || 'PLN',
      min_participants: 1,
    })
    .select()
    .single()

  if (error) throw error
  return event
}

// Register for event
async function registerForEvent(eventId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('event_participants')
    .insert({
      event_id: eventId,
      user_id: user.id,
      status: 'registered',
    })

  if (error) throw error
}

// Hooks
export function useEvents(filters: EventsFilters = {}) {
  return useQuery({
    queryKey: eventsKeys.list(filters),
    queryFn: () => fetchEvents(filters),
  })
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: eventsKeys.detail(id),
    queryFn: () => fetchEvent(id),
    enabled: !!id,
  })
}

export function useDanceStyles() {
  return useQuery({
    queryKey: eventsKeys.danceStyles,
    queryFn: fetchDanceStyles,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventsKeys.lists() })
    },
  })
}

export function useRegisterForEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: registerForEvent,
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: eventsKeys.detail(eventId) })
      queryClient.invalidateQueries({ queryKey: eventsKeys.lists() })
    },
  })
}

// Fetch my events (as organizer)
async function fetchMyEvents(): Promise<EventWithCounts[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('v_events_with_counts')
    .select('*')
    .eq('organizer_id', user.id)
    .order('start_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Update event
interface UpdateEventData extends Partial<CreateEventData> {
  id: string
}

async function updateEvent({ id, ...data }: UpdateEventData): Promise<Event> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: event, error } = await supabase
    .from('events')
    .update(data)
    .eq('id', id)
    .eq('organizer_id', user.id) // Security: only owner can update
    .select()
    .single()

  if (error) throw error
  return event
}

// Delete event
async function deleteEvent(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
    .eq('organizer_id', user.id) // Security: only owner can delete

  if (error) throw error
}

// Hooks for my events
export function useMyEvents() {
  return useQuery({
    queryKey: [...eventsKeys.all, 'my'] as const,
    queryFn: fetchMyEvents,
  })
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateEvent,
    onSuccess: (event) => {
      queryClient.invalidateQueries({ queryKey: eventsKeys.detail(event.id) })
      queryClient.invalidateQueries({ queryKey: eventsKeys.lists() })
      queryClient.invalidateQueries({ queryKey: [...eventsKeys.all, 'my'] })
    },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventsKeys.lists() })
      queryClient.invalidateQueries({ queryKey: [...eventsKeys.all, 'my'] })
    },
  })
}
