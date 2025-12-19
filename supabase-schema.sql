-- ============================================
-- DanceMatch Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- LIKES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  liker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  liked_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate likes
  UNIQUE(liker_id, liked_id),

  -- Prevent self-likes
  CHECK (liker_id != liked_id)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_likes_liker_id ON likes(liker_id);
CREATE INDEX IF NOT EXISTS idx_likes_liked_id ON likes(liked_id);

-- ============================================
-- RLS POLICIES FOR LIKES
-- ============================================
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Users can see their own likes (sent and received)
CREATE POLICY "Users can view their own likes" ON likes
  FOR SELECT
  USING (auth.uid() = liker_id OR auth.uid() = liked_id);

-- Users can insert their own likes
CREATE POLICY "Users can insert their own likes" ON likes
  FOR INSERT
  WITH CHECK (auth.uid() = liker_id);

-- Users can delete their own likes
CREATE POLICY "Users can delete their own likes" ON likes
  FOR DELETE
  USING (auth.uid() = liker_id);

-- ============================================
-- MATCHES TABLE (for mutual likes)
-- ============================================
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unmatched')),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate matches (order-independent)
  UNIQUE(LEAST(user1_id, user2_id), GREATEST(user1_id, user2_id))
);

CREATE INDEX IF NOT EXISTS idx_matches_user1_id ON matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2_id ON matches(user2_id);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own matches" ON matches
  FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- ============================================
-- FUNCTION: Auto-create match on mutual like
-- ============================================
CREATE OR REPLACE FUNCTION create_match_on_mutual_like()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the other person has already liked this user
  IF EXISTS (
    SELECT 1 FROM likes
    WHERE liker_id = NEW.liked_id
    AND liked_id = NEW.liker_id
  ) THEN
    -- Create a match (use LEAST/GREATEST to ensure consistent ordering)
    INSERT INTO matches (user1_id, user2_id)
    VALUES (LEAST(NEW.liker_id, NEW.liked_id), GREATEST(NEW.liker_id, NEW.liked_id))
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create matches
DROP TRIGGER IF EXISTS trigger_create_match ON likes;
CREATE TRIGGER trigger_create_match
  AFTER INSERT ON likes
  FOR EACH ROW
  EXECUTE FUNCTION create_match_on_mutual_like();

-- ============================================
-- After running this schema, reload PostgREST:
-- Go to Supabase Dashboard > Settings > API > Click "Reload Schema"
-- ============================================
