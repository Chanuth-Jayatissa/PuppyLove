/*
  # PuppyLove Database Schema

  1. New Tables
    - `dog_avatars` - Personality-based dog avatars for users
    - `users` - Extended user profiles with dog preferences  
    - `tags` - Lifestyle and personality descriptors
    - `user_tags` - Many-to-many relationship between users and tags
    - `profile_prompts` - User responses to introspective prompts
    - `shelters` - Partner animal shelters with location data
    - `dogs` - Real adoptable dogs with photos and descriptions
    - `matches` - User-to-user match cycles with status tracking
    - `match_dog_likes` - Dog preferences during mini-matching phase
    - `messages` - Chat messages within matches
    - `bookings` - Confirmed shelter dog dates

  2. Security
    - Enable RLS on all tables
    - Add policies for secure data access
    - Users can only access their own data
    - Public read access for dogs, shelters, and avatars

  3. Sample Data
    - Dog avatars with personality traits
    - Lifestyle tags for user preferences
    - NYC area shelters with real locations
    - Adoptable dogs with Pexels photos
*/

-- Enable PostGIS extension for geographic data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create custom enum types
CREATE TYPE prompt_type AS ENUM ('ideal_day', 'dog_connection', 'weekend', 'dream_bond', 'fun_activity');
CREATE TYPE match_status AS ENUM ('pending', 'active', 'expired', 'booked');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'canceled');
CREATE TYPE dog_size AS ENUM ('Small', 'Medium', 'Large');

-- Create dog_avatars table
CREATE TABLE IF NOT EXISTS dog_avatars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  emoji text NOT NULL,
  label text NOT NULL UNIQUE,
  trait text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
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

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create user_tags junction table
CREATE TABLE IF NOT EXISTS user_tags (
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, tag_id)
);

-- Create profile_prompts table
CREATE TABLE IF NOT EXISTS profile_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  prompt_type prompt_type NOT NULL,
  answer text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, prompt_type)
);

-- Create shelters table
CREATE TABLE IF NOT EXISTS shelters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  lat_lng geography(POINT, 4326),
  contact text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create dogs table
CREATE TABLE IF NOT EXISTS dogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shelter_id uuid REFERENCES shelters(id) ON DELETE CASCADE,
  name text NOT NULL,
  breed text NOT NULL,
  age text NOT NULL,
  size dog_size NOT NULL,
  distance text NOT NULL,
  images text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  fun_fact text NOT NULL,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create matches table
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
  CONSTRAINT different_users CHECK (user1_id != user2_id)
);

-- Create match_dog_likes table
CREATE TABLE IF NOT EXISTS match_dog_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  dog_id uuid REFERENCES dogs(id) ON DELETE CASCADE,
  liked boolean NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(match_id, user_id, dog_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  sent_at timestamptz DEFAULT now()
);

-- Create bookings table
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

-- Enable Row Level Security on all tables
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

-- Create RLS policies

-- Dog avatars: Public read access
CREATE POLICY "Dog avatars are publicly readable"
  ON dog_avatars
  FOR SELECT
  TO public
  USING (true);

-- Users: Users can read and update their own profile
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
  TO public
  USING (true);

-- User tags: Users can manage their own tags
CREATE POLICY "Users can read own tags"
  ON user_tags
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tags"
  ON user_tags
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tags"
  ON user_tags
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Profile prompts: Users can manage their own prompts
CREATE POLICY "Users can read own prompts"
  ON profile_prompts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prompts"
  ON profile_prompts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prompts"
  ON profile_prompts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Shelters: Public read access
CREATE POLICY "Shelters are publicly readable"
  ON shelters
  FOR SELECT
  TO public
  USING (true);

-- Dogs: Public read access
CREATE POLICY "Dogs are publicly readable"
  ON dogs
  FOR SELECT
  TO public
  USING (true);

-- Matches: Users can read matches they're part of
CREATE POLICY "Users can read their matches"
  ON matches
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can update their matches"
  ON matches
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Match dog likes: Users can manage their own likes
CREATE POLICY "Users can read match dog likes"
  ON match_dog_likes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert match dog likes"
  ON match_dog_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update match dog likes"
  ON match_dog_likes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Messages: Users can read messages from their matches
CREATE POLICY "Users can read messages from their matches"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches 
      WHERE matches.id = match_id 
      AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages to their matches"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM matches 
      WHERE matches.id = match_id 
      AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
    )
  );

-- Bookings: Users can read bookings from their matches
CREATE POLICY "Users can read their bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches 
      WHERE matches.id = match_id 
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
      WHERE matches.id = match_id 
      AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
    )
  );

-- Insert sample data

-- Insert Dog Avatars
INSERT INTO dog_avatars (emoji, label, trait) VALUES
  ('🐕‍🦺', 'Corgi', 'Loyal & Low-key'),
  ('🐺', 'Husky', 'Bold & Energetic'),
  ('🦮', 'Golden', 'Warm & Friendly'),
  ('🐶', 'Terrier', 'Curious & Confident'),
  ('🐕', 'Bulldog', 'Calm & Steady'),
  ('🐩', 'Poodle', 'Smart & Playful');

