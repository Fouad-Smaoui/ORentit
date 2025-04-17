const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyItems() {
  const { data, error } = await supabase
    .from('items')
    .select('*');

  if (error) {
    console.error('Error fetching items:', error);
    return;
  }

  if (!data || data.length === 0) {
    console.log('No items found in the database');
    return;
  }

  console.log(`Found ${data.length} items:`);
  data.forEach(item => {
    console.log(`- ${item.title} (${item.category}) - $${item.price}`);
  });
}

verifyItems(); 