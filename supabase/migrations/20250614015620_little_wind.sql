/*
  # PuppyLove Database Schema

  1. New Tables
    - `dog_avatars` - Stylized avatars representing user personalities
    - `users` - Core user profiles and identity
    - `tags` - Lifestyle and personality descriptors
    - `user_tags` - Many-to-many relationship between users and tags
    - `profile_prompts` - User responses to introspective prompts
    - `shelters` - Partner animal shelters
    - `dogs` - Real adoptable shelter dogs
    - `matches` - User-to-user match cycles
    - `match_dog_likes` - Dog preferences during mini-matching phase
    - `messages` - Chat messages within matches
    - `bookings` - Confirmed real-life shelter dog dates

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Secure cross-user interactions (matches, messages)

  3. Enums
    - prompt_type: Types of profile prompts
    - match_status: Status of matches
    - booking_status: Status of bookings
    - dog_size: Dog size categories
*/

-- Create enum types
CREATE TYPE prompt_type AS ENUM (
  'ideal_day',
  'dog_connection', 
  'weekend',
  'dream_bond',
  'fun_activity'
);

CREATE TYPE match_status AS ENUM (
  'pending',
  'active', 
  'expired',
  'booked'
);

CREATE TYPE booking_status AS ENUM (
  'pending',
  'confirmed',
  'canceled'
);

CREATE TYPE dog_size AS ENUM (
  'Small',
  'Medium',
  'Large'
);

-- Dog Avatars Table
CREATE TABLE IF NOT EXISTS dog_avatars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  emoji text NOT NULL,
  label text NOT NULL UNIQUE,
  trait text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Users Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  username text NOT NULL,
  dog_avatar_id uuid REFERENCES dog_avatars(id),
  bio text DEFAULT '',
  has_dog boolean DEFAULT false,
  volunteers boolean DEFAULT false,
  wants_adoption boolean DEFAULT false,
  profile_complete boolean DEFAULT false,
  preferred_energy text DEFAULT '',
  preferred_size text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tags Table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- User Tags Junction Table
CREATE TABLE IF NOT EXISTS user_tags (
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, tag_id)
);

-- Profile Prompts Table
CREATE TABLE IF NOT EXISTS profile_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  prompt_type prompt_type NOT NULL,
  answer text NOT NULL CHECK (length(answer) <= 300),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, prompt_type)
);

-- Shelters Table
CREATE TABLE IF NOT EXISTS shelters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  lat_lng geography(POINT, 4326),
  contact text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Dogs Table
CREATE TABLE IF NOT EXISTS dogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shelter_id uuid REFERENCES shelters(id) ON DELETE CASCADE,
  name text NOT NULL,
  breed text NOT NULL,
  age text NOT NULL,
  size dog_size NOT NULL,
  distance text NOT NULL,
  images text[] NOT NULL DEFAULT '{}',
  tags text[] NOT NULL DEFAULT '{}',
  fun_fact text NOT NULL,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Matches Table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid REFERENCES users(id) ON DELETE CASCADE,
  user2_id uuid REFERENCES users(id) ON DELETE CASCADE,
  start_date timestamptz DEFAULT now(),
  status match_status DEFAULT 'pending',
  chat_unlocked boolean DEFAULT false,
  dog_match_unlocked boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CHECK (user1_id != user2_id),
  UNIQUE(user1_id, user2_id)
);

-- Match Dog Likes Table
CREATE TABLE IF NOT EXISTS match_dog_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  dog_id uuid REFERENCES dogs(id) ON DELETE CASCADE,
  liked boolean NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(match_id, user_id, dog_id)
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL CHECK (length(content) > 0),
  sent_at timestamptz DEFAULT now()
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  dog_id uuid REFERENCES dogs(id) ON DELETE CASCADE,
  shelter_id uuid REFERENCES shelters(id) ON DELETE CASCADE,
  date_time timestamptz NOT NULL,
  status booking_status DEFAULT 'pending',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE dog_avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE shelters ENABLE ROW LEVEL SECURITY;
ALTER TABLE dogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_dog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Dog Avatars: Public read access
CREATE POLICY "Dog avatars are publicly readable"
  ON dog_avatars
  FOR SELECT
  TO authenticated
  USING (true);

-- Users: Users can read their own data and basic info of matched users
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Tags: Public read access
CREATE POLICY "Tags are publicly readable"
  ON tags
  FOR SELECT
  TO authenticated
  USING (true);

-- User Tags: Users can manage their own tags
CREATE POLICY "Users can manage own tags"
  ON user_tags
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Profile Prompts: Users can manage their own prompts
CREATE POLICY "Users can manage own prompts"
  ON profile_prompts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Shelters: Public read access
CREATE POLICY "Shelters are publicly readable"
  ON shelters
  FOR SELECT
  TO authenticated
  USING (true);

-- Dogs: Public read access for available dogs
CREATE POLICY "Available dogs are publicly readable"
  ON dogs
  FOR SELECT
  TO authenticated
  USING (available = true);

-- Matches: Users can see matches they're part of
CREATE POLICY "Users can see their matches"
  ON matches
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can update their matches"
  ON matches
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Match Dog Likes: Users can manage their own likes
CREATE POLICY "Users can manage their dog likes"
  ON match_dog_likes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Messages: Users can see messages in their matches
CREATE POLICY "Users can see messages in their matches"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches 
      WHERE matches.id = messages.match_id 
      AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their matches"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM matches 
      WHERE matches.id = messages.match_id 
      AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
    )
  );

-- Bookings: Users can see bookings for their matches
CREATE POLICY "Users can see their bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches 
      WHERE matches.id = bookings.match_id 
      AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can create bookings for their matches"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM matches 
      WHERE matches.id = bookings.match_id 
      AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_dog_avatar ON users(dog_avatar_id);
CREATE INDEX IF NOT EXISTS idx_user_tags_user ON user_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tags_tag ON user_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_profile_prompts_user ON profile_prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_dogs_shelter ON dogs(shelter_id);
CREATE INDEX IF NOT EXISTS idx_dogs_available ON dogs(available);
CREATE INDEX IF NOT EXISTS idx_matches_users ON matches(user1_id, user2_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_match_dog_likes_match ON match_dog_likes(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_match ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON messages(sent_at);
CREATE INDEX IF NOT EXISTS idx_bookings_match ON bookings(match_id);