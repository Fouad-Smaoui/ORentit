-- Get a profile ID to use for the test
WITH profile_id AS (
  SELECT id FROM profiles LIMIT 1
)
-- Insert multiple test items
INSERT INTO items (
  name,
  description,
  category,
  price_per_day,
  location,
  photos,
  status,
  owner_id
) VALUES
  (
    'Tesla Model 3',
    'Electric car in perfect condition. Features autopilot, premium interior, and long-range battery.',
    'vehicles',
    150.00,
    'New York, NY',
    ARRAY['https://images.unsplash.com/photo-1561580125-028ee3bd62eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'],
    'available',
    (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1)
  ),
  (
    'Mountain Bike',
    'Professional mountain bike, barely used. Perfect for trail riding and adventures.',
    'vehicles',
    35.00,
    'Los Angeles, CA',
    ARRAY['https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1548&q=80'],
    'available',
    (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1)
  ),
  (
    'Electric Scooter',
    'Portable electric scooter with 20km range. Perfect for city commuting.',
    'vehicles',
    25.00,
    'Chicago, IL',
    ARRAY['https://images.unsplash.com/photo-1604868189265-c6de9e333e36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'],
    'available',
    (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1)
  ),
  (
    'Camping Tent',
    '4-person tent, waterproof and easy to set up. Perfect for family camping.',
    'leisure',
    30.00,
    'Denver, CO',
    ARRAY['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'],
    'available',
    (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1)
  ),
  (
    'Photography Kit',
    'Complete DSLR camera kit with lenses. Great for professional shoots.',
    'leisure',
    75.00,
    'San Francisco, CA',
    ARRAY['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1464&q=80'],
    'available',
    (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1)
  ),
  (
    'Gaming Console',
    'Latest gaming console with 2 controllers and popular games.',
    'leisure',
    35.00,
    'Boston, MA',
    ARRAY['https://images.unsplash.com/photo-1605901309584-818e25960a8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1619&q=80'],
    'available',
    (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1)
  );
RETURNING *; 