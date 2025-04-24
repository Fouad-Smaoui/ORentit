-- Drop existing table if it exists
DROP TABLE IF EXISTS locations CASCADE;

-- Create locations table
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Locations are viewable by everyone" ON locations;

-- Allow public read access to locations
CREATE POLICY "Locations are viewable by everyone"
  ON locations FOR SELECT
  USING (true);

-- Clear existing data
TRUNCATE TABLE locations;

-- Insert initial data
INSERT INTO locations (name, latitude, longitude) VALUES
  ('Paris', 48.8566, 2.3522);

-- Add location_id to items table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'items' 
    AND column_name = 'location_id'
  ) THEN
    ALTER TABLE items
    ADD COLUMN location_id UUID REFERENCES locations(id);
  END IF;
END $$;

-- Insert some initial French cities
INSERT INTO locations (name, latitude, longitude) VALUES
  ('Lyon', 45.7640, 4.8357),
  ('Marseille', 43.2965, 5.3698),
  ('Bordeaux', 44.8378, -0.5792),
  ('Toulouse', 43.6047, 1.4442),
  ('Nice', 43.7102, 7.2620),
  ('Nantes', 47.2184, -1.5536),
  ('Strasbourg', 48.5734, 7.7521),
  ('Montpellier', 43.6108, 3.8767),
  ('Lille', 50.6292, 3.0573);

-- Update existing items to use location IDs where possible
UPDATE items i
SET location_id = l.id
FROM locations l
WHERE i.location ILIKE l.name;

-- We'll keep the location text field for now to avoid breaking existing functionality
-- but in a future migration we can make location_id required and remove the text field 