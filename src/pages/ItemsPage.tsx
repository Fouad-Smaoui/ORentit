import React, { useEffect, useState } from 'react';
import ItemCard from '../components/ItemCard';
import { createClient } from '@supabase/supabase-js';
import { useSearchParams } from 'react-router-dom';
import { getItems } from '../lib/supabase';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Log environment variables for debugging
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Anon Key:', '[REDACTED]');

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Environment check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  });
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface DatabaseItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price_per_day: number;
  location: string;
  location_id: string | null;
  latitude: number | null;
  longitude: number | null;
  photos: string[];
  owner_id: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
}

interface Profile {
  username: string;
  avatar_url: string | null;
}

interface Item {
  id: string;
  name: string;
  description: string;
  category: string;
  price_per_day: number;
  location: string;
  location_id: string | null;
  latitude: number | null;
  longitude: number | null;
  image_url: string;
  owner_id: string;
  created_at: string;
  profiles: Profile;
}

async function insertTestData() {
  try {
    const testItems = [
      {
        name: 'Power Tools Set',
        description: 'Complete set of power tools for home improvement',
        category: 'tools',
        price_per_day: 30.00,
        location: 'Bordeaux, France',
        photos: ['https://images.unsplash.com/photo-1581147036324-c1c78bef8855?w=800&auto=format&fit=crop'],
        status: 'available'
      },
      {
        name: 'Professional Camera',
        description: 'DSLR camera with multiple lenses, perfect for photography',
        category: 'electronics',
        price_per_day: 75.00,
        location: 'Paris, France',
        photos: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop'],
        status: 'available'
      },
      {
        name: 'Camping Tent',
        description: '4-person tent, waterproof and easy to set up',
        category: 'outdoor',
        price_per_day: 25.00,
        location: 'Lyon, France',
        photos: ['https://images.unsplash.com/photo-1478827387698-1527781a4887?w=800&auto=format&fit=crop'],
        status: 'available'
      }
    ];

    console.log('Preparing to insert test items with photos:', 
      testItems.map(item => ({
        name: item.name,
        photo: item.photos[0]
      }))
    );

    // Get the first profile to use as owner
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (profileError) throw profileError;
    if (!profiles || profiles.length === 0) {
      throw new Error('No profiles found');
    }

    const owner_id = profiles[0].id;

    // Delete existing items first
    const { error: deleteError } = await supabase
      .from('items')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
      console.error('Error deleting existing items:', deleteError);
    }

    // Insert the test items
    const { data, error } = await supabase
      .from('items')
      .insert(testItems.map(item => ({
        ...item,
        owner_id
      })))
      .select();

    if (error) {
      console.error('Error inserting items:', error);
      throw error;
    }

    console.log('Successfully inserted test items:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error inserting test data:', error);
    throw error;
  }
}

export function ItemsPage() {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add state for price range
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

  useEffect(() => {
    async function fetchItems() {
      try {
        setLoading(true);
        const category = searchParams.get('category');
        const [minPrice, maxPrice] = priceRange;
        const data = await getItems({
          category: category || undefined,
          minPrice,
          maxPrice,
        });
        if (data) setItems(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, [searchParams, priceRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl font-semibold">Error loading items</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-600">No items available</p>
          <p className="mt-2 text-gray-500">Check back later for new items!</p>
        </div>
      </div>
    );
  }

  const category = searchParams.get('category');
  const categoryTitle = category ? 
    `${category.charAt(0).toUpperCase() + category.slice(1)} for Rent` : 
    'Available Items';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{categoryTitle}</h1>
            <p className="mt-2 text-gray-600">Browse through our collection of items available for rent</p>
          </div>
          {/* Stylish Price Range Filter */}
          <Box
            sx={{
              minWidth: 180,
              maxWidth: 220,
              bgcolor: 'white',
              boxShadow: 3,
              borderRadius: 3,
              p: 2,
              mt: { xs: 6, md: 0 },
              ml: { md: 6 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            className="transition-shadow duration-300 hover:shadow-lg"
          >
            <Typography gutterBottom variant="subtitle2" sx={{ fontWeight: 600, color: '#a100ff', mb: 0.5 }}>
              Price Range
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, color: '#555', fontSize: 13 }}>
              ${priceRange[0]} - ${priceRange[1]}
            </Typography>
            <Slider
              value={priceRange}
              onChange={(_, newValue) => setPriceRange(newValue as [number, number])}
              valueLabelDisplay="auto"
              min={0}
              max={500}
              step={1}
              sx={{
                color: '#a100ff',
                width: '90%',
                '& .MuiSlider-thumb': {
                  boxShadow: '0 2px 8px rgba(161,0,255,0.15)',
                  border: '2px solid #a100ff',
                  width: 18,
                  height: 18,
                },
                '& .MuiSlider-rail': {
                  opacity: 0.3,
                },
                '& .MuiSlider-track': {
                  border: 'none',
                },
              }}
            />
          </Box>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 