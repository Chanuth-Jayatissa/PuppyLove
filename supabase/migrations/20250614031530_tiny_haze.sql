/*
  # Add first_name column to users table

  1. Changes
    - Add `first_name` column to users table
    - Update existing users to have a default first name based on username

  2. Security
    - No changes to RLS policies needed
*/

-- Add first_name column to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'first_name'
  ) THEN
    ALTER TABLE users ADD COLUMN first_name text;
  END IF;
END $$;

-- Update existing users to have a first name (optional, for existing data)
UPDATE users 
SET first_name = COALESCE(split_part(username, ' ', 1), username)
WHERE first_name IS NULL;