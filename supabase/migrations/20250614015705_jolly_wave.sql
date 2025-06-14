/*
  # Insert Sample Data for PuppyLove App

  1. Sample Data
    - Dog avatars with personality traits
    - Tags for lifestyle and values
    - Shelters with location data
    - Available dogs with photos and descriptions
    - Sample users with complete profiles
    - Active matches and conversations
    - Booking examples

  2. Purpose
    - Enable frontend testing and development
    - Demonstrate app functionality
    - Provide realistic data for UI components
*/

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