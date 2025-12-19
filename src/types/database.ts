// Auto-generated types from Supabase - replace with actual generated types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id'>>
      }
      dance_styles: {
        Row: DanceStyle
        Insert: Omit<DanceStyle, 'id' | 'created_at'>
        Update: Partial<Omit<DanceStyle, 'id'>>
      }
      user_dance_styles: {
        Row: UserDanceStyle
        Insert: Omit<UserDanceStyle, 'id' | 'created_at'>
        Update: Partial<Omit<UserDanceStyle, 'id'>>
      }
      events: {
        Row: Event
        Insert: Omit<Event, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Event, 'id'>>
      }
      likes: {
        Row: Like
        Insert: Omit<Like, 'id' | 'created_at'>
        Update: never
      }
      matches: {
        Row: Match
        Insert: Omit<Match, 'id' | 'created_at'>
        Update: Partial<Omit<Match, 'id'>>
      }
      chat_conversations: {
        Row: ChatConversation
        Insert: Omit<ChatConversation, 'id' | 'created_at'>
        Update: Partial<Omit<ChatConversation, 'id'>>
      }
      chat_messages: {
        Row: ChatMessage
        Insert: Omit<ChatMessage, 'id' | 'created_at'>
        Update: Partial<Omit<ChatMessage, 'id'>>
      }
    }
    Views: {
      v_public_dancers: {
        Row: PublicDancer
      }
      v_events_with_counts: {
        Row: EventWithCounts
      }
    }
  }
}

// Core types
export interface User {
  id: string
  email: string
  name: string
  bio?: string
  age?: number
  height?: number
  profile_photo_url?: string
  city?: string
  location_lat?: number
  location_lng?: number
  is_trainer: boolean
  is_verified: boolean
  show_age: boolean
  show_exact_location: boolean
  role: 'user' | 'trainer' | 'admin'
  created_at: string
  updated_at: string
}

export interface DanceStyle {
  id: string
  name: string
  category: string
  description?: string
  is_active: boolean
  created_at: string
}

export interface UserDanceStyle {
  id: string
  user_id: string
  dance_style_id: string
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'professional'
  years_experience?: number
  is_teaching: boolean
  created_at: string
  dance_style?: DanceStyle
}

export interface Event {
  id: string
  organizer_id: string
  title: string
  description?: string
  event_type: 'lesson' | 'workshop' | 'social' | 'competition' | 'performance'
  dance_style_id?: string
  start_at: string
  end_at: string
  is_recurring: boolean
  location_type: 'physical' | 'online' | 'hybrid'
  location_name?: string
  address?: string
  city?: string
  location_lat?: number
  location_lng?: number
  online_platform?: string
  online_link?: string
  min_participants: number
  max_participants?: number
  skill_level_min?: string
  skill_level_max?: string
  price: number
  currency: string
  requires_partner: boolean
  status: 'draft' | 'published' | 'cancelled' | 'completed'
  visibility: 'public' | 'private' | 'unlisted'
  created_at: string
  updated_at: string
}

export interface Like {
  id: string
  liker_id: string
  liked_id: string
  created_at: string
}

export interface Match {
  id: string
  user1_id: string
  user2_id: string
  status: 'active' | 'unmatched'
  created_at: string
}

export interface ChatConversation {
  id: string
  current_user_id?: string
  other_participant?: {
    id: string
    name: string
    photo_url?: string
    is_online?: boolean
    last_seen?: string
  }
  last_message?: string
  last_message_at?: string
  last_message_sender_id?: string
  unread_count: number
  created_at: string
  updated_at?: string
}

export interface ChatMessage {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  is_read?: boolean
  created_at: string
}

// View types
export interface PublicDancer {
  id: string
  name: string
  bio?: string
  age?: number
  height?: number
  profile_photo_url?: string
  city?: string
  is_trainer: boolean
  is_verified: boolean
  created_at: string
  dance_styles?: {
    style_id: string
    style_name: string
    skill_level: string
    is_teaching: boolean
  }[]
  i_liked: boolean
  liked_me: boolean
  is_matched: boolean
}

export interface EventWithCounts extends Event {
  participant_count: number
  waitlist_count: number
  dance_style?: DanceStyle
}

// API response types
export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}
