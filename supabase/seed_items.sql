-- Insert test items
INSERT INTO items (
  name,
  description,
  category,
  price_per_day,
  location,
  owner_id
)
VALUES 
  (
    'Mountain Bike',
    'High-quality mountain bike perfect for trails',
    'vehicles',
    25.00,
    'Paris, France',
    (SELECT id FROM profiles LIMIT 1)
  ),
  (
    'Camera Equipment',
    'Professional DSLR camera with lenses',
    'leisure',
    50.00,
    'Lyon, France',
    (SELECT id FROM profiles LIMIT 1)
  ),
  (
    'Camping Tent',
    '4-person tent with rain cover',
    'leisure',
    15.00,
    'Marseille, France',
    (SELECT id FROM profiles LIMIT 1)
  ),
  (
    'Power Tools Set',
    'Complete set of power tools for home improvement',
    'leisure',
    30.00,
    'Bordeaux, France',
    (SELECT id FROM profiles LIMIT 1)
  ); 