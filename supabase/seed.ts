import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
    image_url: 'https://images.unsplash.com/photo-1566936737687-8f392a237b8b?auto=format&fit=crop&w=1470&q=80',
    status: 'available'
  },
  {
    name: 'DJ Equipment',
    category: 'leisure',
    description: 'Complete DJ setup with mixer and speakers',
    price_per_day: 60.00,
    location: 'Strasbourg, France',
    image_url: 'https://images.unsplash.com/photo-1571397133301-3f838ea96f56?auto=format&fit=crop&w=1470&q=80',
    status: 'available'
  },
  {
    name: 'Power Tools Set',
    category: 'leisure',
    description: 'Complete set of power tools for home improvement',
    price_per_day: 30.00,
    location: 'Bordeaux, France',
    image_url: 'https://images.unsplash.com/photo-1540103711724-ebf833bde8d1?auto=format&fit=crop&w=1470&q=80',
    status: 'available'
  },
  {
    name: 'Gaming Console',
    category: 'leisure',
    description: 'Latest gaming console with 2 controllers',
    price_per_day: 35.00,
    location: 'Toulouse, France',
    image_url: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1619&q=80',
    status: 'available'
  },
  {
    name: 'Professional Drone',
    category: 'leisure',
    description: '4K camera drone with extra batteries',
    price_per_day: 45.00,
    location: 'Nice, France',
    image_url: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    status: 'available'
  },
  {
    name: 'Kayak Set',
    category: 'leisure',
    description: 'Two-person kayak with paddles and life jackets',
    price_per_day: 40.00,
    location: 'Brest, France',
    image_url: 'https://images.unsplash.com/photo-1620903669944-de50fbe78210?auto=format&fit=crop&w=1470&q=80',
    status: 'available'
  },
  {
    name: 'Ski & Snowboard Gear Set',
    category: 'leisure',
    description: 'Complete alpine skis, poles, and boots, plus a snowboard option. Everything you need for a winter mountain getaway.',
    price_per_day: 50.00,
    location: 'Chamonix, France',
    image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    status: 'available'
  },
  {
    name: 'Wildlife Telephoto Lens Kit',
    category: 'leisure',
    description: '600mm telephoto lens with monopod, built for capturing wildlife and sweeping landscape shots from a distance.',
    price_per_day: 55.00,
    location: 'Annecy, France',
    image_url: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    status: 'available'
  },
  {
    name: 'Beach Vacation Bundle',
    category: 'leisure',
    description: 'Beach umbrella, two loungers, a cooler, and a snorkel set — everything for a relaxing day of warm sun and calm water.',
    price_per_day: 25.00,
    location: 'Nice, France',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    status: 'available'
  },
  {
    name: 'Vintage City Bike',
    category: 'vehicles',
    description: 'Classic step-through city bike, perfect for exploring historic city centers, museums, and cobblestone streets at a relaxed pace.',
    price_per_day: 18.00,
    location: 'Paris, France',
    image_url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
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
      owner_id: profiles[Math.floor(Math.random() * profiles.length)].id,
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