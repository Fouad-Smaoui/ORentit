-- Create rentals table
CREATE TABLE rentals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  renter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;

-- Policy for renters to view their own rentals
CREATE POLICY "Renters can view their own rentals"
  ON rentals FOR SELECT
  USING (auth.uid() = renter_id);

-- Policy for item owners to view rentals of their items
CREATE POLICY "Owners can view rentals of their items"
  ON rentals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM items
      WHERE items.id = rentals.item_id
      AND items.owner_id = auth.uid()
    )
  );

-- Policy for renters to create rentals
CREATE POLICY "Users can create rentals"
  ON rentals FOR INSERT
  WITH CHECK (auth.uid() = renter_id);

-- Policy for owners to update rental status
CREATE POLICY "Owners can update rental status"
  ON rentals FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM items
      WHERE items.id = rentals.item_id
      AND items.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM items
      WHERE items.id = rentals.item_id
      AND items.owner_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at
CREATE TRIGGER update_rentals_updated_at
  BEFORE UPDATE ON rentals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 