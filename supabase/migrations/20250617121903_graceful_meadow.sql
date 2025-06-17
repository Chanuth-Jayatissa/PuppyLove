/*
# Sample Data Population

1. New Data
   - Dog avatars with personality traits
   - Lifestyle and values tags
   - Sample shelters in NYC area
   - Sample dogs with images and characteristics

2. Data Structure
   - Each dog has multiple images, tags, and fun facts
   - Shelters have geographic coordinates
   - All data uses proper foreign key relationships

3. Safety
   - Uses conditional inserts to avoid duplicates
   - Checks for existing data before insertion
   - Safe to run multiple times
*/

-- Insert Dog Avatars (check for existing first)
DO $$
BEGIN
  -- Insert dog avatars only if they don't exist
  IF NOT EXISTS (SELECT 1 FROM dog_avatars WHERE label = 'Corgi') THEN
    INSERT INTO dog_avatars (emoji, label, trait) VALUES ('🐕‍🦺', 'Corgi', 'Loyal & Low-key');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM dog_avatars WHERE label = 'Husky') THEN
    INSERT INTO dog_avatars (emoji, label, trait) VALUES ('🐺', 'Husky', 'Bold & Energetic');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM dog_avatars WHERE label = 'Golden') THEN
    INSERT INTO dog_avatars (emoji, label, trait) VALUES ('🦮', 'Golden', 'Warm & Friendly');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM dog_avatars WHERE label = 'Terrier') THEN
    INSERT INTO dog_avatars (emoji, label, trait) VALUES ('🐶', 'Terrier', 'Curious & Confident');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM dog_avatars WHERE label = 'Bulldog') THEN
    INSERT INTO dog_avatars (emoji, label, trait) VALUES ('🐕', 'Bulldog', 'Calm & Steady');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM dog_avatars WHERE label = 'Poodle') THEN
    INSERT INTO dog_avatars (emoji, label, trait) VALUES ('🐩', 'Poodle', 'Smart & Playful');
  END IF;
END $$;

-- Insert Tags (check for existing first)
DO $$
BEGIN
  -- Insert tags only if they don't exist
  IF NOT EXISTS (SELECT 1 FROM tags WHERE label = 'Nature-Loving') THEN
    INSERT INTO tags (label) VALUES ('Nature-Loving');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM tags WHERE label = 'Goofball Energy') THEN
    INSERT INTO tags (label) VALUES ('Goofball Energy');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM tags WHERE label = 'Morning Person') THEN
    INSERT INTO tags (label) VALUES ('Morning Person');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM tags WHERE label = 'Calm & Grounded') THEN
    INSERT INTO tags (label) VALUES ('Calm & Grounded');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM tags WHERE label = 'Likes Routine') THEN
    INSERT INTO tags (label) VALUES ('Likes Routine');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM tags WHERE label = 'Spontaneous Adventurer') THEN
    INSERT INTO tags (label) VALUES ('Spontaneous Adventurer');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM tags WHERE label = 'Patient with Dogs') THEN
    INSERT INTO tags (label) VALUES ('Patient with Dogs');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM tags WHERE label = 'Couch Cuddler') THEN
    INSERT INTO tags (label) VALUES ('Couch Cuddler');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM tags WHERE label = 'Shelter Volunteer') THEN
    INSERT INTO tags (label) VALUES ('Shelter Volunteer');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM tags WHERE label = 'Dog-Park Regular') THEN
    INSERT INTO tags (label) VALUES ('Dog-Park Regular');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM tags WHERE label = 'High Energy') THEN
    INSERT INTO tags (label) VALUES ('High Energy');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM tags WHERE label = 'Gentle Soul') THEN
    INSERT INTO tags (label) VALUES ('Gentle Soul');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM tags WHERE label = 'Playful Explorer') THEN
    INSERT INTO tags (label) VALUES ('Playful Explorer');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM tags WHERE label = 'Great with Kids') THEN
    INSERT INTO tags (label) VALUES ('Great with Kids');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM tags WHERE label = 'Smart Cookie') THEN
    INSERT INTO tags (label) VALUES ('Smart Cookie');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM tags WHERE label = 'Loves Fetch') THEN
    INSERT INTO tags (label) VALUES ('Loves Fetch');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM tags WHERE label = 'Gentle Giant') THEN
    INSERT INTO tags (label) VALUES ('Gentle Giant');
  END IF;
