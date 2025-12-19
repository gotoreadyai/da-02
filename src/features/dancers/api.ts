import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { PublicDancer } from '@/types/database'

// Query keys
export const dancersKeys = {
  all: ['dancers'] as const,
  lists: () => [...dancersKeys.all, 'list'] as const,
  list: (filters: DancersFilters) => [...dancersKeys.lists(), filters] as const,
  details: () => [...dancersKeys.all, 'detail'] as const,
  detail: (id: string) => [...dancersKeys.details(), id] as const,
}

export interface DancersFilters {
  page?: number
  pageSize?: number
  search?: string
  city?: string
  danceStyleId?: string
}

interface DancersResponse {
  data: PublicDancer[]
  count: number
}

// Fetch dancers list
async function fetchDancers(filters: DancersFilters): Promise<DancersResponse> {
  const { page = 1, pageSize = 12, search, city, danceStyleId } = filters

  let query = supabase
    .from('v_public_dancers')
    .select('*', { count: 'exact' })

  // Apply filters
  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  if (city) {
    query = query.eq('city', city)
  }

  // Pagination
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    data: data || [],
    count: count || 0,
  }
}

// Fetch single dancer
async function fetchDancer(id: string): Promise<PublicDancer> {
  const { data, error } = await supabase
    .from('v_public_dancers')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

// Like a dancer
async function likeDancer(targetUserId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('likes')
    .insert({
      liker_id: user.id,
      liked_id: targetUserId,
    })

  if (error) throw error
}

// Unlike a dancer
async function unlikeDancer(targetUserId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('liker_id', user.id)
    .eq('liked_id', targetUserId)

  if (error) throw error
}

// Hooks
export function useDancers(filters: DancersFilters = {}) {
  return useQuery({
    queryKey: dancersKeys.list(filters),
    queryFn: () => fetchDancers(filters),
  })
}

export function useDancer(id: string) {
  return useQuery({
    queryKey: dancersKeys.detail(id),
    queryFn: () => fetchDancer(id),
    enabled: !!id,
  })
}

export function useLikeDancer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: likeDancer,
    onMutate: async (targetUserId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: dancersKeys.lists() })

      // Optimistically update the list
      queryClient.setQueriesData(
        { queryKey: dancersKeys.lists() },
        (old: DancersResponse | undefined) => {
          if (!old) return old
          return {
            ...old,
            data: old.data.map((dancer) =>
              dancer.id === targetUserId
                ? { ...dancer, i_liked: true }
                : dancer
            ),
          }
        }
      )

      // Optimistically update detail if cached
      queryClient.setQueryData(
        dancersKeys.detail(targetUserId),
        (old: PublicDancer | undefined) => {
          if (!old) return old
          return { ...old, i_liked: true }
        }
      )

      return { targetUserId }
    },
    onError: (err, targetUserId, context) => {
      // Rollback on error
      queryClient.invalidateQueries({ queryKey: dancersKeys.lists() })
      queryClient.invalidateQueries({ queryKey: dancersKeys.detail(targetUserId) })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: dancersKeys.lists() })
    },
  })
}

export function useUnlikeDancer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: unlikeDancer,
    onMutate: async (targetUserId) => {
      await queryClient.cancelQueries({ queryKey: dancersKeys.lists() })

      queryClient.setQueriesData(
        { queryKey: dancersKeys.lists() },
        (old: DancersResponse | undefined) => {
          if (!old) return old
          return {
            ...old,
            data: old.data.map((dancer) =>
              dancer.id === targetUserId
                ? { ...dancer, i_liked: false }
                : dancer
            ),
          }
        }
      )

      queryClient.setQueryData(
        dancersKeys.detail(targetUserId),
        (old: PublicDancer | undefined) => {
          if (!old) return old
          return { ...old, i_liked: false }
        }
      )

      return { targetUserId }
    },
    onError: (err, targetUserId) => {
      queryClient.invalidateQueries({ queryKey: dancersKeys.lists() })
      queryClient.invalidateQueries({ queryKey: dancersKeys.detail(targetUserId) })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: dancersKeys.lists() })
    },
  })
}
