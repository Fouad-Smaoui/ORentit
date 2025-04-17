import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test item data
const testItems = [
  // Vehicles
  {
    title: 'Tesla Model 3',
    category: 'vehicles',
    description: 'Electric car in perfect condition. Features autopilot, premium interior, and long-range battery.',
    price_per_day: 150.00,
    location: 'New York, NY',
    image_url: 'https://images.unsplash.com/photo-1561580125-028ee3bd62eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    status: 'available'
  },
  {
    title: 'Mountain Bike',
    category: 'vehicles',
    description: 'Professional mountain bike, barely used. Perfect for trail riding and adventures.',
    price_per_day: 35.00,
    location: 'Los Angeles, CA',
    image_url: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1548&q=80',
    status: 'available'
  },
  {
    title: 'Electric Scooter',
    category: 'vehicles',
    description: 'Portable electric scooter with 20km range. Perfect for city commuting.',
    price_per_day: 25.00,
    location: 'Chicago, IL',
    image_url: 'https://images.unsplash.com/photo-1604868189265-c6de9e333e36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    status: 'available'
  },
  {
    title: 'Kayak',
    category: 'vehicles',
    description: 'Two-person kayak with paddles. Great for lake or river adventures.',
    price_per_day: 45.00,
    location: 'Seattle, WA',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    status: 'available'
  },
  {
    title: 'Vintage Motorcycle',
    category: 'vehicles',
    description: 'Classic 1970s motorcycle, fully restored. A true head-turner.',
    price_per_day: 120.00,
    location: 'Austin, TX',
    image_url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    status: 'available'
  },
  // Leisure
  {
    title: 'Camping Tent',
    category: 'leisure',
    description: '4-person tent, waterproof and easy to set up. Perfect for family camping.',
    price_per_day: 30.00,
    location: 'Denver, CO',
    image_url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    status: 'available'
  },
  {
    title: 'DJ Equipment Set',
    category: 'leisure',
    description: 'Professional DJ setup with mixer and speakers. Perfect for events.',
    price_per_day: 100.00,
    location: 'Miami, FL',
    image_url: 'https://images.unsplash.com/photo-1571266028243-e4b6f08bae5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    status: 'available'
  },
  {
    title: 'Photography Kit',
    category: 'leisure',
    description: 'Complete DSLR camera kit with lenses. Great for professional shoots.',
    price_per_day: 75.00,
    location: 'San Francisco, CA',
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1464&q=80',
    status: 'available'
  },
  {
    title: 'Gaming Console',
    category: 'leisure',
    description: 'Latest gaming console with 2 controllers and popular games.',
    price_per_day: 35.00,
    location: 'Boston, MA',
    image_url: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1619&q=80',
    status: 'available'
  },
  {
    title: 'Outdoor Grill',
    category: 'leisure',
    description: 'Large propane grill with side burner. Perfect for BBQ parties.',
    price_per_day: 40.00,
    location: 'Dallas, TX',
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    status: 'available'
  }
];

async function seedItems() {
  try {
    // Get existing profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id');

    if (profilesError) throw profilesError;
    if (!profiles || profiles.length === 0) {
      throw new Error('No profiles found to associate items with');
    }

    // Create items and associate them with random profiles
    const items = testItems.map(item => ({
      ...item,
      user_id: profiles[Math.floor(Math.random() * profiles.length)].id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    // Insert items
    const { error: itemsError } = await supabase
      .from('items')
      .insert(items);

    if (itemsError) throw itemsError;

    // Verify the items were created
    const { data: createdItems, error: verifyError } = await supabase
      .from('items')
      .select('*');

    if (verifyError) {
      console.error('Error verifying items:', verifyError);
    } else {
      console.log(`Successfully created ${createdItems.length} items:`);
      createdItems.forEach(item => {
        console.log(`- ${item.title} (${item.category}) - $${item.price_per_day}`);
      });
    }

  } catch (error) {
    console.error('Error seeding items:', error);
  }
}

seedItems(); 