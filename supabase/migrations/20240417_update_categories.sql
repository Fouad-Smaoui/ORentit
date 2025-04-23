-- Update existing items to use new category system
UPDATE items
SET category = 'leisure'
WHERE category IN ('electronics', 'tools', 'sports', 'clothing', 'other', 'outdoor');

-- Add a check constraint to ensure only valid categories are used
ALTER TABLE items
ADD CONSTRAINT valid_categories
CHECK (category IN ('vehicles', 'leisure')); 