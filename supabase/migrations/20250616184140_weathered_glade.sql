-- Insert Dog Avatars (skip if already exists)
INSERT INTO dog_avatars (emoji, label, trait) VALUES
  ('🐕‍🦺', 'Corgi', 'Loyal & Low-key'),
  ('🐺', 'Husky', 'Bold & Energetic'),
  ('🦮', 'Golden', 'Warm & Friendly'),
  ('🐶', 'Terrier', 'Curious & Confident'),
  ('🐕', 'Bulldog', 'Calm & Steady'),
  ('🐩', 'Poodle', 'Smart & Playful')
ON CONFLICT (label) DO NOTHING;

-- Insert Tags (skip if already exists)
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
  ('Great with Kids')
ON CONFLICT (label) DO NOTHING;

-- Insert Shelters (using safe insert approach)
DO $$
BEGIN
    -- Insert Brooklyn Animal Care Center if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM shelters WHERE name = 'Brooklyn Animal Care Center') THEN
        INSERT INTO shelters (name, address, lat_lng, contact) VALUES
        (
            'Brooklyn Animal Care Center',
            '2336 Linden Blvd, Brooklyn, NY 11208',
            ST_GeogFromText('POINT(-73.8776 40.6692)'),
            'info@brooklynacc.org'
        );
    END IF;
    
    -- Insert Manhattan Animal Shelter if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM shelters WHERE name = 'Manhattan Animal Shelter') THEN
        INSERT INTO shelters (name, address, lat_lng, contact) VALUES
        (
            'Manhattan Animal Shelter',
            '326 E 110th St, New York, NY 10029',
            ST_GeogFromText('POINT(-73.9442 40.7957)'),
            'contact@manhattanshelter.org'
        );
    END IF;
    
    -- Insert Queens Dog Rescue if it doesn't exist
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
        -- Insert Buddy if doesn't exist
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
        
        -- Insert Bella if doesn't exist
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
        -- Insert Luna if doesn't exist
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
        
        -- Insert Charlie if doesn't exist
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
        -- Insert Max if doesn't exist
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

-- However, here are some example structures for testing:

-- Sample user data structure (would be created via auth.users first):
/*
INSERT INTO users (id, email, username, dog_avatar_id, bio, has_dog, volunteers, wants_adoption, profile_complete) VALUES
  (
    '4cbaaf2f-7681-4fd9-8c9a-bf712c42ab2d',
    'jamie@example.com',
    'Jamie',
    (SELECT id FROM dog_avatars WHERE label = 'Golden'),
    'Would love to chill at a dog café and play fetch in the park.',
    false,
    true,
    true,
    true
  );
*/

-- Sample profile prompts (would be created when user completes profile):
/*
INSERT INTO profile_prompts (user_id, prompt_type, answer) VALUES
  (
    '4cbaaf2f-7681-4fd9-8c9a-bf712c42ab2d',
    'ideal_day',
    'We''d run on the beach and nap in a sunny spot.'
  );
*/

-- Sample user tags (would be created when user selects tags):
/*
INSERT INTO user_tags (user_id, tag_id) VALUES
  (
    '4cbaaf2f-7681-4fd9-8c9a-bf712c42ab2d',
    (SELECT id FROM tags WHERE label = 'Nature-Loving')
  );
*/