END $$;

-- Insert Shelters (check for existing first)
DO $$
BEGIN
  -- Insert shelters only if they don't exist
  IF NOT EXISTS (SELECT 1 FROM shelters WHERE name = 'Brooklyn Animal Care Center') THEN
    INSERT INTO shelters (name, address, lat_lng, contact) VALUES
    (
      'Brooklyn Animal Care Center',
      '2336 Linden Blvd, Brooklyn, NY 11208',
      ST_GeogFromText('POINT(-73.8776 40.6692)'),
      'info@brooklynacc.org'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM shelters WHERE name = 'Manhattan Animal Shelter') THEN
    INSERT INTO shelters (name, address, lat_lng, contact) VALUES
    (
      'Manhattan Animal Shelter',
      '326 E 110th St, New York, NY 10029',
      ST_GeogFromText('POINT(-73.9442 40.7957)'),
      'contact@manhattanshelter.org'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM shelters WHERE name = 'Queens Dog Rescue') THEN
    INSERT INTO shelters (name, address, lat_lng, contact) VALUES
    (
      'Queens Dog Rescue',
      '123-45 Northern Blvd, Flushing, NY 11354',
      ST_GeogFromText('POINT(-73.8370 40.7614)'),
      'help@queensdogrescue.org'
    );
  END IF;
END $$;

-- Insert Dogs (only if shelter exists and dog doesn't already exist)
DO $$
DECLARE
    brooklyn_shelter_id uuid;
    manhattan_shelter_id uuid;
    queens_shelter_id uuid;
BEGIN
    -- Get shelter IDs
    SELECT id INTO brooklyn_shelter_id FROM shelters WHERE name = 'Brooklyn Animal Care Center';
    SELECT id INTO manhattan_shelter_id FROM shelters WHERE name = 'Manhattan Animal Shelter';
    SELECT id INTO queens_shelter_id FROM shelters WHERE name = 'Queens Dog Rescue';
    
    -- Insert dogs for Brooklyn shelter
    IF brooklyn_shelter_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM dogs WHERE shelter_id = brooklyn_shelter_id AND name = 'Buddy') THEN
            INSERT INTO dogs (shelter_id, name, breed, age, size, distance, images, tags, fun_fact) VALUES
            (
              brooklyn_shelter_id,
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
            );
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM dogs WHERE shelter_id = brooklyn_shelter_id AND name = 'Bella') THEN
            INSERT INTO dogs (shelter_id, name, breed, age, size, distance, images, tags, fun_fact) VALUES
            (
              brooklyn_shelter_id,
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
            );
        END IF;
    END IF;
    
    -- Insert dogs for Manhattan shelter
    IF manhattan_shelter_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM dogs WHERE shelter_id = manhattan_shelter_id AND name = 'Luna') THEN
            INSERT INTO dogs (shelter_id, name, breed, age, size, distance, images, tags, fun_fact) VALUES
            (
              manhattan_shelter_id,
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
            );
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM dogs WHERE shelter_id = manhattan_shelter_id AND name = 'Charlie') THEN
            INSERT INTO dogs (shelter_id, name, breed, age, size, distance, images, tags, fun_fact) VALUES
            (
              manhattan_shelter_id,
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
        END IF;
    END IF;
    
    -- Insert dogs for Queens shelter
    IF queens_shelter_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM dogs WHERE shelter_id = queens_shelter_id AND name = 'Max') THEN
            INSERT INTO dogs (shelter_id, name, breed, age, size, distance, images, tags, fun_fact) VALUES
            (
              queens_shelter_id,
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
            );
        END IF;
    END IF;
END $$;

-- Note: Sample users, matches, messages, and bookings would typically be created
-- through the application flow rather than pre-populated, as they depend on
-- actual user authentication and real-time interactions.