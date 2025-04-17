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
    name: 'Electric Scooter',
    category: 'vehicles',
    description: 'Eco-friendly electric scooter with 30km range',
    price_per_day: 20.00,
    location: 'Lille, France',
    image_url: 'https://images.unsplash.com/photo-1604868189538-68474ba5c224?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    status: 'available'
  },
  {
    name: 'DJ Equipment',
    category: 'electronics',
    description: 'Complete DJ setup with mixer and speakers',
    price_per_day: 60.00,
    location: 'Strasbourg, France',
    image_url: 'https://images.unsplash.com/photo-1571935441005-07c3d3d56dcd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    status: 'available'
  },
  {
    name: 'Power Tools Set',
    category: 'tools',
    description: 'Complete set of power tools for home improvement',
    price_per_day: 30.00,
    location: 'Bordeaux, France',
    image_url: 'https://images.unsplash.com/photo-1581147036324-c1c9309b015f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    status: 'available'
  },
  {
    name: 'Gaming Console',
    category: 'electronics',
    description: 'Latest gaming console with 2 controllers',
    price_per_day: 35.00,
    location: 'Toulouse, France',
    image_url: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1619&q=80',
    status: 'available'
  },
  {
    name: 'Professional Drone',
    category: 'electronics',
    description: '4K camera drone with extra batteries',
    price_per_day: 45.00,
    location: 'Nice, France',
    image_url: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    status: 'available'
  },
  {
    name: 'Kayak Set',
    category: 'sports',
    description: 'Two-person kayak with paddles and life jackets',
    price_per_day: 40.00,
    location: 'Brest, France',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
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
        console.log(`- ${item.name} (${item.category}) - $${item.price_per_day}`);
      });
    }

  } catch (error) {
    console.error('Error seeding items:', error);
  }
}

seedItems(); 