-- Insert Tags
INSERT INTO tags (label) VALUES
  ('Nature-Loving'),
  ('Goofball Energy'),
  ('Morning Person'),
  ('Calm & Grounded'),
  ('Likes Routine'),
  ('Spontaneous Adventurer'),
  ('Patient with Dogs'),
  ('Couch Cuddler'),
  ('Shelter Volunteer'),
  ('Dog-Park Regular'),
  ('High Energy'),
  ('Gentle Soul'),
  ('Playful Explorer'),
  ('Great with Kids');

-- Insert Shelters
INSERT INTO shelters (name, address, lat_lng, contact) VALUES
  (
    'Brooklyn Animal Care Center',
    '2336 Linden Blvd, Brooklyn, NY 11208',
    ST_GeogFromText('POINT(-73.8776 40.6692)'),
    'info@brooklynacc.org'
  ),
  (
    'Manhattan Animal Shelter',
    '326 E 110th St, New York, NY 10029',
    ST_GeogFromText('POINT(-73.9442 40.7957)'),
    'contact@manhattanshelter.org'
  ),
  (
    'Queens Dog Rescue',
    '123-45 Northern Blvd, Flushing, NY 11354',
    ST_GeogFromText('POINT(-73.8370 40.7614)'),
    'help@queensdogrescue.org'
  );

-- Insert Dogs
INSERT INTO dogs (shelter_id, name, breed, age, size, distance, images, tags, fun_fact) VALUES
  (
    (SELECT id FROM shelters WHERE name = 'Brooklyn Animal Care Center'),
    'Buddy',
    'Golden Retriever',
    '2 years old',
    'Large',
    '3 miles from you',
    ARRAY[
      'https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg',
      'https://images.pexels.com/photos/160846/french-bulldog-summer-smile-joy-160846.jpeg',
      'https://images.pexels.com/photos/356378/pexels-photo-356378.jpeg'
    ],
    ARRAY['Playful Explorer', 'Great with Kids', 'High Energy'],
    'Loves sunbathing and rolling in grass!'
  ),
  (
    (SELECT id FROM shelters WHERE name = 'Manhattan Animal Shelter'),
    'Luna',
    'Border Collie',
    '1.5 years old',
    'Medium',
    '5 miles from you',
    ARRAY[
      'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg',
      'https://images.pexels.com/photos/97082/pexels-photo-97082.jpeg',
      'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'
    ],
    ARRAY['Smart Cookie', 'Gentle Soul', 'Loves Fetch'],
    'Can solve puzzle toys in under 5 minutes!'
  ),
  (
    (SELECT id FROM shelters WHERE name = 'Queens Dog Rescue'),
    'Max',
    'Labrador Mix',
    '3 years old',
    'Large',
    '4 miles from you',
    ARRAY[
      'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg',
      'https://images.pexels.com/photos/1490908/pexels-photo-1490908.jpeg',
      'https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg'
    ],
    ARRAY['Gentle Giant', 'Patient with Dogs', 'Couch Cuddler'],
    'Max loves squeaky toys and belly rubs!'
  ),
  (
    (SELECT id FROM shelters WHERE name = 'Brooklyn Animal Care Center'),
    'Bella',
    'Beagle',
    '4 years old',
    'Medium',
    '2 miles from you',
    ARRAY[
      'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg',
      'https://images.pexels.com/photos/1390361/pexels-photo-1390361.jpeg',
      'https://images.pexels.com/photos/1562983/pexels-photo-1562983.jpeg'
    ],
    ARRAY['Nature-Loving', 'Morning Person', 'Gentle Soul'],
    'Bella is a champion nap-taker and treat connoisseur!'
  ),
  (
    (SELECT id FROM shelters WHERE name = 'Manhattan Animal Shelter'),
    'Charlie',
    'French Bulldog',
    '2.5 years old',
    'Small',
    '6 miles from you',
    ARRAY[
      'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg',
      'https://images.pexels.com/photos/825949/pexels-photo-825949.jpeg',
      'https://images.pexels.com/photos/1390361/pexels-photo-1390361.jpeg'
    ],
    ARRAY['Calm & Grounded', 'Likes Routine', 'Great with Kids'],
    'Charlie snorts when he''s happy and loves short walks!'
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_dog_avatar ON users(dog_avatar_id);
CREATE INDEX IF NOT EXISTS idx_user_tags_user ON user_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tags_tag ON user_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_profile_prompts_user ON profile_prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_dogs_shelter ON dogs(shelter_id);
CREATE INDEX IF NOT EXISTS idx_dogs_available ON dogs(available);
CREATE INDEX IF NOT EXISTS idx_matches_user1 ON matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2 ON matches(user2_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_match_dog_likes_match ON match_dog_likes(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_match ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON messages(sent_at);
CREATE INDEX IF NOT EXISTS idx_bookings_match ON bookings(match_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date_time ON bookings(date_time);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profile_prompts_updated_at BEFORE UPDATE ON profile_prompts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dogs_updated_at BEFORE UPDATE ON dogs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();