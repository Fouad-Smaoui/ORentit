import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Item {
  id: string;
  user_id: string;
  owner_id: string;
  name: string;
  description: string;
  price_per_day: number;
  category: string;
  image_url: string;
  location: string;
  status: 'available' | 'rented' | 'unavailable';
  created_at: string;
  start_date: string;
  end_date: string;
}

export const ensurePublicBucket = async () => {
  try {
    // First check if user is authenticated
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (!session || authError) {
      throw new Error('You must be logged in to manage storage');
    }

    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      throw bucketsError;
    }

    const itemsBucket = buckets?.find(bucket => bucket.name === 'items');
    
    if (!itemsBucket) {
      // Try to create the bucket with public access
      const { data, error } = await supabase.storage.createBucket('items', {
        public: true,
        fileSizeLimit: 5242880, // 5MB in bytes
        allowedMimeTypes: ['image/*']
      });
      
      if (error) {
        console.error('Error creating items bucket:', error);
        // If bucket already exists but we don't have permission to see it,
        // we can still try to use it
        if (error.message.includes('already exists')) {
          console.log('Bucket already exists, proceeding with upload');
          return;
        }
        throw error;
      }
      console.log('Created items bucket:', data);
    }
  } catch (error) {
    console.error('Error ensuring items bucket exists:', error);
    throw error;
  }
};

export const uploadImage = async (file: File): Promise<string> => {
  try {
    // Check authentication first
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (!session || authError) {
      throw new Error('You must be logged in to upload images');
    }

    if (!file) throw new Error('No file provided');

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }

    // Create a unique file name with timestamp and random string
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}-${randomString}.${fileExt}`;
    const filePath = `${session.user.id}/${fileName}`; // Add user ID to path for better organization

    // Upload the file to Supabase Storage
    const { error: uploadError, data } = await supabase.storage
      .from('items')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (uploadError) {
      console.error('Upload error details:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    if (!data?.path) {
      throw new Error('Upload succeeded but file path is missing');
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('items')
      .getPublicUrl(data.path);

    if (!publicUrl) {
      throw new Error('Failed to get public URL for uploaded image');
    }

    console.log('Successfully uploaded image:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const createItem = async (item: Omit<Item, 'created_at' | 'id' | 'user_id' | 'owner_id'>) => {
  // Check authentication status
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (!session || sessionError) {
    console.error('No active session found:', sessionError);
    throw new Error('You must be logged in to create an item');
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (!user || userError) {
    console.error('Failed to get user:', userError);
    throw new Error('Could not verify user identity');
  }

  try {
    // Validate required fields
    if (!item.location) {
      throw new Error('Location is required');
    }

    // Create the item with all required fields
    const { data, error } = await supabase
      .from('items')
      .insert([
        {
          ...item, // Include all item fields
          user_id: user.id,
          owner_id: user.id,
          status: item.status || 'available',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to create item: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from insert operation');
    }

    console.log('Successfully created item:', data);
    return data;
  } catch (error) {
    console.error('Error in createItem:', error);
    throw error;
  }
};

export const updateItem = async (id: string, updates: Partial<Item>) => {
  const { data, error } = await supabase
    .from('items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteItem = async (id: string) => {
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getItems = async (filters?: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}) => {
  let query = supabase
    .from('items')
    .select('*, profiles(username, avatar_url)')
    .eq('status', 'available');

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  if (filters?.minPrice) {
    query = query.gte('price_per_day', filters.minPrice);
  }

  if (filters?.maxPrice) {
    query = query.lte('price_per_day', filters.maxPrice);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getItemById = async (id: string) => {
  const { data, error } = await supabase
    .from('items')
    .select('*, profiles(username, avatar_url)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const getUserItems = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};