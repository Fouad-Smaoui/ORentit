/*
  Consolidated schema for ORentit.

  Replaces the previous fragmented migration history (which contained two
  conflicting `items` table definitions and tables with no application code
  behind them: `messages`, `availability`, `rentals`). This file reflects the
  schema the frontend actually reads/writes today, so it can be applied
  cleanly to a fresh Supabase project.
*/

-- profiles --------------------------------------------------------------
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text UNIQUE,
  full_name text,
  avatar_url text,
  stripe_account_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- locations ---------------------------------------------------------------
CREATE TABLE locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  latitude float NOT NULL,
  longitude float NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Locations are viewable by everyone"
  ON locations FOR SELECT
  USING (true);

INSERT INTO locations (name, latitude, longitude) VALUES
  ('Paris', 48.8566, 2.3522),
  ('Lyon', 45.7640, 4.8357),
  ('Marseille', 43.2965, 5.3698),
  ('Bordeaux', 44.8378, -0.5792),
  ('Toulouse', 43.6047, 1.4442),
  ('Nice', 43.7102, 7.2620),
  ('Nantes', 47.2184, -1.5536),
  ('Strasbourg', 48.5734, 7.7521),
  ('Montpellier', 43.6108, 3.8767),
  ('Lille', 50.6292, 3.0573);

-- items -------------------------------------------------------------------
CREATE TABLE items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles(id) NOT NULL,
  name text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('vehicles', 'leisure')),
  price_per_day numeric NOT NULL CHECK (price_per_day > 0),
  location text NOT NULL,
  location_id uuid REFERENCES locations(id),
  image_url text,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'rented', 'unavailable')),
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CHECK (start_date IS NULL OR end_date IS NULL OR start_date <= end_date)
);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Items are viewable by everyone"
  ON items FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own items"
  ON items FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own items"
  ON items FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own items"
  ON items FOR DELETE
  USING (auth.uid() = owner_id);

-- bookings ------------------------------------------------------------------
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  renter_id uuid REFERENCES profiles(id) NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  total_price numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  stripe_payment_id text,
  created_at timestamptz DEFAULT now(),
  CHECK (start_date <= end_date)
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their bookings"
  ON bookings FOR SELECT
  USING (
    auth.uid() = renter_id OR
    EXISTS (
      SELECT 1 FROM items
      WHERE items.id = bookings.item_id
      AND items.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = renter_id);

CREATE POLICY "Owners can update bookings on their items"
  ON bookings FOR UPDATE
  USING (
    auth.uid() = renter_id OR
    EXISTS (
      SELECT 1 FROM items
      WHERE items.id = bookings.item_id
      AND items.owner_id = auth.uid()
    )
  );

-- payments ------------------------------------------------------------------
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  item_id uuid REFERENCES items(id) NOT NULL,
  booking_id uuid REFERENCES bookings(id) NOT NULL,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_intent_id text UNIQUE,
  payment_method text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payments"
  ON payments FOR UPDATE
  USING (auth.uid() = user_id);

-- updated_at trigger ----------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- storage: item photos and avatars ------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('items', 'items', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- storage.objects already has RLS enabled by default on every Supabase
-- project, and the SQL editor role isn't its owner, so we don't re-enable it.

CREATE POLICY "Public can view item and avatar images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id IN ('items', 'avatars'));

CREATE POLICY "Authenticated users can upload item and avatar images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id IN ('items', 'avatars'));

CREATE POLICY "Users can update their own uploaded images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id IN ('items', 'avatars') AND auth.uid() = owner);

CREATE POLICY "Users can delete their own uploaded images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id IN ('items', 'avatars') AND auth.uid() = owner);
