import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test user data
const testUsers = [
  {
    email: 'test@example.com',
    password: 'Test123!',
    user_metadata: {
      full_name: 'Test User',
      avatar_url: 'https://ui-avatars.com/api/?name=Test+User&background=random'
    }
  }
];

async function seedUsers() {
  try {
    for (const user of testUsers) {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: user.user_metadata
      });

      if (authError) throw authError;

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            username: user.email.split('@')[0],
            full_name: user.user_metadata.full_name,
            avatar_url: user.user_metadata.avatar_url,
            updated_at: new Date().toISOString()
          }
        ]);

      if (profileError) throw profileError;

      console.log(`Successfully created test user: ${user.email}`);
      console.log('Login credentials:');
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
    }
  } catch (error) {
    console.error('Error seeding users:', error);
  }
}

seedUsers(); 