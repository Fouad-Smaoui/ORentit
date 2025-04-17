import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: `${__dirname}/../.env` });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyData() {
  try {
    // Check profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) throw profilesError;
    console.log('\n=== Profiles ===');
    console.log(`Found ${profiles.length} profiles:`);
    profiles.forEach(profile => {
      console.log(`- ${profile.full_name} (${profile.email})`);
    });

    // Check items
    const { data: items, error: itemsError } = await supabase
      .from('items')
      .select('*, profiles(full_name)');

    if (itemsError) throw itemsError;
    console.log('\n=== Items ===');
    console.log(`Found ${items.length} items:`);
    items.forEach(item => {
      console.log(`- ${item.title} (${item.category}) - Listed by: ${item.profiles?.full_name}`);
    });

  } catch (error) {
    console.error('Error verifying data:', error);
  }
}

verifyData(); 