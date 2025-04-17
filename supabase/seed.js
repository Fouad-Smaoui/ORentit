import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create client with service role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test items with minimal required fields
const testItems = [
  {
    title: 'Tesla Model 3',
    category: 'vehicles',
    user_id: null // Will be set later
  },
  {
    title: 'Mountain Bike',
    category: 'vehicles',
    user_id: null
  },
  {
    title: 'Electric Scooter',
    category: 'vehicles',
    user_id: null
  }
];

async function seedItems() {
  try {
    // Get a profile ID to use
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (profilesError) {
      console.error('Error fetching profile:', profilesError);
      return;
    }

    if (!profiles || profiles.length === 0) {
      console.error('No profiles found');
      return;
    }

    const userId = profiles[0].id;
    console.log('Using profile ID:', userId);

    // Insert items one by one
    for (const item of testItems) {
      item.user_id = userId;
      
      console.log('Attempting to insert:', item);
      
      const { data, error } = await supabase
        .from('items')
        .insert(item)
        .select();

      if (error) {
        console.error('Error inserting item:', error);
        continue;
      }

      console.log('Successfully inserted item:', data);

      // If insertion was successful, try to update with additional fields
      if (data && data[0]) {
        const itemId = data[0].id;
        const { error: updateError } = await supabase
          .from('items')
          .update({
            description: 'Test description',
            price: 100.00,
            location: 'Test location',
            status: 'available'
          })
          .eq('id', itemId);

        if (updateError) {
          console.error('Error updating item:', updateError);
        } else {
          console.log('Successfully updated item with additional fields');
        }
      }
    }

    // Verify all items
    const { data: allItems, error: verifyError } = await supabase
      .from('items')
      .select('*');

    if (verifyError) {
      console.error('Error verifying items:', verifyError);
    } else {
      console.log(`Found ${allItems.length} total items in database:`);
      allItems.forEach(item => {
        console.log(`- ${item.title} (${item.category})`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

seedItems(); 