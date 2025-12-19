import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/auth'
import type { User, UserDanceStyle } from '@/types/database'

// Query keys
export const profileKeys = {
  all: ['profile'] as const,
  me: () => [...profileKeys.all, 'me'] as const,
  danceStyles: () => [...profileKeys.all, 'dance-styles'] as const,
}

// Fetch my profile
async function fetchMyProfile(): Promise<User | null> {
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) return null

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  if (error) throw error
  return data
}

// Fetch my dance styles
async function fetchMyDanceStyles(): Promise<UserDanceStyle[]> {
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) return []

  const { data, error } = await supabase
    .from('user_dance_styles')
    .select(`
      *,
      dance_style:dance_styles(*)
    `)
    .eq('user_id', authUser.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Update profile
interface UpdateProfileData {
  name?: string
  bio?: string
  age?: number
  height?: number
  city?: string
  show_age?: boolean
  show_exact_location?: boolean
  is_trainer?: boolean
}

async function updateProfile(data: UpdateProfileData): Promise<User> {
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) throw new Error('Not authenticated')

  const { data: updated, error } = await supabase
    .from('users')
    .update(data)
    .eq('id', authUser.id)
    .select()
    .single()

  if (error) throw error
  return updated
}

// Upload profile photo
async function uploadProfilePhoto(file: File): Promise<string> {
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) throw new Error('Not authenticated')

  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = `${authUser.id}/${fileName}`

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from('profile-photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) throw uploadError

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(filePath)

  // Update user profile
  const { error: updateError } = await supabase
    .from('users')
    .update({ profile_photo_url: publicUrl })
    .eq('id', authUser.id)

  if (updateError) throw updateError

  return publicUrl
}

// Add dance style
interface AddDanceStyleData {
  dance_style_id: string
  skill_level: string
  years_experience?: number
  is_teaching?: boolean
}

async function addDanceStyle(data: AddDanceStyleData): Promise<UserDanceStyle> {
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) throw new Error('Not authenticated')

  const { data: created, error } = await supabase
    .from('user_dance_styles')
    .insert({
      ...data,
      user_id: authUser.id,
    })
    .select(`
      *,
      dance_style:dance_styles(*)
    `)
    .single()

  if (error) throw error
  return created
}

// Remove dance style
async function removeDanceStyle(id: string): Promise<void> {
  const { error } = await supabase
    .from('user_dance_styles')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Hooks
export function useMyProfile() {
  const user = useAuthStore((state) => state.user)

  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: fetchMyProfile,
    enabled: !!user,
    initialData: user,
  })
}

export function useMyDanceStyles() {
  const user = useAuthStore((state) => state.user)

  return useQuery({
    queryKey: profileKeys.danceStyles(),
    queryFn: fetchMyDanceStyles,
    enabled: !!user,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      // Update React Query cache
      queryClient.setQueryData(profileKeys.me(), updatedUser)
      // Update Zustand store
      setUser(updatedUser)
    },
  })
}

export function useUploadProfilePhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadProfilePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me() })
    },
  })
}

export function useAddDanceStyle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addDanceStyle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.danceStyles() })
    },
  })
}

export function useRemoveDanceStyle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeDanceStyle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.danceStyles() })
    },
  })
}
