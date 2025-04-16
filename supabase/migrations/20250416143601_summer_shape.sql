/*
  # Initial Schema Setup for ORentit

  1. New Tables
    - `profiles`
      - `id` (uuid, matches auth.users)
      - `username` (text)
      - `full_name` (text)
      - `avatar_url` (text)
      - `stripe_account_id` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `items`
      - `id` (uuid)
      - `owner_id` (uuid, references profiles)
      - `name` (text)
      - `description` (text)
      - `category` (text)
      - `price_per_day` (numeric)
      - `location` (text)
      - `coordinates` (point)
      - `photos` (text[])
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `availability`
      - `id` (uuid)
      - `item_id` (uuid, references items)
      - `start_date` (date)
      - `end_date` (date)

    - `bookings`
      - `id` (uuid)
      - `item_id` (uuid, references items)
      - `renter_id` (uuid, references profiles)
      - `start_date` (date)
      - `end_date` (date)
      - `total_price` (numeric)
      - `status` (text)
      - `stripe_payment_id` (text)
      - `created_at` (timestamp)

    - `messages`
      - `id` (uuid)
      - `sender_id` (uuid, references profiles)
      - `receiver_id` (uuid, references profiles)
      - `item_id` (uuid, references items)
      - `content` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
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

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create items table
CREATE TABLE items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles(id) NOT NULL,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  price_per_day numeric NOT NULL CHECK (price_per_day > 0),
  location text NOT NULL,
  coordinates point,
  photos text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
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

-- Create availability table
CREATE TABLE availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  CHECK (start_date <= end_date)
);

ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Availability is viewable by everyone"
  ON availability FOR SELECT
  USING (true);

CREATE POLICY "Users can manage availability for their items"
  ON availability FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM items
      WHERE items.id = availability.item_id
      AND items.owner_id = auth.uid()
    )
  );

-- Create bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  renter_id uuid REFERENCES profiles(id) NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  total_price numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  stripe_payment_id text,
  created_at timestamptz DEFAULT now(),
  CHECK (start_date <= end_date),
  CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'))
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

-- Create messages table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles(id) NOT NULL,
  receiver_id uuid REFERENCES profiles(id) NOT NULL,
  item_id uuid REFERENCES items(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their messages"
  ON messages FOR SELECT
  USING (
    auth.uid() = sender_id OR
    auth.uid() = receiver_id
  );

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Create functions and triggers
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