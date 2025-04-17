import React, { useEffect, useState } from 'react';
import ItemCard from '../components/ItemCard';
import { createClient } from '@supabase/supabase-js';

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
  photos: string[];
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
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchItems() {
      try {
        console.log('🔍 Starting to fetch items...');
        
        // Test Supabase connection
        const { data: testData, error: testError } = await supabase
          .from('items')
          .select('count');
        
        console.log('📊 Connection test result:', {
          success: !testError,
          error: testError?.message,
          count: testData?.[0]?.count
        });
        
        if (testError) {
          console.error('❌ Connection test failed:', testError);
          throw new Error(`Supabase connection test failed: ${testError.message}`);
        }

        // Fetch all items with detailed logging
        const { data, error } = await supabase
          .from('items')
          .select(`
            id,
            name,
            description,
            category,
            price_per_day,
            location,
            photos,
            owner_id,
            created_at,
            profiles (
              username,
              avatar_url
            )
          `)
          .order('created_at', { ascending: false });

        console.log('📦 Fetch result:', {
          success: !error,
          itemCount: data?.length ?? 0,
          firstItem: data?.[0] ? {
            id: data[0].id,
            name: data[0].name,
            hasPhotos: Array.isArray(data[0].photos),
            photoCount: Array.isArray(data[0].photos) ? data[0].photos.length : 0,
            hasProfile: !!data[0].profiles
          } : null,
          error: error?.message
        });

        if (error) throw error;
        
        if (!data || data.length === 0) {
          console.log('📝 No items found, inserting test data...');
          const testData = await insertTestData();
          console.log('✅ Test data inserted:', testData?.length ?? 0, 'items');
          // Fetch items again after inserting test data
          const { data: refetchData, error: refetchError } = await supabase
            .from('items')
            .select(`
              id,
              name,
              description,
              category,
              price_per_day,
              location,
              photos,
              owner_id,
              created_at,
              profiles (
                username,
                avatar_url
              )
            `);
          
          if (refetchError) throw refetchError;
          if (refetchData) {
            // Type assertion with runtime validation for refetched data
            const typedData = refetchData.map(item => {
              console.log('🔄 Processing item:', {
                id: item.id,
                name: item.name,
                photosType: typeof item.photos,
                profilesType: typeof item.profiles
              });

              const photos = Array.isArray(item.photos) ? item.photos : [];
              const profile: Profile = {
                username: item.profiles?.username ?? 'Unknown User',
                avatar_url: item.profiles?.avatar_url ?? null
              };

              return {
                ...item,
                photos,
                profiles: profile
              } as Item;
            });
            setItems(typedData);
            return;
          }
        }

        // Type assertion with runtime validation for initial data
        const typedData = data.map(item => {
          console.log('🔄 Processing item:', {
            id: item.id,
            name: item.name,
            photosType: typeof item.photos,
            profilesType: typeof item.profiles
          });

          const photos = Array.isArray(item.photos) ? item.photos : [];
          const profile: Profile = {
            username: item.profiles?.username ?? 'Unknown User',
            avatar_url: item.profiles?.avatar_url ?? null
          };

          return {
            ...item,
            photos,
            profiles: profile
          } as Item;
        });

        console.log('✅ Final processed items:', {
          count: typedData.length,
          sample: typedData.slice(0, 1).map(item => ({
            id: item.id,
            name: item.name,
            photoCount: item.photos.length,
            username: item.profiles.username
          }))
        });

        setItems(typedData);
      } catch (err) {
        console.error('❌ Error in fetchItems:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching items');
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading items...</p>
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Items</h1>
          <p className="mt-2 text-gray-600">Browse through our collection of items available for rent</p>
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